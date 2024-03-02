// В botCommands.js или в другом модуле

const { readFileSync } = require('fs');
const { join } = require('path');

function loadLinksData() {
    const filePath = join(__dirname, './web-analytics.json'); // Путь к файлу в той же директории
    const rawData = readFileSync(filePath); // Синхронное чтение файла
    const data = JSON.parse(rawData); // Преобразование JSON строки в объект JavaScript
    return data;
}

function setupLinkCommand(bot) {
    const linksData = loadLinksData(); // Загружаем данные

    bot.on('message', ctx => {
        const userMessage = ctx.message.text;
        const linkInfo = linksData.find(item => item.name.toLowerCase() === userMessage.toLowerCase());

        if (linkInfo) {
            ctx.reply(`Вот ваша ссылка: ${linkInfo.link}`);
        } else {
            ctx.reply("Извините, я не нашел информацию по вашему запросу.");
        }
    });
}

module.exports = { setupLinkCommand };
