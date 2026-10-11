export const LOCAL_URL = '0.0.0.0:8000';

/** Tailscale MagicDNS 網域中的佔位字串，會被 onboard 選的主機與輸入的六位英數取代 */
export const TAILNET_HOST_PLACEHOLDER = '{host}';
export const TAILNET_PLACEHOLDER = 'xxxxxx';
export const TAILSCALE_URL = `${TAILNET_HOST_PLACEHOLDER}.tail${TAILNET_PLACEHOLDER}.ts.net`;

/** onboard 可選的連線主機（Tailscale 上的 machine name），第一個為預設 */
export const TAILNET_HOSTS: { name: string; label: string }[] = [
  // TODO: 換成桌機在 Tailscale 上實際的 machine name
  { name: 'desktop-6cfpt3p', label: '主機1' },
  { name: 'karenmacbook-pro', label: '主機2' },
];

/** 六位英數 */
export const TAILNET_CODE_PATTERN = /^[a-z0-9]{6}$/i;
