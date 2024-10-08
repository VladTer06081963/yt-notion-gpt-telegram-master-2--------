import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { chatGPT } from "./chatgpt.js";
import { create } from "./notion.js";
import { Loader } from "./loader.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
  handlerTimeout: Infinity,
});

bot.command(["start", "new"], (ctx) => {
  ctx.reply(
    "Добро пожаловать в бота. Отправьте тестовое сообщение с тезисами про историю."
  );
});

// bot.command("new", (ctx) => {
//   ctx.reply(
//     "Добро пожаловать в бота. Отправьте тестовое сообщение с тезисами про историю."
//   );
// });

// bot.on(message("text"), async (ctx) => {
//   try {
//     const text = ctx.message.text;

//     if (!text.trim()) ctx.reply("Текст не может быть пустым");

//     ctx.reply("Запрос принял. Работаю");
//     const loader = new Loader(ctx);

//     loader.show();

//     const response = await chatGPT(text);

//     if (!response) return ctx.reply("Ошибка с API", response);

//     const notionResponse = await create(text, response.content);

//     loader.hide();

//     ctx.reply(`Ваша страница: ${notionResponse.url}`);
//   } catch (e) {
//     console.log("Error while proccessing text: ", e.message);
//   }
// });

bot.on(message("text"), async (ctx) => {
  try {
    const text = ctx.message.text.trim();

    if (!text) return ctx.reply("Текст не может быть пустым");

    ctx.reply("Запрос принял. Работаю");
    const loader = new Loader(ctx);
    loader.show();

    const response = await chatGPT(text);

    if (!response) return ctx.reply("Ошибка с API");

    const notionResponse = await create(text, response.content);
    loader.hide();

    ctx.reply(`Ваша страница: ${notionResponse.url}`);
  } catch (e) {
    console.log("Error while proccessing text: ", e.message);
    ctx.reply("Произошла ошибка при обработке вашего сообщения.");
  }
});


bot.launch();
