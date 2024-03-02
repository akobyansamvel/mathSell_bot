require("dotenv").config();
const { Bot, Keyboard, InlineKeyboard } = require("grammy");
const { setupLinkCommand  } = require('./web-analytics.js');

const bot = new Bot(process.env.BOT_API_KEY);

// Загрузка данных из JSON-файла
const data = require('./data.json');

bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard()
        .text("Дискретка")
        .text("Веб-аналитика")
        .row()
        .text("Проектирование Б.П.")
        .text("Сотрудничество")
        .resized();
    await ctx.reply("Привет! Я бот для продажи вариантов по математике. \nЧто вас интересует?", {
        reply_markup: { resize_keyboard: true, keyboard: startKeyboard.build() }
    });
});

// Обработка запросов по "Дискретке"
bot.hears("Дискретка", async (ctx) => {
    const inlineKeyboard = new InlineKeyboard();
    for (let i = 1; i <= 10; i++) {
        inlineKeyboard.text(i.toString(), `variant_${i}`).row();
    }
    await ctx.reply(`Выберите вариант:`, {
        reply_markup: inlineKeyboard
    });
});



bot.on("callback_query:data", async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
    const selectedVariant = data.find(item => `variant_${item.id}` === callbackData);

    // Проверяем, найден ли вариант и не пустая ли ссылка
    if (selectedVariant && selectedVariant.link) {
        await ctx.reply(`Ваша ссылка: ${selectedVariant.link}`);
    } else {
        // Если вариант не найден или ссылка пустая
        await ctx.reply('Извините, данный вариант отсутствует или недоступен.');
    }

    await ctx.answerCallbackQuery();
});

bot.hears(["Веб-аналитика"], async (ctx) => {
    await ctx.reply("Введите домен вашего сайта по примеру _google.ru_", { parse_mode: "Markdown" });
});


// Обработка запросов по темам которые в разработке."
bot.hears([ "Проектирование Б.П."], async (ctx) => {
    await ctx.reply("Данный раздел пока в разработке.");
});


//Пункт для сотрудничества
bot.hears("Сотрудничество", async (ctx) => {
    await ctx.reply(
        "Если у вас есть отсутствующие варианты или желание продавать материалы по другим предметам в нашем боте, то пишите https://t.me/Xelacis \nТакже у нас есть скидки постоянным клиентам и процент за друга."
    );
});

setupLinkCommand (bot);

// Обработка ошибок
bot.catch((err) => {
    console.error(`Ошибка при обработке обновления ${err.ctx.update.update_id}:`);
    if (err.error instanceof GrammyError) {
        console.error("Ошибка в запросе:", err.error.description);
    } else if (err.error instanceof HttpError) {
        console.error("Невозможно подключиться к Telegram:", err.error);
    } else {
        console.error("Неизвестная ошибка:", err.error);
    }
});


bot.start();
