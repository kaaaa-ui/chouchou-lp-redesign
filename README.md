# ChouChou LP — Premium Redesign（別サイト版）

既存 `https://chouchou-live.com/`（中身が全部1枚画像のLP）を参考に、
**フルコード化＋くすみピンク×ゴールドの高級感トーン**で作り直した新規サイト。

## 構成
```
chouchou-lp-redesign/
├─ index.html              # 全セクション・ライブテキスト（画像焼き込みを廃止）
├─ assets/css/style.css    # 上品テーマ（明朝×Cormorant、金の細線、余白広め）
├─ assets/js/main.js       # ハンバーガー / スクロール出現 / カウントアップ /
│                          #   口コミスライダー(scroll-snap) / 追従CTA /
│                          #   ★utm別LINEリンク切替(本番ロジック踏襲) / GA4計測
└─ assets/images/          # hero.webp をここに置くと自動反映（後述）
```

## 本番との差分（よくなった点）
- 各セクションを**本物のHTML/CSS**に（文字選択可・レスポンシブ・SEO・表示速度UP）
- 口コミスライダーの `top:660px→320px` ピクセル固定を**廃止** → CSS scroll-snap で端末非依存
- FAQは `<details>` ネイティブ**アコーディオン**
- 報酬「2〜3万円」は**カウントアップ演出**
- 採用強化キャンペーン(5万円)を**金縁バナー**で訴求強化
- GTM / GA4 / utm別LINEリンク切替 / 追従CTA は**そのまま維持**

## プレビュー
ブラウザで `index.html` を直接開くだけ。

## hero写真の差し込み（任意・推奨）
`assets/images/hero.webp`（縦長 9:16 目安）を置くと自動で背景に反映。
無い場合はグラデ＋ステータスバーのフォールバックが表示される（現状もこれで十分高級感あり）。

### むく式 heroプロンプト（ChatGPT Images / FLUX 用）
```
A young Japanese woman in a soft cream off-shoulder knit, sitting at a bright
minimal home desk with a ring light softly glowing and a laptop, warm morning
light, calm intimate expression, faint soft smile, relaxed shoulders, natural
and effortless pose, dusty pink and gold color palette, luxurious cozy interior,
soft bokeh background, shot on Sony Alpha mirrorless camera, 85mm f/1.4 lens,
shallow depth of field, cinematic lighting, realistic skin texture, subtle film
grain, vertical 9:16 composition with darker negative space at the bottom for
text overlay, tasteful and non-explicit styling, natural proportions
```
> inference.sh で生成する場合は `infsh login` 後に ai-image-generation スキルで FLUX 実行。
> 生成後 `assets/images/hero.webp` に保存すれば反映完了。

## 別サイトとしてデプロイ（Vercel例）
```bash
cd ~/chouchou-lp-redesign
vercel        # 静的サイトとしてそのまま公開（ビルド不要）
```
> ⚠️ LINEリンクは現状 `chouchou-live.com/r/?rid=...`（本番計測経由）のまま。
> 別ドメインで運用するなら、必要に応じて `index.html` / `main.js` 内の
> `rid` を新しい計測リンクに差し替えること。
