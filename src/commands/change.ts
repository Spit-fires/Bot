import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import {
	AutocompleteInteraction,
	EmbedBuilder,
	Colors,
	ChatInputCommandInteraction
} from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Change the image of an order",
	preconditions: ["ChefOnly", "ValidOrderData"]
})
export class ChangeCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) =>
					input
						.setName("order")
						.setRequired(true)
						.setDescription("The order to change the image of")
						.setAutocomplete(true)
				)
				.addAttachmentOption((input) =>
					input.setName("image").setRequired(true).setDescription("The image to use")
				),
			{
				idHints: ["992383506078502952", "992383507282264124", "946548123713536050", "946548124489494618"]
			}
		);
	}

	public override autocompleteRun(interaction: AutocompleteInteraction) {
		return this.autocompleteOrder(interaction, (focused) => ({
			where: {
				OR: [
					{
						id: {
							startsWith: focused
						}
					},
					{
						order: {
							contains: focused
						}
					}
				],
				chef: interaction.user.id,
				status: OrderStatus.COOKED
			},
			orderBy: {
				id: "asc"
			}
		}));
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const order = await this.getOrder(interaction, { chef: interaction.user.id });
		const image = interaction.options.getAttachment("image", true);

		if (!this.isImage(image)) {
			throw new Error("The image you specified is not a valid image.");
		}

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.DarkGreen)
					.setTitle("Changing order image")
					.setDescription(`Changing order ${order.id} image`)
			]
		});

		const imageMessage = await this.container.stores.get("webhooks").get("image").sendImage(image);

		await this.orderModel.update({
			where: { id: order.id },
			data: { image: imageMessage.attachments.first()!.url }
		});

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.DarkGreen)
					.setTitle("Order image changed")
					.setDescription(`Order ${order.id} image changed`)
			]
		});
	}
}
