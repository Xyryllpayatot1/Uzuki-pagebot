const axios = require('axios');

module.exports.config = {
  name: "dictionary",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Utility",
  description: "Get the definition of a word.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = async function ({ event, args }) {
  if (event.type === "message") {
    let query = args.join(" ");

    if (!query) {
      return api.sendMessage("Please provide a word to define.", event.sender.id);
    }

    try {
      // Make a request to the Wordnik API
      const response = await axios.get(`https://api.wordnik.com/v4/word.json/${encodeURIComponent(query)}/definitions?api_key=YOUR_API_KEY`);

      const definitions = response.data;

      if (definitions && definitions.length > 0) {
        let message = `Definitions for "${query}":\n`;

        // Loop through all the definitions and add them to the message
        definitions.slice(0, 3).forEach((def, index) => {
          message += `${index + 1}. ${def.text}\n`;
        });

        api.sendMessage(message, event.sender.id);
      } else {
        api.sendMessage(`No definitions found for "${query}". Please check the spelling and try again.`, event.sender.id);
      }

    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the definition. Please try again later.", event.sender.id);
    }
  }
};
