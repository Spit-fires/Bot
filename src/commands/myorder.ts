import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import type { ChatInputCommandInteraction } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Show your order",
	preconditions: ["HasOrder"],
	cooldownDelay: Time.Second * 5
})
export class MyOrderCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383676203683880", "946548213140291684"]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const order = await this.orderModel.findFirst({
			where: {
				customer: interaction.user.id,
				status: {
					in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
				}
			}
		});

		await interaction.editReply({ embeds: [await this.createOrderEmbed(order!)] });
	}
}
