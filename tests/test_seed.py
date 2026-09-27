"""不用 API key 就能跑的測試：用假的 client 驗證記憶和 agent loop。

    python -m unittest discover tests
"""
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace as NS

from app.brain import Brain, build_system
from app.memory import Memory


class FakeClient:
    """第一次呼叫 remember 工具，第二次回文字。"""

    def __init__(self):
        self.calls = []
        self.messages = self

    def create(self, **kwargs):
        self.calls.append(kwargs)
        if len(self.calls) == 1:
            return NS(stop_reason="tool_use", content=[
                NS(type="tool_use", id="t1", name="remember",
                   input={"area": "運動", "fact": "想跑完第一場半馬"}),
            ])
        return NS(stop_reason="end_turn", content=[NS(type="text", text="記住了，一起練！")])


class SeedTest(unittest.TestCase):
    def setUp(self):
        self.mem = Memory(Path(tempfile.mkdtemp()) / "t.db")

    def test_reply_uses_tool_and_remembers(self):
        client = FakeClient()
        text = Brain(self.mem, client=client).reply("我明年想跑半馬")
        self.assertEqual(text, "記住了，一起練！")
        self.assertEqual(self.mem.facts()[0][1:], ("運動", "想跑完第一場半馬"))
        self.assertIn("想跑完第一場半馬", build_system(self.mem))  # 下次說話時看得到

    def test_history_alternates_and_starts_with_user(self):
        self.mem.add_message("assistant", "早安")
        self.mem.add_message("user", "嗨")
        self.mem.add_message("user", "在嗎")
        self.mem.add_message("assistant", "在")
        msgs = self.mem.recent_messages()
        self.assertEqual([m["role"] for m in msgs], ["user", "assistant"])
        self.assertEqual(msgs[0]["content"], "嗨\n\n在嗎")

    def test_checkin_roundtrip(self):
        self.mem.add_checkin(4, ["運動", "語言"], "跑了 5K")
        self.assertEqual(self.mem.checkins()[0][1:], (4, "運動,語言", "跑了 5K"))


if __name__ == "__main__":
    unittest.main()
