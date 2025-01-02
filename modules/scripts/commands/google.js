const axios = require('axios');

// Helper function to check for inappropriate content
function containsInappropriateContent(result) {
  const bannedWords = ["porn", "xxx", "adult", "nsfw", "pinayflex", "lexilore", "jhonny sins", "hongkong doll"];
  const title = result.title.toLowerCase();
  const snippet = result.snippet.toLowerCase();

  for (const word of bannedWords) {
    if (title.includes(word) || snippet.includes(word)) {
      return true;
    }
  }
  return false;
}

// Map to store banned users
const bannedUsers = new Map();

module.exports.config = {
  name: 'google',
  aliases: ['search', 'g'],
  version: '2.0',
  author: 'XyryllPanget',
  description: 'Searches Google for a given query.',
  category: 'Utility',
  usage: '/google <query>',
  adminOnly: false,
  usePrefix: true,
};

module.exports.run = async function ({ api, event, args }) {
  // Check if the API object and sendMessage method exist
  if (!api || typeof api.sendMessage !== 'function') {
    console.error('API object is undefined or sendMessage method is missing.');
    return;
  }

  const senderId = event.senderID || event.sender.id;
  const query = args.join(' ');

  // If no query provided, send a usage message
  if (!query) {
    api.sendMessage(
      {
        text: 'Usage: /google <query>',
      },
      senderId
    );
    return;
  }

  // Check if the user is banned
  if (bannedUsers.has(senderId)) {
    const timeRemaining = (bannedUsers.get(senderId) - Date.now()) / 1000;
    api.sendMessage(
      {
        text: `You are temporarily banned from using this command. Time remaining: ${timeRemaining.toFixed(0)} seconds.`,
      },
      senderId
    );
    return;
  }

  // Set up Google Custom Search API
  const cx = '7514b16a62add47ae'; // Replace with your Custom Search Engine ID
  const apiKey = 'AIzaSyAqBaaYWktE14aDwDE8prVIbCH88zni12E'; // Replace with your API key
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

  try {
    // Fetch search results from Google
    const response = await axios.get(url);
    const searchResults = response.data.items.slice(0, 5);

    // Filter out inappropriate content
    const filteredResults = searchResults.filter(result => !containsInappropriateContent(result));

    if (filteredResults.length === 0) {
      // Notify admin if a banned word was triggered
      const adminID = '100075778393362'; // Replace with admin's ID
      const adminMessage = `The banned word "${query}" was triggered by user ${senderId} in thread ${event.threadID}.`;
      api.sendMessage(
        {
          text: adminMessage,
        },
        adminID
      );

      // Ban the user for 30 seconds
      bannedUsers.set(senderId, Date.now() + 30000);
      api.sendMessage(
        {
          text: 'Sorry, that search query is not allowed.',
        },
        senderId
      );
      return;
    }

    // Compile and send the filtered results
    let message = `Top 5 results for '${query}':\n\n`;
    filteredResults.forEach((result, index) => {
      message += `${index + 1}. ${result.title}\n${result.link}\n${result.snippet}\n\n`;
    });

    api.sendMessage(
      {
        text: message,
      },
      senderId
    );
  } catch (error) {
    // Handle errors while fetching search results
    console.error('Error fetching Google search results:', error);
    api.sendMessage(
      {
        text: 'An error occurred while searching Google. Please try again later.',
      },
      senderId
    );
  }
};
