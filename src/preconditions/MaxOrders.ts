import { OrderStatus } from "@prisma/client";
import { Precondition } from "@sapphire/framework";

export class MaxOrdersPrecondition extends Precondition {
	public override async chatInputRun() {
		const orders = await this.container.stores
			.get("models")
			.get("order")
			.count({
				where: {
					status: {
						in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
					}
				}
			});
		if (orders > this.container.env.integer("MAX_ORDERS"))
			return this.error({ message: "The maximum number of orders has been reached" });
		return this.ok();
	}
}
