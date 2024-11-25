import { sendTelegramMessage } from "./handlers/sendTelegramMessage";
import { handleStartCommand } from "./handlers/handleStartCommand";
import { WebhookData, TelegramUpdate } from "./types/telegramTypes";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS", // Разрешенные методы
    "Access-Control-Allow-Headers": "Content-Type", // Разрешенные заголовки
  });

  // Предварительный запрос (OPTIONS) для CORS
  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // Обработка webhook для Telegram
  if (pathname === "/webhook" && request.method === "POST") {
    try {
      const data: WebhookData | TelegramUpdate = await request.json();

      // Если это команда /start
      if ("message" in data && data.message?.text === "/start") {
        const chatId = data.message.chat.id;
        const username = data.message.from?.username || undefined;

        // Обработка команды /start
        await handleStartCommand(chatId, username);
        return new Response("Start command handled", { status: 200, headers });
      }

      // Если это кастомное сообщение
      if ("chatId" in data && "message" in data) {
        const { chatId, message, buttons } = data as WebhookData;

        // Проверяем валидность данных
        if (!chatId || !message) {
          console.error("Invalid payload:", { chatId, message });
          return new Response("Invalid payload", { status: 400, headers });
        }

        // Отправка сообщения через Telegram
        await sendTelegramMessage(chatId, message, buttons);
        return new Response("Message sent", { status: 200, headers });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response("Failed to process request", {
        status: 500,
        headers,
      });
    }
  }

  // Если маршрут не найден
  console.log("Route not found:", pathname);
  return new Response("Not found", { status: 404, headers });
}

// Добавляем слушатель для обработки запросов
addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
