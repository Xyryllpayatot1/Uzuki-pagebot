const axios = require("axios");

module.exports.config = {
  name: "darkweb",
  author: "XyryllPanget",
  version: "1.0",
  category: "Fun",
  description: "Get random dark web facts or related information.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    // Fetch random dark web facts or related information
    const response = await axios.get("https://api.darkwebfacts.com/random");  // Just a placeholder for dark web-related facts.
    
    const darkWebFact = response.data.fact || "No data found from dark web source.";
    
    // Send the message to the chat
    api.sendMessage(`🕵️‍♂️ Dark Web Fact:\n\n${darkWebFact}`, event.threadID);
  } catch (error) {
    console.error("Error fetching dark web data:", error);
    api.sendMessage("⚠️ Oops! Something went wrong while fetching dark web data. Please try again later.", event.threadID);
  }
};
