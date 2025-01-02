const axios = require('axios');

module.exports.config = {
  name: 'The Book of Knowledge', // Title from the provided snippet
  author: 'Your Name',
  version: '1.0',
  description: 'Fetches a summary of a topic from Wikipedia.',
  selfListen: false,
  usePrefix: true, // Command requires a prefix, e.g., "/"
  adminOnly: false, // Command is available to all users
  category: 'Information', // Categorizing as an information command
};

module.exports.run = async function ({ event, args, api }) {
  if (!api || typeof api.sendMessage !== 'function') {
    console.error('API object is undefined or sendMessage method is missing.');
    return;
  }

  const senderId = event.sender.id;
  const topic = args.join(' ');

  if (!topic) {
    api.sendMessage(
      {
        text: 'Usage: /wikipedia <topic>',
      },
      senderId
    );
    return;
  }

  // Inform the user that their request is being processed
  api.sendMessage(
    {
      text: `Fetching information about "${topic}" from Wikipedia. Please wait...`,
    },
    senderId
  );

  try {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    const response = await axios.get(apiUrl);

    if (response.status === 200 && response.data && response.data.extract) {
      const summary = response.data.extract;
      api.sendMessage(
        {
          text: `Here’s what I found about "${topic}":\n\n${summary}`,
        },
        senderId
      );
    } else {
      api.sendMessage(
        {
          text: `Sorry, I couldn’t find any information about "${topic}".`,
        },
        senderId
      );
    }
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);

    api.sendMessage(
      {
        text: 'An error occurred while fetching the information. Please try again later.',
      },
      senderId
    );
  }
};
