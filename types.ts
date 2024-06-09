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
}
