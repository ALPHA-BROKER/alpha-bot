import { sendTelegramMessage } from "./sendTelegramMessage";
import { CONFIG } from "../config";

export async function handleStartCommand(
  chatId: number,
  username: string | undefined
): Promise<void> {
  try {
    // Обращаемся к API для аутентификации
    const response = await fetch(`https://app.alpha.broker/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramId: chatId,
        username: username || "unknown",
        code: "123456",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error authenticating user:", errorText);
      throw new Error(`Error authenticating user: ${errorText}`);
    }

    const { link } = await response.json();

    // Текст и кнопка для пользователя
    const welcomeText = `
      🚀 Welcome to ALPHA BROKER!
      
      🔑 Manage wallets and launch tokens on Solana.
      👇 Click the button below to start your journey:
    `;

    const buttons = [[{ text: "Go to ALPHA BROKER", url: link }]];

    // Отправляем сообщение с кнопкой
    await sendTelegramMessage(chatId, welcomeText, buttons);
  } catch (error) {
    console.error("Error handling /start command:", error);
    await sendTelegramMessage(
      chatId,
      "An error occurred while processing your request. Please try again later."
    );
  }
}
