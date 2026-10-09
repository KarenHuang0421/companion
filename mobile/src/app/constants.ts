export const LOCAL_URL = '127.0.0.1:8000';

/** Tailscale MagicDNS 網域中的佔位字串，會被 onboard 輸入的六位英數取代 */
export const TAILNET_PLACEHOLDER = 'xxxxxx';
export const TAILSCALE_URL = `karenmacbook-pro.tail${TAILNET_PLACEHOLDER}.ts.net`;

/** 六位英數 */
export const TAILNET_CODE_PATTERN = /^[a-z0-9]{6}$/i;
