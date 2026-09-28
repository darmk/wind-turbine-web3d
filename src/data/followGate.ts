/**
 * Frontend-only public-account prompt.
 *
 * This is intentionally display-only: a fixed QR code cannot confirm a real
 * follow action. The browser only remembers that the visitor chose to enter.
 */
export const followGateConfig = {
  enabled: true,
  storageKey: 'darmk:windpowerweb3d:follow-gate:v1',
  accountName: '程途漫记',
  eyebrow: '关注公众号 · 解锁完整体验',
  title: '先关注，再探索风机',
  description: '创作不易，感谢支持。\n扫码关注公众号，继续探索三维数字样机与更多实践内容。',
  qrCodePath: 'images/qrcode_for_gh_10e8400b2bfb_860.jpg',
  confirmLabel: '我已关注，进入体验',
  helperText: '本页为前端引导，点击后将在此浏览器记住你的访问状态。',
} as const;
