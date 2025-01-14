import { ChatInputCommand, Precondition, PreconditionContext, PreconditionStore } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

export class ValidOrderDataPrecondition extends Precondition {
	public override async chatInputRun(
		interaction: ChatInputCommandInteraction,
		command: ChatInputCommand,
		context: PreconditionContext
	) {
		const store = this.store as PreconditionStore;
		const result = await store.get("ExistingOrder")!.chatInputRun!(interaction, command, context);
		if (!result.isOk()) return result;
		const order = (await this.container.stores
			.get("models")
			.get("order")
			.findUnique({
				where: { id: interaction.options.getString("order", true) }
			}))!;
		try {
			await this.container.client.users.fetch(order.customer);
			await this.container.client.guilds.fetch(order.guild);
			const channel = await this.container.client.channels.fetch(order.channel);
			if (!channel) throw new Error();
			return await this.ok();
		} catch {
			return this.error({ message: "Customer, guild or channel not found" });
		}
	}
}
