"""大腦：組合人格、使用者檔案、記憶，然後呼叫 Claude。

這就是一個最小的 agent loop：模型可以呼叫 `remember` 工具，把關於你的事寫進長期記憶。
之後要加的能力（搜尋活動、排行程、查 Garmin）都是在 TOOLS 裡多加一個工具。
"""
import datetime as dt
import os

from .memory import ROOT, Memory

AREAS = [
    "社交", "表達", "身心保養", "運動", "飲食", "潮流體驗", "知識吸收",
    "全球新知", "家人陪伴", "自我管理", "語言", "職涯", "其他",
]

TOOLS = [
    {
        "name": "remember",
        "description": (
            "把關於使用者、值得長期記住的事寫進記憶：目標、偏好、重要事件、"
            "她說過想做的事、她不喜歡的提醒方式等。閒聊細節不要記。"
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "area": {"type": "string", "enum": AREAS},
                "fact": {"type": "string", "description": "一句話，用第三人稱寫"},
            },
            "required": ["area", "fact"],
        },
    }
]


def _read(name: str) -> str:
    path = ROOT / name
    return path.read_text(encoding="utf-8") if path.exists() else ""


def build_system(mem: Memory) -> str:
    name = os.getenv("COMPANION_NAME", "夥伴")
    facts = "\n".join(f"- [{a}] {f}（{ts[:10]}）" for ts, a, f in mem.facts()) or "（還沒有）"
    checkins = "\n".join(
        f"- {d}｜精力 {e}/5｜{a or '無'}｜{n}" for d, e, a, n in mem.checkins()
    ) or "（還沒有）"
    now = dt.datetime.now().strftime("%Y-%m-%d %A %H:%M")
    return f"""{_read('app/persona.md').replace('{{NAME}}', name)}

# 關於她（她自己寫的檔案 me.md）
{_read('me.md')}

# 你記得的事
{facts}

# 最近兩週打卡
{checkins}

# 現在時間
{now}
"""


class Brain:
    def __init__(self, mem: Memory, client=None):
        self.mem = mem
        if client is None:
            from anthropic import Anthropic
            client = Anthropic()
        self.client = client
        self.model = os.getenv("COMPANION_MODEL", "claude-sonnet-5")

    def _run(self, messages: list[dict]) -> str:
        """agent loop：一直跑到模型不再呼叫工具為止。"""
        system = build_system(self.mem)
        for _ in range(5):  # 保險絲，避免無限迴圈
            resp = self.client.messages.create(
                model=self.model, max_tokens=1024, system=system,
                tools=TOOLS, messages=messages,
            )
            if resp.stop_reason != "tool_use":
                return "".join(b.text for b in resp.content if b.type == "text").strip()
            messages.append({"role": "assistant", "content": resp.content})
            results = []
            for block in resp.content:
                if block.type == "tool_use" and block.name == "remember":
                    self.mem.add_fact(block.input["area"], block.input["fact"])
                    results.append({"type": "tool_result", "tool_use_id": block.id, "content": "已記住"})
            messages.append({"role": "user", "content": results})
        return "（我想太久了，換個方式問我看看？）"

    def reply(self, user_text: str) -> str:
        """你說一句，它回一句。"""
        self.mem.add_message("user", user_text)
        text = self._run(self.mem.recent_messages())
        self.mem.add_message("assistant", text)
        return text

    def speak_first(self, trigger: str) -> str:
        """它主動開口（主動性的種子）：trigger 是給它的內部指示，不會存成你說的話。"""
        messages = self.mem.recent_messages()
        if messages and messages[-1]["role"] == "user":
            messages[-1]["content"] += f"\n\n（系統觸發）{trigger}"
        else:
            messages.append({"role": "user", "content": f"（系統觸發）{trigger}"})
        text = self._run(messages)
        self.mem.add_message("assistant", text)
        return text
