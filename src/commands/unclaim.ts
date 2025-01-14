import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { type AutocompleteInteraction, type ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Unclaim an order",
	preconditions: ["ValidClaimType", "ExistingOrder"]
})
export class UnclaimCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) =>
					input
						.setName("order")
						.setDescription("The order to unclaim")
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addStringOption((input) =>
					input
						.setName("type")
						.setDescription("The type of claim")
						.setRequired(true)
						.addChoices(
							...Object.entries(Command.ClaimType).map(([key, value]) => ({
								name: key,
								value
							}))
						)
				),
			{
				idHints: ["992383764074340462", "992383765760454686", "946548300880961617", "946548301443006485"]
			}
		);
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction) {
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
				status: {
					in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
				}
			},
			orderBy: {
				id: "asc"
			}
		}));
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply();

		const order = await this.getOrder(interaction);
		const claimType = interaction.options.getString("type", true) as Command.ClaimType;
		const isCookClaim = claimType === Command.ClaimType.Cooking;

		if ((isCookClaim ? order.chef : order.deliverer) !== interaction.user.id) {
			throw new Error("The order you specified has not been claimed by you");
		}

		await this.orderModel.update({
			where: { id: order.id },
			data: isCookClaim ? { chef: null } : { deliverer: null }
		});

		await this.sendCustomerMessage(order, {
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Order unclaimed")
					.setDescription("Your order has been unclaimed")
			]
		});

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Order unclaimed")
					.setDescription(`You unclaimed order \`${order.id}\` for ${claimType}`)
			]
		});
	}
}
