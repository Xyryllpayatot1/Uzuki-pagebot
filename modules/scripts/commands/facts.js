const axios = require("axios");

module.exports.config = {
  name: "facts",
  author: "Shinpei",
  version: "1.0",
  category: "Fun",
  description: "Get a random fact.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5,
};

module.exports.run = async function ({ api, event }) {
  if (event.type === "message") {
    try {
      const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
      const randomFact = response.data.text;

      // Send the fetched fact as a message
      api.sendMessage(
        `🧠 Did you know?\n\n${randomFact}`,
        event.threadID
      ).catch(err => console.error("Error sending message:", err));
    } catch (error) {
      console.error("Error fetching random fact:", error);

      // Handle API error gracefully
      api.sendMessage(
        "⚠️ Oops! Something went wrong while fetching a random fact. Please try again later.",
        event.threadID
      ).catch(err => console.error("Error sending error message:", err));
    }
  }
};
