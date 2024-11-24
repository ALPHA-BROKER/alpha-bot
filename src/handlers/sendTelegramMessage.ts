import { TelegramButton } from "../types/telegramTypes";
import { CONFIG } from "../config";

export async function sendTelegramMessage(
  chatId: number,
  text: string,
  buttons?: Array<Array<TelegramButton>>
): Promise<Response> {
  const body = {
    chat_id: chatId,
    text: text,
    reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
  };

  try {
    const response = await fetch(`${CONFIG.TELEGRAM_API_URL}sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error sending message to Telegram:", errorText);
      throw new Error(`Error sending message: ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error(
      "An error occurred while sending the message to Telegram:",
      error
    );
    throw error;
  }
}
