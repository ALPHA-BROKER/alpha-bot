import { sendTelegramMessage } from "./handlers/sendTelegramMessage";
import { handleStartCommand } from "./handlers/handleStartCommand";
import { WebhookData, TelegramUpdate } from "./types/telegramTypes";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS", // Allow methods
    "Access-Control-Allow-Headers": "Content-Type", // Allow headers
  });

  if (request.method === "OPTIONS") {
    // Respond to CORS preflight requests
    return new Response(null, { headers });
  }

  if (pathname === "/webhook" && request.method === "POST") {
    try {
      const data: WebhookData | TelegramUpdate = await request.json();

      if ("message" in data && data.message?.text === "/start") {
        const chatId = data.message.chat.id;
        const langCode = data.message.from?.language_code || "en";

        await handleStartCommand(chatId, langCode);
        return new Response("Start command handled", { status: 200, headers });
      }

      if ("chatId" in data && "message" in data) {
        const { chatId, message, buttons } = data as WebhookData;

        if (!chatId || !message) {
          console.error("Invalid payload:", { chatId, message });
          return new Response("Invalid payload", { status: 400, headers });
        }

        await sendTelegramMessage(chatId, message, buttons);
        return new Response("Message sent", { status: 200, headers });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response("Failed to send message", { status: 500, headers });
    }
  }

  console.log("Route not found:", pathname);
  return new Response("Not found", { status: 404, headers });
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
