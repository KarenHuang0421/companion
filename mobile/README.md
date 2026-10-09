# Rorty Mobile

Rorty 的手機 App。用 Angular 19 寫畫面，再用 Capacitor 8 打包成 Android App（目前沒有使用 Ionic）。

## 專案結構

```
src/app/
├── pages/
│   ├── onboard/     # 起始頁，輸入 Tailscale tailnet 代碼
│   ├── landing/
│   ├── home/
│   ├── chat/        # 聊天頁，呼叫 /chat
│   ├── checkin/     # 打卡頁（尚未串接 /checkin）
│   └── error/
├── services/
│   ├── chat.service.ts           # 呼叫後端 API
│   └── server-config.service.ts  # 決定 API 網址
├── interface/       # 型別定義
└── constants.ts     # API 網址常數
android/             # Capacitor 產生的 Android 原生專案
capacitor.config.ts  # appId、appName、webDir
```

## API 網址怎麼決定

API 網址由 `ServerConfigService.baseUrl` 決定：

- **有輸入 tailnet 代碼**（6 位英數，存在 `localStorage`）：連到 `http://karenmacbook-pro.tail<代碼>.ts.net`
- **沒有輸入代碼**：連到 `http://127.0.0.1:8000`，只適合在 Mac 瀏覽器開發時使用

要修改主機名稱或預設網址，請改 `src/app/constants.ts`。

## 在瀏覽器開發

先在 `server/` 啟動 FastAPI，再執行：

```bash
npm install
```

```bash
npm start
```

打開 `http://localhost:4200/`，修改原始碼後畫面會自動重新整理。

---

## 打包 Android App

不需要 Xcode，也不需要 Android Studio。只用命令列工具打包，再用 USB 裝到實體手機上。

### 一、環境準備（只需做一次）

**1. 安裝 Java 21**

Capacitor 8 要求 Java 21，舊的 Java 8 不用移除。

```bash
brew install openjdk@21
```

**2. 安裝 Android 命令列工具**

```bash
brew install --cask android-commandlinetools
```

**3. 在 `~/.zshrc` 設定環境變數**

```bash
export JAVA_HOME="/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="/usr/local/share/android-commandlinetools"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

存檔後執行 `source ~/.zshrc`，再用 `java -version` 確認顯示的是 21。

**4. 下載 SDK 元件**

版本要對應 `android/variables.gradle` 裡的 `compileSdkVersion = 36`。

```bash
sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"
```

**5. 同意 SDK 授權條款**

```bash
sdkmanager --licenses
```

**6. 手機開啟 USB 偵錯**

1. 到「設定 → 關於手機」，連點「版本號碼」7 次，開啟開發人員選項
2. 到「開發人員選項」，開啟「USB 偵錯」
3. 用 USB 接上 Mac，手機跳出授權視窗時按「允許」
4. 執行 `adb devices`，看到裝置且狀態是 `device` 就代表連線成功

### 二、打包並安裝（每次改完程式都要做）

在 `mobile/` 目錄下依序執行：

**1. 編譯 Angular**，輸出到 `dist/browser`

```bash
npm run build
```

**2. 同步到 Android 專案**，把網頁檔和外掛複製進 `android/`

```bash
npx cap sync android
```

**3. 打包 debug APK**

```bash
cd android && ./gradlew assembleDebug
```

**4. 安裝到手機**，`-r` 代表覆蓋舊版本

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### 三、除錯

App 跑在手機上時，可以用 Mac 上的 Chrome 看 console 和網路請求：

1. 手機用 USB 接著 Mac，並打開 App
2. 在 Chrome 網址列輸入 `chrome://inspect/#devices`
3. 在 WebView 項目下按「inspect」

## 常見問題

**打包後呼叫 API 失敗，瀏覽器開發時卻正常**

可能的原因有三個：

- **連到 `127.0.0.1`**：在手機上，`127.0.0.1` 指的是手機自己，不是 Mac。要先在 onboard 頁輸入 tailnet 代碼，手機也要開著 Tailscale。
- **Android 預設擋 HTTP**：Android 9 以上預設禁止明文 HTTP，API 網址是 `http://` 就會被擋。
- **混合內容（mixed content）**：Capacitor 在 Android 上預設用 `https://localhost` 載入 App，從 https 頁面呼叫 http API 會被擋。

用上面的 `chrome://inspect` 查看錯誤訊息，就能判斷是哪一個原因。

**`./gradlew` 出現 Java 版本錯誤**

`JAVA_HOME` 沒有指向 Java 21。執行 `echo $JAVA_HOME` 和 `java -version` 確認。

**`adb devices` 看不到手機，或狀態顯示 `unauthorized`**

重新插拔 USB，並在手機上按「允許 USB 偵錯」。

## 其他指令

| 指令 | 用途 |
|---|---|
| `npm run watch` | 用開發模式持續編譯 |
| `npm test` | 用 Karma 跑單元測試 |
| `npx ng generate component <名稱>` | 產生新元件 |
