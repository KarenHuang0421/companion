"""記憶層：用一個 SQLite 檔案存所有東西。

之後要換成 Mem0 / Zep 時，只要換掉這個檔案，其他地方不用動。
"""
import datetime as dt
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "companion.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY, ts TEXT, role TEXT, content TEXT
);
CREATE TABLE IF NOT EXISTS facts (
    id INTEGER PRIMARY KEY, ts TEXT, area TEXT, fact TEXT
);
CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY, date TEXT, energy INTEGER, areas TEXT, note TEXT
);
"""


def _now() -> str:
    return dt.datetime.now().isoformat(timespec="seconds")


class Memory:
    def __init__(self, path: Path = DB_PATH):
        path.parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(path)
        self.db.executescript(SCHEMA)

    # ---- 對話紀錄 ----
    def add_message(self, role: str, content: str) -> None:
        self.db.execute(
            "INSERT INTO messages (ts, role, content) VALUES (?, ?, ?)",
            (_now(), role, content),
        )
        self.db.commit()

    def recent_messages(self, n: int = 20) -> list[dict]:
        rows = self.db.execute(
            "SELECT role, content FROM messages ORDER BY id DESC LIMIT ?", (n,)
        ).fetchall()[::-1]
        # API 規定：第一則要是 user，且 user/assistant 要交替 → 合併連續同角色
        merged: list[dict] = []
        for role, content in rows:
            if not merged and role != "user":
                continue
            if merged and merged[-1]["role"] == role:
                merged[-1]["content"] += "\n\n" + content
            else:
                merged.append({"role": role, "content": content})
        return merged

    # ---- 長期記憶（關於 Karen 的事實）----
    def add_fact(self, area: str, fact: str) -> None:
        self.db.execute(
            "INSERT INTO facts (ts, area, fact) VALUES (?, ?, ?)", (_now(), area, fact)
        )
        self.db.commit()

    def facts(self, limit: int = 60) -> list[tuple[str, str, str]]:
        return self.db.execute(
            "SELECT ts, area, fact FROM facts ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()[::-1]

    # ---- 每日打卡 ----
    def add_checkin(self, energy: int, areas: list[str], note: str) -> None:
        self.db.execute(
            "INSERT INTO checkins (date, energy, areas, note) VALUES (?, ?, ?, ?)",
            (dt.date.today().isoformat(), energy, ",".join(areas), note),
        )
        self.db.commit()

    def checkins(self, days: int = 14) -> list[tuple[str, int, str, str]]:
        since = (dt.date.today() - dt.timedelta(days=days)).isoformat()
        return self.db.execute(
            "SELECT date, energy, areas, note FROM checkins WHERE date >= ? ORDER BY id",
            (since,),
        ).fetchall()
