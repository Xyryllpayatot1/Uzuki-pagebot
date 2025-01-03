const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
  name: "info",
  author: "Xyryll Panget",
  version: "1.0",
  category: "Info",
  description: "Displays bot and owner information.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 10,
};

module.exports.run = async function ({ event, args }) {
  if (event.type === "message") {
    const botName = "Uzuki Mikata";
    const prefix = "$";
    const ownerName = "Xyryll Panget";
    const ownerAge = "16";
    const fbProfile = "https://www.facebook.com/XyryllPanget";
    const instaProfile = "https://www.instagram.com/XyryllPanget";
    const urls = JSON.parse(fs.readFileSync("XyryllPanget.json"));
    const randomLink = urls[Math.floor(Math.random() * urls.length)];

    const now = moment().tz("Asia/Manila");
    const date = now.format("MMMM Do YYYY");
    const time = now.format("h:mm:ss A");

    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const minutes = Math.floor((uptime / 60) % 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    const relationshipStatus = "I'm single and idc.";

    const message = `《 Bot & Owner Info 》
- Name: ${botName}
- Prefix: ${prefix}
- Owner: ${ownerName}
- Age: ${ownerAge}
- Facebook: ${fbProfile}
- Instagram: ${instaProfile}
- Date: ${date}
- Time: ${time}
- Uptime: ${uptimeString}
- Relationship: ${relationshipStatus}`;

    try {
      api.sendMessage(
        {
          body: message,
          attachment: await global.utils.getStreamFromURL(randomLink),
        },
        event.sender.id
      );
    } catch (error) {
      console.error(error);
    }
  }
};
