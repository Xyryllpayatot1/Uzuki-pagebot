module.exports.config = {
  name: 'test', // JEJEMON HAHAHAHAHA
  author: 'code testing',
  version: '1.0',
  description: 'Public events can be placed here. It will keep on listening events.',
  selfListen: false,
  usePrefix: true, // Command requires a prefix, e.g., "/"
  adminOnly: false, // Command is available to all users
  category: 'Information', // Categorizing as an information command
};

module.exports.run = async function({ api, event, args }) {
  // Check if API is available
  if (!api || typeof api.sendMessage !== 'function') {
    console.error('API object is undefined or sendMessage method is missing.');
    return;
  }

  const senderId = event.senderID || event.sender.id;
  const eventType = event.type;

  // Handle different event types
  switch (eventType) {
    case 'message':
      // If it's a message event, process the message here
      const message = args.join(' ') || 'No message provided';
      api.sendMessage({
        text: `You said: ${message}`,
      }, senderId);
      break;

    // You can handle other event types here like postback, quick_reply, etc.
    case 'postback':
      api.sendMessage({
        text: 'Postback event triggered.',
      }, senderId);
      break;

    case 'quick_reply':
      api.sendMessage({
        text: 'Quick reply event triggered.',
      }, senderId);
      break;

    case 'message_reaction':
      api.sendMessage({
        text: 'Message reaction event triggered.',
      }, senderId);
      break;

    case 'message_reply':
      api.sendMessage({
        text: 'Message reply event triggered.',
      }, senderId);
      break;

    default:
      // Handle unknown or unsupported event types
      api.sendMessage({
        text: `Event type "${eventType}" is not supported.`,
      }, senderId);
      break;
  }
};
