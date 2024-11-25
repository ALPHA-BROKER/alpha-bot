async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  console.log("Incoming request pathname:", pathname); // Add this log

  if (pathname === "/webhook" && request.method === "POST") {
    try {
      const data = await request.json();
      console.log("Received payload:", data); // Log the payload

      if ("message" in data && data.message?.text === "/start") {
        const chatId = data.message.chat.id;

        const message = "🚀 Welcome to ALPHA BROKER!";
        const buttons = [
          [{ text: "Visit ALPHA BROKER", url: "https://alpha.broker" }],
        ];

        await sendTelegramMessage(chatId, message, buttons);
        return new Response("Start command handled", { status: 200 });
      }

      return new Response("Invalid command", { status: 400 });
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response("Failed to process webhook", { status: 500 });
    }
  }

  return new Response("Not found", { status: 404 });
}

async function sendTelegramMessage(
  chatId: number,
  message: string,
  buttons?: any
): Promise<void> {
  const url = `https://api.telegram.org/bot7654151423:AAHaCSewa6xggsL1nV6cy-kR-UeAteI5ONI/sendMessage`;

  const body = {
    chat_id: chatId,
    text: message,
    ...(buttons && { reply_markup: { inline_keyboard: buttons } }),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Error sending message:", await response.text());
    throw new Error("Failed to send Telegram message");
  }
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
