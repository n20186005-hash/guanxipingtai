# 觀夕平台旅遊指南

以臺灣繁體中文整理觀夕平台的交通停車、最佳時間、現場玩法、海邊安全、附近景點、美食與住宿區域。

## 技術

- Astro 7（靜態輸出）
- Tailwind CSS 4
- Markdown Content Collections
- pnpm
- Cloudflare Workers（Static Assets + Worker 入口 `src/worker.js`）
- 系統字體，不載入外部字型
- 無資料庫、登入、預訂或付款功能

## 本機開發

```bash
pnpm install
pnpm dev
```

正式建置與預覽：

```bash
pnpm build
pnpm preview
```

以 Workers 模式在本機模擬（含 `/api/weather` 與靜態資源）：

```bash
pnpm build
pnpm cf:dev
```

## Cloudflare Workers

- 建置命令：`pnpm build`（輸出至 `dist`）
- Worker 入口：`src/worker.js`
- 靜態資源：`wrangler.jsonc` 的 `assets.directory = ./dist`，綁定名稱 `ASSETS`
- 部署：`pnpm deploy`（`wrangler deploy`）
- `functions/api/weather.js`（Pages Functions）已改寫為 `src/worker.js` + `src/weather.js`，
  原 `_headers` / `_redirects` 的安全回應頭與 www→apex 轉址改由 Worker 腳本處理。

## 內容與圖片

指南內容位於 `src/content/guides/`。實景照片存放在 `src/assets/images/`，圖片來源、攝影者與授權條款整理於網站的 `/sources/` 頁面。
