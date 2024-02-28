
require("dotenv").config();  
const { Bot, Keyboard, GrammyError, HttpError, InputFile  } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

//приветствие и кнопки с командами
bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard()
        .text("Искать варианты")
        .row()
        .text("Задать вопрос")
        .text("Сотрудничество")
        .resized();
    await ctx.reply("Привет! Я бот для продажи вариантов по математике. \nЧто вас интересует?", {
        reply_markup: startKeyboard
    })
});

// не уверен,что этот пункт нужен будет,но пока пусть живет
bot.hears("Искать варианты", async (ctx) => {
    await ctx.reply(
        "Чтобы узнать есть ли в наличии нужный вариант напиши нужный вариант в формате 'номер вариана' 'мат логика/дискретка'"
    );
});

// вопросы по типу сотрудничества и т д
bot.hears("Задать вопрос", async (ctx) => {
    await ctx.reply(
        "Пишите, отвечу на все вопросы! \nhttps://t.me/Xelacis"
    );
});


// сотрудничество
bot.hears("Сотрудничество", async (ctx) => {
    await ctx.reply(
        "Если у вас есть отсутствующие варианты или желание продавать материалы по другим предметам в нашем боте, то пишите https://t.me/Xelacis \nТакже у нас есть скидки постоянным клиентам и процент за друга"
    );
});

//проверка работы выдачи варианта по шабломному запроса (else еще не написал )
bot.hears(
    "1 дискретка", async (ctx) => {
        await ctx.reply(
            "Данный вариант есть в наличии! "
            
        );
        await ctx.replyWithDocument(new InputFile("")); //сюда заливать путь к документу
    });

// обработка ошибок
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Ошибка в запросе:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Невозможно подключится к Telegram:", e);
    } else {
      console.error("Неизвестная ошибка:", e);
    }
});

bot.start();
