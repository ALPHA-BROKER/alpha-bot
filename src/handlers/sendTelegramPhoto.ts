import { TelegramButton } from "../types/telegramTypes";
import { CONFIG } from "../config";

export async function sendTelegramPhoto(
  chatId: number,
  imageUrl: string,
  caption: string,
  buttons: Array<Array<TelegramButton>>
): Promise<Response> {
  return fetch(`${CONFIG.TELEGRAM_API_URL}sendPhoto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      photo: imageUrl,
      caption: caption,
      reply_markup: { inline_keyboard: buttons },
    }),
  });
}
