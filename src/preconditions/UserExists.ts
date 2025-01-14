import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

export class HasOrderPrecondition extends Precondition {
	public override async chatInputRun(interaciton: ChatInputCommandInteraction) {
		const user = interaciton.options.getUser("user");

		if (
			!user ||
			!(await this.container.stores
				.get("models")
				.get("user")
				.findUnique({ where: { id: user.id } }))
		)
			return this.error({ message: "Unknown user" });
		return this.ok();
	}
}
