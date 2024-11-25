import { sendTelegramMessage } from "./sendTelegramMessage";

export async function handleStartCommand(
  chatId: number,
  username: string | undefined
): Promise<void> {
  try {
    console.log(`Handling /start for chatId: ${chatId}, username: ${username}`);

    // API request for authentication
    const response = await fetch(`https://app.alpha.broker/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: chatId,
        username: username || "unknown",
        code: "123456", // Added 'code' field
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error authenticating user (chatId: ${chatId}): ${errorText}`
      );
      throw new Error(`Error authenticating user: ${errorText}`);
    }

    const responseData = await response.json();
    if (!responseData.link) {
      console.error(
        `Invalid API response: Missing 'link' for chatId: ${chatId}`
      );
      throw new Error("Invalid API response: 'link' field is missing");
    }

    const { link } = responseData;

    // Welcome message and button
    const welcomeText = `
🚀 Welcome to ALPHA BROKER!
      
🔑 Manage wallets and launch tokens on Solana.
👇 Click the button below to start your journey:
    `;

    const buttons = [[{ text: "Go to ALPHA BROKER", url: link }]];

    // Send the Telegram message
    console.log(`Sending welcome message to chatId: ${chatId}`);
    await sendTelegramMessage(chatId, welcomeText, buttons);
  } catch (error) {
    console.error(`Error handling /start command for chatId: ${chatId}`, error);

    // Notify the user about the error
    await sendTelegramMessage(
      chatId,
      "An error occurred while processing your request. Please try again later."
    );
  }
}
