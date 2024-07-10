/* eslint-disable */
const errorMock = {
	response: {
		status: 404, // or 500
		data: null,
	},
};

const orders = [
	{
		id: 1,
		tableNumber: 5,
		status: 'delivered',
		createdAt: 1720304415945,
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
	},
	{
		id: 2,
		tableNumber: 7,
		status: 'waiting',
		createdAt: Date.now(),
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
	},
	{
		id: 3,
		tableNumber: 2,
		status: 'ready',
		createdAt: 1720304415945,
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
	},
];

export function getActiveOrders(eateryId: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: { orders } });

			// reject(errorMock);
		}, 2000);
	});
}
