"""入口。用法：

    python -m app.main hello     # 它主動跟你打招呼（之後可以排程成每天早上自動跑）
    python -m app.main chat      # 跟它聊天
    python -m app.main checkin   # 一分鐘每日打卡
    python -m app.main review    # 請它做近期小結
"""
import argparse
import collections
import sys

from dotenv import load_dotenv

from .brain import AREAS, Brain
from .memory import ROOT, Memory


def say(name: str, text: str) -> None:
    print(f"\n🌱 {name}：{text}\n")


def cmd_hello(brain: Brain, name: str) -> None:
    say(name, brain.speak_first(
        "請主動跟她打招呼。依照現在時間和你記得的事，說一句自然、簡短的開場，"
        "可以問候、可以提一件她最近在意的事，也可以帶一點意料之外的東西。兩三句以內。"
    ))


def cmd_chat(brain: Brain, name: str) -> None:
    print("（輸入 bye 結束）")
    while True:
        try:
            text = input("你：").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if text.lower() in {"bye", "exit", "quit"}:
            break
        if text:
            say(name, brain.reply(text))


def cmd_checkin(brain: Brain, mem: Memory, name: str) -> None:
    print("—— 今日打卡（一分鐘）——")
    energy = input("今天精力幾分？(1-5)：").strip()
    energy = int(energy) if energy in {"1", "2", "3", "4", "5"} else 3
    print("今天有碰到哪些面向？輸入編號，空白分隔（沒有就直接 Enter）")
    print("  " + "  ".join(f"{i}.{a}" for i, a in enumerate(AREAS, 1)))
    picked = [AREAS[int(x) - 1] for x in input("> ").split() if x.isdigit() and 0 < int(x) <= len(AREAS)]
    note = input("用一句話說說今天：").strip()
    mem.add_checkin(energy, picked, note)
    say(name, brain.reply(
        f"[今日打卡] 精力 {energy}/5；碰到的面向：{'、'.join(picked) or '無'}；一句話：{note}"
    ))


def cmd_review(brain: Brain, mem: Memory, name: str) -> None:
    rows = mem.checkins(days=7)
    counts = collections.Counter(a for _, _, areas, _ in rows for a in areas.split(",") if a)
    avg = sum(e for _, e, _, _ in rows) / len(rows) if rows else 0
    stats = f"近 7 天打卡 {len(rows)} 次，平均精力 {avg:.1f}；各面向次數：{dict(counts) or '無'}"
    say(name, brain.speak_first(
        f"請做一份近期小結，像教練一樣。真實統計數據：{stats}。"
        "內容：1) 這段時間的樣子 2) 做得好的地方（要具體）3) 被冷落的面向 "
        "4) 下週一個小挑戰（小到一定做得到）。不要灌水稱讚，資料少就直說資料少。"
    ))


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    load_dotenv(ROOT / ".env")
    import os
    name = os.getenv("COMPANION_NAME", "夥伴")

    parser = argparse.ArgumentParser(description="你的 AI mentor／夥伴（種子版）")
    parser.add_argument("command", nargs="?", default="chat",
                        choices=["hello", "chat", "checkin", "review"])
    args = parser.parse_args()

    mem = Memory()
    brain = Brain(mem)
    {
        "hello": lambda: cmd_hello(brain, name),
        "chat": lambda: cmd_chat(brain, name),
        "checkin": lambda: cmd_checkin(brain, mem, name),
        "review": lambda: cmd_review(brain, mem, name),
    }[args.command]()


if __name__ == "__main__":
    main()
