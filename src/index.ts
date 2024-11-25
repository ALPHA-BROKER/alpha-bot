import { sendTelegramMessage } from "./handlers/sendTelegramMessage";
import { handleStartCommand } from "./handlers/handleStartCommand";
import { WebhookData, TelegramUpdate } from "./types/telegramTypes";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (request.method === "OPTIONS") {
    // Respond to CORS preflight requests
    return new Response(null, { headers });
  }

  if (pathname === "/" && request.method === "GET") {
    // Handle the root route
    return new Response("Welcome to the Alpha Bot Webhook!", {
      status: 200,
      headers,
    });
  }

  if (pathname === "/webhook") {
    if (request.method === "GET") {
      // Handle GET requests to /webhook
      return new Response("Webhook endpoint is active", {
        status: 200,
        headers,
      });
    }

    if (request.method === "POST") {
      try {
        const data: WebhookData | TelegramUpdate = await request.json();

        console.log("Incoming webhook payload:", data);

        // Check for /start command
        if ("message" in data && data.message?.text === "/start") {
          const chatId = data.message.chat.id;
          const username = data.message.from?.username || undefined;

          await handleStartCommand(chatId, username);
          return new Response("Start command handled", {
            status: 200,
            headers,
          });
        }

        // Handle custom message payloads
        if ("chatId" in data && "message" in data) {
          const { chatId, message, buttons } = data as WebhookData;

          if (!chatId || !message) {
            console.error("Invalid payload:", { chatId, message });
            return new Response("Invalid payload", { status: 400, headers });
          }

          await sendTelegramMessage(chatId, message, buttons);
          return new Response("Message sent", { status: 200, headers });
        }

        // If no valid payload is found
        return new Response("Invalid request payload", {
          status: 400,
          headers,
        });
      } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Failed to process webhook", {
          status: 500,
          headers,
        });
      }
    }
  }

  console.log("Route not found:", pathname);
  return new Response("Not found", { status: 404, headers });
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
