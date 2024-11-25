import { CONFIG } from "../config";

export const localizations = {
  en: {
    welcomeText: `
  🇺🇸 VEX VPN – your gateway to a secure and open internet.
  
  🔐 Connect to VEX VPN and earn 1 $VP for every protected megabyte.
  🤝🏻 Invite friends and get 5 GigaPass = 5 GB for both of you!
  
  ⚡ VEX HUB / 📧 VEX MAIL / 💼 VEX WALLET are coming soon!
  
  Ready to connect and farm?`,
    buttons: [
      [{ text: "Connect VEX VPN", web_app: { url: CONFIG.SERVER_URL } }],
      [{ text: "Join VEX VPN Channel", url: CONFIG.ALPHA_SOCIAL_URL }],
      [{ text: "VEX Coin", url: CONFIG.ALPHA_AIRDROP_URL }],
      [{ text: "🔥 Burning Contract", url: CONFIG.ALPHA_AIRDROP_URL }],
    ],
  },
};
