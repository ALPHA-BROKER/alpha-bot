import { sendTelegramPhoto } from "./sendTelegramPhoto";
import { localizations } from "../localization/localization";
import { CONFIG } from "../config";

export async function handleStartCommand(
  chatId: number,
  languageCode: string
): Promise<void> {
  const userLang = localizations[languageCode] ? languageCode : "en";
  const { welcomeText, buttons } = localizations[userLang];

  await sendTelegramPhoto(
    chatId,
    CONFIG.WELCOME_IMAGE_URL,
    welcomeText,
    buttons
  );
}
