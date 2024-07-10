export interface Eatery {
	id: string;
	name: string;
	logoUri?: string;
	operatingHours: {
		day: string;
		open: string;
		close: string;
	}[];
	memberRole?: 'manager' | 'waiter' | 'chef' | 'removed';
	memberId: number;
}

export interface MenuItem {
	id: number;
	name: string;
	price: number;
	pictureUri: string | null;
	ingredients: {
		id: number;
		name: string;
		quantity: number;
	}[];
}
