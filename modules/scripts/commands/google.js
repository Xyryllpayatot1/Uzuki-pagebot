const axios = require('axios');

module.exports.config = {
  name: "google",
  author: "XyryllPanget",
  version: "1.0",
  category: "AI",
  description: "Search Google and retrieve results",
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
      const apiKey = 'AIzaSyAqBaaYWktE14aDwDE8prVIbCH88zni12E';  // Replace with your API key
      const cseId = '7514b16a62add47ae';  // Replace with your CSE ID

      // Make a request to the Google Custom Search API
      let response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: apiKey,
          cx: cseId,
          q: query,
        },
      });

      const results = response.data.items;

      if (results && results.length > 0) {
        let message = "Top Google results:\n\n";
        results.slice(0, 5).forEach((result, index) => {
          message += `${index + 1}. ${result.title}\n${result.link}\n${result.snippet}\n\n`;
        });
        api.sendMessage(message, event.sender.id);
      } else {
        api.sendMessage("No results found.", event.sender.id);
      }

    } catch (error) {
      console.log(error);
      api.sendMessage("An error occurred while searching Google.", event.sender.id);
    }
  }
};
