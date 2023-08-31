import TelegramBot from "node-telegram-bot-api";

export class Telegram {
  static chatId = "1894876213";

  static client() {
    return new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
      polling: false,
    });
  }

  static compose(message: string, extra?: Record<string, any>) {
    if (!extra) {
      return message;
    }

    return `${message}\n\n<pre>${JSON.stringify(extra, null, 2)}</pre>`;
  }

  static async notify(message: string, extra?: Record<string, any>) {
    return this.client().sendMessage(
      this.chatId,
      this.compose(message, extra),
      { parse_mode: "HTML" },
    );
  }
}
