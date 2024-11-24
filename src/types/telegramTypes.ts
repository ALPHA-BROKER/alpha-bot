// Типы
export interface TelegramButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface TelegramChat {
  id: number;
}

export interface TelegramFrom {
  language_code?: string;
}

export interface TelegramMessage {
  chat: TelegramChat;
  from: TelegramFrom;
  text?: string;
}

export interface TelegramUpdate {
  message?: TelegramMessage;
}

export interface WebhookData {
  chatId: number;
  message: string;
  buttons?: Array<Array<TelegramButton>>;
}
