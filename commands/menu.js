const discord = require('discord.js');
const { createEmbed, menu, sendEmbed, PPClient, colors, capitalize } = require('pixel-pizza');

module.exports = {
    name: "menu",
    description: "show a menu of pizzas to choose from",
    cooldown: 60,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: `Here are some examples of pizzas to order\n\`\`\`\n${menu.join("\n")}\n\`\`\``
        }), client, message);
    }
}