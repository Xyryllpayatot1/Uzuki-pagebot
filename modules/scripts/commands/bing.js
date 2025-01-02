const axios = require('axios');

module.exports.config = {
  name: 'Bing', // Title from the provided snippet
  author: 'XyryllPanget',
  version: '1.0',
  description: 'Generate and send images directly from Bing based on your prompt.',
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

  if (args.length === 0) {
    api.sendMessage(
      {
        text: 'Please provide a prompt. Example: bing dog',
      },
      senderId
    );
    return;
  }

  const prompt = args.join(' ');
  const apiUrl = `https://jerome-web.onrender.com/service/api/bing?prompt=${encodeURIComponent(prompt)}`;

  // Random loading message
  const loadingMessages = [
    '🔄 Hold on! Generating your image...',
    '✨ Crafting your image, please wait...',
    '🎨 Creating your visual masterpiece...',
  ];
  const loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  await api.sendMessage(
    {
      text: loadingMessage,
    },
    senderId
  );

  await api.sendMessage(
    {
      text: `You requested: "${prompt}". Let's see what we get!`,
    },
    senderId
  );

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.success && data.result && data.result.length > 0) {
      // Send up to 4 images
      const imageMessages = data.result.slice(0, 4).map((imageUrl) => ({
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl,
            is_reusable: true,
          },
        },
      }));

      for (const imageMessage of imageMessages) {
        await api.sendMessage(imageMessage, senderId);
      }

      // Success message
      const successMessages = [
        "Here's what I found! Hope you like it! 🎉",
        "Done! Enjoy your images. 😊",
        "Here’s your request—let me know what you think! 🤩",
      ];
      const successMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      await api.sendMessage(
        {
          text: successMessage,
        },
        senderId
      );
    } else {
      // Notify if no images found
      await api.sendMessage(
        {
          text: `Sorry, no images were found for "${prompt}".`,
        },
        senderId
      );
    }
  } catch (error) {
    console.error('Error fetching Bing images:', error);

    // Enhanced error messages
    let errorMessage = 'Sorry, there was an error processing your request.';
    if (error.response) {
      errorMessage = 'There was an issue with the Bing Image Generator. Please try again later.';
    } else if (error.request) {
      errorMessage = 'It looks like there’s a network problem. Please check your connection and try again.';
    }

    await api.sendMessage(
      {
        text: errorMessage,
      },
      senderId
    );
  }
};
