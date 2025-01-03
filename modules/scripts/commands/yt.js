const axios = require('axios');

module.exports.config = {
  name: "youtube",
  author: "XyryllPanget",
  version: "1.0",
  category: "AI",
  description: "Search YouTube and retrieve results",
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
      const apiKey = 'AIzaSyB_RSF0xylQkMxOqglhfIkAqYt7mTSxrLE';  // Replace with your API key

      // Make a request to the YouTube Data API
      let response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          key: apiKey,
          q: query,
          type: 'video',
          maxResults: 5,  // Limit to 5 results
        },
      });

      const results = response.data.items;

      if (results && results.length > 0) {
        let message = "Top YouTube results:\n\n";
        results.forEach((result, index) => {
          const videoTitle = result.snippet.title;
          const videoUrl = `https://www.youtube.com/watch?v=${result.id.videoId}`;
          const videoDescription = result.snippet.description;

          message += `${index + 1}. ${videoTitle}\n${videoUrl}\n${videoDescription}\n\n`;
        });
        api.sendMessage(message, event.sender.id);
      } else {
        api.sendMessage("No results found on YouTube.", event.sender.id);
      }

    } catch (error) {
      console.log(error);
      api.sendMessage("An error occurred while searching YouTube.", event.sender.id);
    }
  }
};
