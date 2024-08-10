declare global {
	interface Address {
		postalCode: string;
		city: string;
		state: string;
		neighborhood: string;
		propertyNumber: string;
	}

	interface OpeningHour {
		weekDay: string;
		openingTime: string;
		closingTime: string;
	}

	interface Eatery {
		id: number;
		pictureUri: string;
		name: string;
		phoneNumber: string;
		address: Address;
		openingHours: OpeningHour[];
		memberRole: 'manager' | 'waiter' | 'chef' | 'removed' | null;
		createdAt: number;
	}

	interface MenuItem {
		id: number;
		name: string;
		price?: number;
		pictureUri?: string;
		availability: 'preparationRequired' | 'readyToDelivery';
	}

	interface Extra {
		id: number;
		name: string;
		price: number;
		quantity: number;
	}

	interface PizzaFlavor {
		id: number;
		name: string;
		price: number;
		pictureUri?: string;
	}

	interface StuffedCrust {
		id: number;
		name: string;
		price: number;
	}

	interface PizzaHalf {
		id: number;
		flavor: PizzaFlavor;
		stuffedCrust: StuffedCrust;
	}

	interface OrderItem {
		id: number;
		menuItem: MenuItem;
		extras?: Extra[];
		halfs?: PizzaHalf[];
		quantity: number;
		deliveredQuantity: number;
		observation?: string;
		status:
			| 'waiting'
			| 'preparing'
			| 'ready'
			| 'delivered'
			| 'finished'
			| 'removed';
	}

	interface Order {
		items: Item[];
	}
}

export {};
