const axios = require('axios');

module.exports.config = {
  name: 'Wikipedia', // From the provided snippet
  author: 'XyryllPanget',
  version: '1.0',
  description: 'Fetches the summary of a topic from Wikipedia.',
  selfListen: false,
  usePrefix: true,
  adminOnly: false,
  category: 'Utility',
};

module.exports.run = async function ({ event, args, api }) {
  if (!api || typeof api.sendMessage !== 'function') {
    console.error('API object is undefined or sendMessage method is missing.');
    return;
  }

  const senderId = event.senderID || event.sender.id; // Ensure sender ID is available
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

  // Inform the user that the query is being processed
  api.sendMessage(
    {
      text: `Searching Wikipedia for "${topic}"... Please wait.`,
    },
    senderId
  );

  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
    );
    const { title, extract, content_urls } = response.data;

    if (extract) {
      const message = `Wikipedia Summary for "${title}":\n\n${extract}\n\nRead more: ${content_urls.desktop.page}`;
      api.sendMessage(
        {
          text: message,
        },
        senderId
      );
    } else {
      api.sendMessage(
        {
          text: `No Wikipedia summary found for "${topic}".`,
        },
        senderId
      );
    }
  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error);
    api.sendMessage(
      {
        text: 'An error occurred while fetching the Wikipedia summary. Please try again later.',
      },
      senderId
    );
  }
};
