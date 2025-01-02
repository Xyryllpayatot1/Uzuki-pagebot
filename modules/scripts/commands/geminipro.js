const axios = require('axios');

module.exports.config = {
  name: 'Geminipro', // Title from the provided snippet
  author: 'Aljur Pogoy',
  version: '1.0',
  description: 'Ask a question to Gemini Pro.',
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
  const prompt = args.join(' ');

  if (!prompt) {
    api.sendMessage(
      {
        text: 'Usage: /gemini <question>',
      },
      senderId
    );
    return;
  }

  // Notify user that content generation is in progress
  api.sendMessage(
    {
      text: 'Generating content... Please wait.',
    },
    senderId
  );

  try {
    const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-pro?q=${encodeURIComponent(prompt)}&uid=${senderId}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.response) {
      const text = response.data.response;
      // Send the generated content to the user
      api.sendMessage(
        {
          text: `Gemini Pro BY CHATGPT:\n\n${text}`,
        },
        senderId
      );
    } else {
      api.sendMessage(
        {
          text: 'There was an issue retrieving the response. Please try again later.',
        },
        senderId
      );
    }
  } catch (error) {
    console.error('Error calling Gemini Pro API:', error);

    api.sendMessage(
      {
        text: 'There was an error generating the content. Please try again later.',
      },
      senderId
    );
  }
};
