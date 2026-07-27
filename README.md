# 觀夕平台旅遊指南

以臺灣繁體中文整理觀夕平台的交通停車、最佳時間、現場玩法、海邊安全、附近景點、美食與住宿區域。

## 技術

- Astro 7（靜態輸出）
- Tailwind CSS 4
- Markdown Content Collections
- pnpm
- Cloudflare Pages
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

## Cloudflare Pages

- Build command：`pnpm build`
- Build output directory：`dist`
- Node.js：24
- Root directory：專案根目錄

`wrangler.jsonc` 已設定 `pages_build_output_dir`，不需要任何資料庫或執行階段綁定。

## 內容與圖片

指南內容位於 `src/content/guides/`。實景照片存放在 `src/assets/images/`，圖片來源、攝影者與授權條款整理於網站的 `/sources/` 頁面。
