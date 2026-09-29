# 🌱 companion：我的 AI mentor／夥伴（種子版）

一個會記得我、陪我打卡、幫我回顧的 AI 夥伴。現在是終端機版本，之後會長成
「一起床就在、會主動找我、會用耳機跟我說話」的樣子。完整路線看 [ROADMAP.md](ROADMAP.md)。

## 今天就能跑起來（約 15 分鐘）

需要：Python 3.10 以上、一把 Anthropic API key（console.anthropic.com）

```bash
cd companion
python3 -m venv .venv
source .venv/bin/activate          # 之後每次開新終端機都要先跑這行
pip install -r requirements.txt
cp .env.example .env               # 打開 .env 填入 API key，順便幫它取名字
```

然後打開 `me.md`，花五分鐘寫寫自己。

## 指令

```bash
python -m app.main hello     # 它主動跟你打招呼
python -m app.main chat      # 聊天（輸入 bye 結束）
python -m app.main checkin   # 一分鐘每日打卡
python -m app.main review    # 請它做近期小結
python -m app.main serve     # 啟動 API 伺服器（http://127.0.0.1:8000）
```

## 手機連線（Tailscale）

前提：電腦和手機都裝了 Tailscale，而且登入同一個帳號。

```bash
python -m app.main serve     # 先把 API 跑起來
tailscale serve --bg 8000    # 把 8000 port 分享到自己的 tailnet（不會公開到網際網路），背景持續執行
tailscale serve status       # 查看目前的分享設定
tailscale serve reset        # 關閉分享
```

手機瀏覽器打開 `https://<機器名>.<tailnet>.ts.net`，看到 `"hello fastAPI"` 就代表連線成功。

## 檔案地圖

| 檔案 | 是什麼 | 你會常改嗎 |
|---|---|---|
| `me.md` | 你寫給它看的自我介紹、目標、提醒偏好 | ✅ 常改 |
| `app/persona.md` | 它的個性和原則 | ✅ 調個性就改這裡 |
| `app/brain.py` | 組合提示詞 + agent loop + 工具 | 加新能力時 |
| `app/memory.py` | SQLite 記憶（對話、事實、打卡） | 換記憶系統時 |
| `app/main.py` | 指令入口 | 加新指令時 |
| `app/routers/brain.py` | FastAPI 路由（API 端點） | 加新 API 時 |
| `app/services/` | API 背後的邏輯（目前是預留） | 之後 |
| `data/companion.db` | 所有記憶都在這（不進 git） | ❌ 別刪 |

## 測試（不需要 API key）

```bash
python -m unittest discover tests
```
