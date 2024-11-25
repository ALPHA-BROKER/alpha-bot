import { sendTelegramMessage } from "./sendTelegramMessage";

export async function handleStartCommand(
  chatId: number,
  username: string | undefined
): Promise<void> {
  try {
    // Формируем тело запроса
    const requestBody = {
      id: chatId,
      username: username || "unknown",
      code: "123456", // Пример статического кода, если он не изменяется
    };

    // Отправляем запрос на API
    const response = await fetch("https://app.alpha.broker/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Проверяем успешность ответа
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error authenticating user:", errorText);
      throw new Error(`Error authenticating user: ${errorText}`);
    }

    // Извлекаем ссылку из ответа
    const { link } = await response.json();

    if (!link) {
      throw new Error("API did not return a valid link.");
    }

    // Приветственное сообщение и кнопка
    const welcomeText = `
      🚀 Welcome to ALPHA BROKER!
      
      🔑 Manage wallets and launch tokens on Solana.
      👇 Click the button below to start your journey:
    `;

    const buttons = [[{ text: "Go to ALPHA BROKER", url: link }]];

    // Отправляем сообщение пользователю с кнопкой
    await sendTelegramMessage(chatId, welcomeText, buttons);
  } catch (error) {
    // Обрабатываем ошибку и отправляем пользователю сообщение об ошибке
    console.error("Error handling /start command:", error);

    await sendTelegramMessage(
      chatId,
      "An error occurred while processing your request. Please try again later."
    );
  }
}
