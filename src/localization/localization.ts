import { CONFIG } from "../config";

export const localizations: {
  [key: string]: {
    welcomeText: string;
    buttons: Array<
      Array<{
        text: string;
        web_app?: { url: string };
        url?: string;
      }>
    >;
  };
} = {
  en: {
    welcomeText: `
  🇺🇸 ALPHA BROKER – your ultimate tool for wallet management, automated transactions, and token launches on Solana.
  
  🔐 Manage your wallets, track balances, and execute secure transactions with ease.
  🚀 Launch and distribute tokens effortlessly using ALPHA BROKER's powerful tools.
  🤝🏻 Join our community and explore the future of blockchain automation!
  
  Ready to simplify your blockchain journey?`,
    buttons: [
      [{ text: "Access ALPHA BROKER", web_app: { url: CONFIG.ALPHA_APP_URL } }],
      [{ text: "Join Channel", url: CONFIG.ALPHA_SOCIAL_URL }],
      [{ text: "Join Chat", url: CONFIG.ALPHA_TELEGRAM_URL }],
    ],
  },
};
