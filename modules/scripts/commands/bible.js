const axios = require('axios');

module.exports.config = {
  name: "bible",
  author: "XyryllPanget",
  version: "1.0",
  category: "Religion",
  description: "Fetch a Bible verse by book, chapter, and verse.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = async function ({ event, args }) {
  if (event.type === "message") {
    let query = args.join(" ");

    if (!query) {
      return api.sendMessage("Please provide a Bible reference (e.g., John 3:16).", event.sender.id);
    }

    try {
      // Make a request to the Bible API
      const response = await axios.get(`https://bible-api.com/${encodeURIComponent(query)}?translation=kjv`);

      const verse = response.data;

      if (verse && verse.text) {
        let message = `Bible Verse: ${verse.reference}\n`;
        message += `Text: ${verse.text}\n`;

        api.sendMessage(message, event.sender.id);
      } else {
        api.sendMessage("No verse found. Please check the reference format and try again.", event.sender.id);
      }

    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the Bible verse.", event.sender.id);
    }
  }
};
