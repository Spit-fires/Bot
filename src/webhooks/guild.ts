import { ApplyOptions } from "@sapphire/decorators";
import { Guild, EmbedBuilder, Colors } from "discord.js";
import { WebhookManager } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManager.Options>({
	webhookName: "Pixel Pizza Guilds",
	channelId: "711196897582383125"
})
export class GuildWebhook extends WebhookManager {
	public sendGuild(guild: Guild, added: boolean) {
		return this.send({
			embeds: [
				new EmbedBuilder()
					.setColor(added ? Colors.Green : Colors.Red)
					.setTitle(added ? "Added" : "Removed")
					.setDescription(
						`${this.container.client.user!.username} has been ${
							added ? "added to" : "removed from"
						} the guild ${guild.name}`
					)
					.setFooter({ text: guild.id })
					.setTimestamp()
			],
			username: guild.name,
			avatarURL: guild.iconURL() ?? this.container.client.user!.displayAvatarURL()
		});
	}
}
