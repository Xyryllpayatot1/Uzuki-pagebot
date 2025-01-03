const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Utility",
  description: "Sends a back greeting message and lists all commands and events.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = function ({ event, args }) {
  if (event.type === "message" || event.postback.payload === "HELP_PAYLOAD") {
    const commandsPath = path.join(__dirname, "../commands");
    const eventsPath = path.join(__dirname, "../events");

    let message = "Here are the available commands and events:\n\n";

    // Load and log command details
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    
    // Group commands by category
    let categorizedCommands = {};

    commandFiles.forEach((file) => {
      const command = require(path.join(commandsPath, file));
      if (command.config) {
        let category = command.config.category || "Uncategorized";
        
        // Initialize category if it doesn't exist
        if (!categorizedCommands[category]) {
          categorizedCommands[category] = [];
        }

        categorizedCommands[category].push(command);
      }
    });

    // Prepare message with sorted and grouped commands
    Object.keys(categorizedCommands).sort().forEach((category) => {
      message += `${category}:\n`; // Add category title

      categorizedCommands[category].sort((a, b) => a.config.name.localeCompare(b.config.name)) // Sort commands by name
        .forEach((command) => {
          message += `${command.config.usePrefix ? PREFIX : ""}${command.config.name} -\n `;
          message += `Author: ${command.config.author},\n`;
          message += `Description: ${command.config.description}\n`;
        });
      
      message += "\n"; // Add extra space after each category
    });

    message += "\u2B50 Thank you for using Uzuki Mikata!\n";
    message += "This is an early access version. If you encounter any issues or bugs, please contact my owner:\n";
    message += "\u2709 Jhon Xyryll Samoy\n";
    
    // Send the message to the user
    api.sendMessage(message, event.sender.id);
  }
};
