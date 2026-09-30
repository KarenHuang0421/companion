# 匯入 Google Takeout 資料，讓 Rorty 更了解我

- **狀態：** 💭 發想中
- **日期：** 2026-09-30

**想法：** 用 Google Takeout 把「已儲存」、「我的活動」、「Fit」匯出，匯進 Rorty。

**要大改嗎？** 不用，只要**新增**東西：
- `memory.py` 是唯一碰資料庫的地方，加一張表、兩個方法就好。
- `brain.py` 本來就設計成「新能力 = TOOLS 多一個工具」。
- `main.py`、routers、`persona.md` 都不用動。

### 要特別處理的是「量」

`build_system()` 現在會把 facts 和打卡**全部塞進 system prompt**。「我的活動」可能有好幾萬筆，直接塞會爆 context，也很燒錢。所以分成兩層：

| 層 | 做法 | Rorty 怎麼用 |
|---|---|---|
| **原始資料** | 新增 `events` 表（`source, ts, kind, title, data`），用匯入腳本一次寫進去 | 新增 `recall_activity(query, since)` 工具，聊天時需要才去查 |
| **消化後的理解** | 匯入後讓 Claude 按月讀摘要，萃取出像「她最近常查日語檢定」「每週跑步約 2 次」這樣的句子，用現有的 `add_fact()` 寫進 facts | 自動出現在 system prompt，Rorty 平常就「知道」 |

真正讓 Rorty 了解我的是第二層，第一層是讓它能回頭查細節。

### 預計的改動

```
scripts/import_takeout.py   ← 新增：解析 Takeout、寫進 events、產生 facts
app/memory.py               ← 加 events 表 + add_events() / search_events()
app/brain.py                ← TOOLS 加一個 recall_activity
```

### 匯出時要注意

1. **「我的活動」要選 JSON 格式**。預設是 HTML，解析很麻煩，在 Takeout 的「多種格式」裡可以改。
2. **Fit**：每日統計是 CSV，運動紀錄是 TCX 或 JSON。先只用每日彙總（步數、心率、運動分鐘數）就很夠了。
3. **「已儲存」**：主要是 Google 地圖收藏的地點（CSV），剛好能拿來做 Phase 8 的推薦參考。
4. **隱私**：我的活動裡有搜尋紀錄、YouTube 觀看紀錄等，產生 facts 時這些內容會送到 Anthropic API。先挑要匯入的產品，例如只匯入搜尋和 YouTube，不匯入 Gmail 和雲端硬碟的活動。原始資料只存在 Windows 主機的 SQLite 裡。

### 下一步

- [ ] 先匯出一小份資料（Fit + 一個月的活動），放進 `data/takeout/`
- [ ] 照實際檔案格式寫解析器（比照著文件猜準確）

### 跟 roadmap 的關係

像是 Phase 6（記憶升級）的前哨戰。之後換成 Mem0 時，`events` 和 facts 一起搬過去，介面不用變。
