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
		memberRole?: 'manager' | 'waiter' | 'chef' | 'removed';
		createdAt: number;
	}

	interface Option {
		id: number;
		name: string;
		price: number;
	}

	interface Extra {
		id: number;
		name: string;
		price: number;
	}

	interface MenuItemOption {
		id: number;
		optionId: number;
	}

	interface MenuItemExtra {
		id: number;
		extra: Extra;
		orderQuantityLimit?: number;
	}

	interface MenuItem {
		id: number;
		name: string;
		price: number;
		pictureUri?: string;
		availability: 'preparationRequired' | 'readyToDelivery';
		isAvailable: boolean;
		isHalfAndHalf?: boolean;
		options?: MenuItemOption[];
		extras?: MenuItemExtra[];
	}

	interface OrderItemOption {
		id: number;
		menuItemOption: MenuItemOption;
	}

	interface OrderItemExtra {
		id: number;
		extra: Extra;
		quantity: number;
	}

	interface OrderItemHalf {
		id: number;
		menuItem: MenuItem;
		options?: OrderItemOption[];
		extras?: OrderItemExtra[];
	}

	interface OrderItem {
		id: number;
		menuItem?: MenuItem;
		options?: OrderItemOption[];
		extras?: OrderItemExtra[];
		halves?: OrderItemHalf[];
		quantity: number;
		observation?: string;
		status:
			| 'waiting'
			| 'preparing'
			| 'ready'
			| 'on_the_way'
			| 'delivered'
			| 'finished'
			| 'canceled';
		deliveredQuantity: number;
	}

	interface Order {
		id: number;
		items: OrderItem[];
	}

	interface OrderItemBody {
		menuItemId?: number;
		extras?: {
			extraId: number;
			quantity: number;
		}[];
		hals?: {
			menuItemId: number;
			extras?: {
				extraId: number;
				quantity: number;
			}[];
		}[];
		quantity: number;
		observation?: string;
	}
}

export {};
