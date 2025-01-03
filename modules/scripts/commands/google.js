const axios = require('axios');
const cheerio = require('cheerio');  // To scrape Google results

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
      // Scraping Google search results
      let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      let response = await axios.get(searchUrl);

      // Parsing the HTML with Cheerio to extract search result snippets
      let $ = cheerio.load(response.data);
      let results = [];

      // Extracting the first few search result links and snippets
      $('h3').each((index, element) => {
        if (index >= 5) return;  // Limit to the first 5 results
        let title = $(element).text();
        let link = $(element).parent().attr('href');
        let snippet = $(element).parent().next().text();
        
        if (title && link && snippet) {
          results.push({ title, link, snippet });
        }
      });

      // Formatting the response to send
      if (results.length === 0) {
        api.sendMessage("No results found.", event.sender.id);
      } else {
        let message = "Top Google results:\n\n";
        results.forEach((result, index) => {
          message += `${index + 1}. ${result.title}\n${result.link}\n${result.snippet}\n\n`;
        });
        api.sendMessage(message, event.sender.id);
      }

    } catch (error) {
      console.log(error);
      api.sendMessage("An error occurred while searching Google.", event.sender.id);
    }
  }
};
