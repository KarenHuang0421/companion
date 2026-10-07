# 🗺️ 路線圖

## ▶ 下次打開這個專案，從這裡開始

> 每次收工前，把下一步寫在這一行，下次就不用想「我上次做到哪」。

**下一步：** 
- 修正打包後手機上的 API 呼叫錯誤
- 修好後開始做語音（Phase 3）：先做「說話取代打字」，再做「Rorty 開口說話」
- 連續三天跑 `checkin`，然後跑一次 `review`，看看它的小結準不準。

---

## 核心理念：種子先長根，再長葉子

就算開發停下來，**只要你還在打卡，資料就在累積**。三個月後回來做「成長評估」功能時，
你手上已經有三個月的真實資料，不是從零開始。所以最重要的不是寫程式，是 `checkin` 這個習慣。

每一步都設計成 **30～60 分鐘做得完**。有空就做一格，沒空就只打卡。

---

## 🌱 Phase 0：種子（今天）
- [x] agent loop + `remember` 工具（它會自己記住關於你的事）
- [x] SQLite 記憶：對話、事實、打卡
- [x] 人格檔 `persona.md`、自我介紹 `me.md`
- [x] 四個指令：hello / chat / checkin / review
- [x] 填好 `me.md`，幫它取名字
- [x] 跟它聊第一次天、打第一次卡

## 📱 Phase 1：口袋裡的 Rorty（手機也能互動）
> 架構：Mac 寫程式 → push 到 GitHub → Windows 主機 pull 下來 24 小時跑 FastAPI → 手機透過 Tailscale 連回去（出門用行動網路也可以）

- [x] 用 FastAPI 把 brain 包成 API（`/hello`、`/chat`、`/checkin`）
- [x] Angular 做聊天頁，先在 Mac 瀏覽器接本機 API 測試
- [ ] Angular 做打卡頁，串接 `/checkin` API（畫面已建，API 尚未串接）
- [x] 建立 Android 打包環境（Java 21 + Android 命令列 SDK 工具，不裝 Android Studio）
- [x] 用 Capacitor 打包成 Android app，裝到手機上測試
- [ ] 修正打包後的 API 呼叫錯誤
- [ ] Windows 主機：clone 專案、裝套件、放 `.env`（API key 只放後端，絕不放進 app）
- [ ] Windows 主機：用工作排程器或 NSSM 讓 FastAPI 開機自動啟動；關閉睡眠和自動重新開機
- [x] Windows、手機都裝 Tailscale，手機用行動網路測試連線
- [ ] ~~做成 PWA，從手機「加到主畫面」~~（改成直接用 Capacitor 打包，跳過）
- [ ] 寫一個一鍵更新腳本（`git pull` + 重啟服務）
- [ ] 排程備份 Windows 上的 `data/companion.db`（真正的記憶在這台，Mac 上的只是測試資料）
- 🎓 學到：Python 後端、前後端串接、Capacitor 打包 Android、遠端連線、Windows 服務

## 🌿 Phase 2：它會自己出現（主動性）
- [ ] 背景排程用 APScheduler 跑在 FastAPI 裡，每天早上 8 點自動 `hello`
- [ ] 在 Capacitor app 加上推播通知（FCM）
- [ ] 晚上 10 點推播提醒打卡
- 🎓 學到：排程、背景程序、推播

## 🔊 Phase 3：它會聽，也會說話（提前到 Phase 2 之前做）
- [ ] 語音輸入：使用者用說的取代打字（語音轉文字）
- [ ] 收到 Rorty 的訊息後念出來，聽到「Rorty 開口說話」（接 TTS API：OpenAI／ElevenLabs／Azure）
- [ ] 藍牙耳機自動播放（系統處理，不用寫）
- 🎓 學到：語音 API、音檔處理

## 🎮 Phase 4：它會注意你（第一個感測器）
- [ ] 用 `psutil` 偵測遊戲程序，記錄遊玩時間
- [ ] 超過門檻 → 依「暗示 → 明說 → 幽默」層次提醒
- 🎓 學到：系統監測、事件觸發

## 📈 Phase 5：看見自己的變化
- [ ] `/review` API + app 裡的回顧頁
- [ ] 打卡趨勢圖
- 🎓 學到：資料視覺化

## 🧠 Phase 6：記憶升級
- [ ] 把 `memory.py` 換成 Mem0（介面不變，其他檔案不用動）
- [ ] 評估 Zep／Graphiti 做「隨時間變化」的追蹤
- 🎓 學到：向量資料庫、長期記憶架構

## 🏃 Phase 7：它會幫你排課表
- [ ] 每個面向定義 1～2 個可追蹤指標
- [ ] Garmin 式週課表：每週自動生成略有變化的任務，依完成率調難度
- [ ] Google Calendar 自動預約月度／季度回顧

## 🔍 Phase 8：它會幫你找好玩的
- [ ] 定時抓 Accupass／KKTIX 活動
- [ ] 依你的興趣評分，寧缺勿濫，一週最多推一個

## ☁️ Phase 9：搬到雲端（有需要再做）
- [ ] 如果不想讓 Windows 主機一直開著，把後端部署到雲端（Fly.io／Railway／Render）
- [ ] SQLite 放在永久儲存空間，並加上 token 驗證
- 🎓 學到：雲端部署、API 驗證

---

## 已做的決定（和原因）

| 決定 | 原因 |
|---|---|
| 後端用 Python | AI 生態（記憶、語音、agent 框架）最完整，也為 AI 應用開發轉型鋪路 |
| 前端用 Angular + Capacitor，暫不用 Ionic | 先用熟悉的 Angular 把畫面做出來；Ionic 的手機 UI 元件之後有需要再加 |
| 先用 SQLite | 零設定、一個檔案，之後可以換 |
| 先做終端機版 | 最快驗證「跟它相處」的感覺，不被 UI 拖住 |
| 手機版提前到 Phase 1 | 要養成跟它互動的習慣，每次都得開終端機阻力太大 |
| Windows 主機當伺服器、Mac 開發 | 不用讓 Mac 一直開著，也還不用付雲端費用 |
| 用 Tailscale 連線 | 出門也連得到，API 不公開在網路上，暫時不用做登入驗證 |
| 跳過 PWA，直接用 Capacitor 打包 Android | 手機是 Android，打包不需要 Xcode，直接裝 APK 就能在手機上測試 |
| Android 用命令列 SDK 工具，不裝 Android Studio | 用實體手機測試，不需要模擬器，省硬碟空間 |
| 語音提前到推播之前做 | 說話取代打字、聽到 Rorty 開口，最能直接提升跟它相處的感覺 |
| 它不編造自己的生活 | 分享真的做過的事，關係才不會建立在虛構上 |
| 它的目標是把我推向真實世界 | 好的 mentor，是讓你越來越不需要它 |

## 開發日誌
- 2026-09-27：種下種子 🌱
- 2026-09-28：調整開發順序，手機版提前到 Phase 1 
- 2026-10-01: 新增 mobile 專案；主動開口的推播改成自家 app + FCM 🔌
- 2026-10-06：FastAPI 包好 `/chat`、`/check_in`，後端移到 `server/`
- 2026-10-08：建好 Android 打包環境，用 Capacitor 打包並裝到手機測試 📱；語音提前到下一步
