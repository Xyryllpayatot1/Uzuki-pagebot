const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  author: "Modified by XyryllPanget",
  version: "1.0",
  category: "Utility",
  description: "Sends a back greeting message and lists all commands and events.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = function ({ event, args, api }) {
  if (event.type === "message" || event.postback?.payload === "HELP_PAYLOAD") {
    const commandsPath = path.join(__dirname, "../commands");
    const eventsPath = path.join(__dirname, "../events");

    let message = "\uD83D\uDCDC **Uzuki Mikata Help Menu**\n\nHere are the available commands and events:\n\n";

    // Load and log command details
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    
    message += "\uD83D\uDEE0 **Commands:**\n";
    commandFiles.forEach((file) => {
      const command = require(path.join(commandsPath, file));
      if (command.config) {
        message += `\u2022 ${command.config.usePrefix ? PREFIX : ""}${command.config.name}\n`;
        message += `  \uD83D\uDCDD Description: ${command.config.description}\n`;
        message += `  \uD83C\uDFA8 Author: ${command.config.author}\n\n`;
      }
    });

    // Load and log event details
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));
    
    message += "\uD83D\uDCC5 **Events:**\n";
    eventFiles.forEach((file) => {
      const event = require(path.join(eventsPath, file));
      if (event.config) {
        message += `\u2022 ${event.config.name}\n`;
        message += `  \uD83D\uDCDD Description: ${event.config.description}\n`;
        message += `  \uD83C\uDFA8 Author: ${event.config.author}\n\n`;
      }
    });

    // Footer
    message += "\u2B50 Thank you for using Uzuki Mikata!\n";
    message += "This is an early access version. If you encounter any issues or bugs, please contact my owner:\n";
    message += "\u2709 Jhon Xyryll Samoy\n";

    // Send the message to the user
    api.sendMessage(message, event.sender.id);
  }
};
