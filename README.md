# 🌱 companion：我的 AI mentor／夥伴（種子版）

companion 是一個以mentor、助理，甚至夥伴為定位的個人 AI 系統。它會記錄使用者的目標與習慣，定期協助打卡和回顧，並在需要的時候主動提醒、給出建議。

目前有終端機版本和 Android App，後續規劃包含主動通知與語音互動。完整規劃請見 [docs/roadmap.md](docs/roadmap.md)，優化構想請見 [docs/ideas/](docs/ideas/README.md)。

## 專案結構

| 資料夾 | 是什麼 | 說明 |
|---|---|---|
| `server/` | Python 後端：AI 大腦、記憶、FastAPI | [server/README.md](server/README.md) |
| `mobile/` | Angular + Capacitor 手機 App | [mobile/README.md](mobile/README.md) |
| `docs/` | roadmap 與優化構想 | [docs/roadmap.md](docs/roadmap.md) |

第一次使用請從 [server/README.md](server/README.md) 開始。
