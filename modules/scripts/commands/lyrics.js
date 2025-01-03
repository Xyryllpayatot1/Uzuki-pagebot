const axios = require("axios");

module.exports.config = {
  name: "lyrics", // Command Name
  author: "coffee", // Author
  version: "1.0", // Version
  category: "Utility", // Command Category
  description: "Fetch song lyrics", // Command Description
  adminOnly: false, // Not restricted to admins
  usePrefix: true, // Uses prefix to trigger the command
  cooldown: 5, // Cooldown period
};

// The main logic of the command
module.exports.run = async function ({ event, args, api }) {
  // Check if the API object and its sendMessage function are available
  if (!api || typeof api.sendMessage !== "function") {
    console.error("API object is undefined or sendMessage method is missing.");
    return;
  }

  const senderId = event.senderID || event.sender.id;
  const query = args.join(" ");

  // Check if the user provided a query
  if (!query) {
    api.sendMessage("Usage: /lyrics [song name]", senderId);
    return;
  }

  try {
    const { data } = await axios.get(
      `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(query)}`
    );

    // Check if lyrics are found
    if (data?.lyrics) {
      const messages = splitMessage(data.title, data.artist, data.lyrics, 2000);

      // Send lyrics messages in chunks
      for (const message of messages) {
        api.sendMessage(message, senderId);
      }

      // Send an image if available
      if (data.image) {
        api.sendMessage(
          {
            attachment: {
              type: "image",
              payload: { url: data.image, is_reusable: true },
            },
          },
          senderId
        );
      }
    } else {
      api.sendMessage("Sorry, no lyrics were found for your query.", senderId);
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    api.sendMessage(
      "Sorry, there was an error processing your request.",
      senderId
    );
  }
};

// Helper function to split messages into chunks
function splitMessage(title, artist, lyrics, chunkSize) {
  const message = `Title: ${title}\nArtist: ${artist}\n\n${lyrics}`;
  return Array.from({ length: Math.ceil(message.length / chunkSize) }, (_, i) =>
    message.slice(i * chunkSize, (i + 1) * chunkSize)
  );
}
