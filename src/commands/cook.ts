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
	description: "Cook an order",
	preconditions: ["ChefOnly", "ValidOrderData"]
})
export class CookCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) =>
					input.setName("order").setRequired(true).setDescription("The order to cook").setAutocomplete(true)
				)
				.addAttachmentOption((input) =>
					input.setName("image").setRequired(true).setDescription("The image to use")
				),
			{
				idHints: ["992383511359131648", "992383513355616347", "946548126884446208", "946548127811379220"]
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
				status: OrderStatus.UNCOOKED
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
					.setTitle("Cooking order")
					.setDescription(`Cooking order ${order.id}`)
			]
		});

		const imageMessage = await this.container.stores.get("webhooks").get("image").sendImage(image);

		await this.orderModel.update({
			where: { id: order.id },
			data: {
				image: imageMessage.attachments.first()!.url,
				status: OrderStatus.COOKED,
				cookedAt: new Date()
			}
		});

		await this.sendCustomerMessage(order, {
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Order cooked")
					.setDescription(`Your order ${order.id} has been cooked.`)
			]
		});

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Green)
					.setTitle("Order cooked")
					.setDescription(`Order ${order.id} has been cooked.`)
			]
		});
	}
}
