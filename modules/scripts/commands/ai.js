const axios = require('axios');

module.exports.config = {
  name: 'ai',
  author: 'Converted by XyryllPanget',
  version: '1.0',
  description: 'Provides AI-based assistance and answers user queries.',
  selfListen: false,
};

module.exports.run = async function({ event, args, api }) {
  const senderId = event.sender.id;
  const prompt = args.join(' ');

  if (!prompt) {
    api.sendMessage({
      text: 'Usage: support <your question>'
    }, senderId);
    return;
  }

  api.sendMessage({
    text: 'Processing your query. Please wait...'
  }, senderId);

  try {
    const apiUrl = 'https://www.niroblr.cloud/api/gpt4?prompt=' + encodeURIComponent(prompt);
    const response = await axios.get(apiUrl);

    if (response.status === 200 && response.data?.response?.answer) {
      const answer = response.data.response.answer;
      api.sendMessage({
        text: `Here’s what I found for you:\n\n${answer}`
      }, senderId);
    } else {
      api.sendMessage({
        text: 'Sorry, I could not process your query at the moment. Please try again later.'
      }, senderId);
    }

  } catch (error) {
    console.error('Error calling API:', error);
    api.sendMessage({
      text: 'An error occurred while processing your request. Please try again later.'
    }, senderId);
  }
};
