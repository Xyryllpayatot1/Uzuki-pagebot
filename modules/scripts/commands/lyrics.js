const axios = require('axios');

module.exports.config = {
  name: "lyrics",
  author: "XyryllPanget",
  version: "1.0",
  category: "AI",
  description: "Get song lyrics",
  adminOnly: false,
  usePrefix: false,
  cooldown: 10,
};

module.exports.run = async function ({ event, args }) {
  if (event.type === "message") {
    let query = args.join(" ");

    if (!query) {
      return api.sendMessage("Please provide a song name.", event.sender.id);
    }

    try {
      // Make a request to the Popcat API for lyrics
      let response = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(query)}`);

      const lyrics = response.data.lyrics;

      if (lyrics) {
        let message = `Lyrics for "${query}":\n\n`;
        // Send the first 2000 characters to avoid message length limits
        if (lyrics.length > 2000) {
          message += lyrics.slice(0, 2000) + "\n\n[...Lyrics truncated...]";
        } else {
          message += lyrics;
        }

        api.sendMessage(message, event.sender.id);
      } else {
        api.sendMessage("No lyrics found for this song.", event.sender.id);
      }

    } catch (error) {
      console.log(error);
      api.sendMessage("An error occurred while fetching the lyrics.", event.sender.id);
    }
  }
};
