import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Get the invite link to the support server",
	cooldownDelay: Time.Minute * 5
})
export class SupportCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383763076108348", "946548300339888138"]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const channel = (await this.container.client.channels.fetch(
			this.container.env.string("INVITE_CHANNEL")
		)) as TextChannel;
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Support Server")
					.setDescription(
						`Here is the [support server invite link](${(await channel.createInvite({ maxAge: 0 })).url})`
					)
			]
		});
	}
}
