const { gpt } = require("gpti");
const axios = require('axios');

module.exports.config = {
  name: "wikipedia",
  author: "XyryllPanget",
  version: "1.0",
  category: "AI",
  description: "Get information from Wikipedia",
  adminOnly: false,
  usePrefix: false,
  cooldown: 10,
};

module.exports.run = async function ({ event, args }) {
  if (event.type === "message") {
    let query = args.join(" ");

    if (!query) {
      return api.sendMessage("Please provide a search query.", event.sender.id);
    }

    try {
      // Fetching Wikipedia summary
      let response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      let data = response.data;

      // Check if the page exists
      if (data.type === "disambiguation") {
        api.sendMessage("Multiple results found. Please be more specific.", event.sender.id);
      } else if (data.type === "standard") {
        api.sendMessage(data.extract, event.sender.id);
      } else {
        api.sendMessage("No information found for this query.", event.sender.id);
      }
    } catch (error) {
      console.log(error);
      api.sendMessage("An error occurred while fetching information.", event.sender.id);
    }
  }
};
