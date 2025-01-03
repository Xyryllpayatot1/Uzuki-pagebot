const axios = require("axios");

module.exports.config = {
  name: "define",
  author: "XyryllPanget",
  version: "1.0",
  category: "Education",
  description: "Get the definition of a word.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5,
};

module.exports.run = async function ({ event, args, api }) {
  if (!api) {
    console.error("API object is missing!");
    return;
  }

  if (event.type === "message") {
    try {
      const word = args.join(" ").trim();

      if (!word) {
        return api.sendMessage("⚠️ Please provide a word to define.", event.threadID);
      }

      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`);
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const wordData = data[0];
        const wordDefinition = wordData.meanings[0]?.definitions[0]?.definition || "No definition found.";

        // Send the word definition message
        const definitionMessage = `📖 Word: *${word}*\n\nDefinition:\n${wordDefinition}`;
        api.sendMessage(definitionMessage, event.threadID);
      } else {
        api.sendMessage(`❌ No definition found for the word "${word}".`, event.threadID);
      }
    } catch (error) {
      console.error("Error fetching word definition:", error);

      // Handle API error gracefully
      api.sendMessage("⚠️ An error occurred while fetching the word definition. Please try again later.", event.threadID);
    }
  }
};
