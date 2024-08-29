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
		tableNumber: 1,
		status: 'waiting',
		createdAt: Date.now(),
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
		items: [
			{
				id: 1,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [
					{
						id: 1,
						name: 'Bacon',
						price: 4,
						quantity: 3,
					},
					{
						id: 2,
						name: 'Cheddar',
						price: 4,
						quantity: 3,
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'waiting',
			},
			{
				id: 2,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'waiting',
			},
			{
				id: 33,
				menuItem: {
					id: 97,
					name: 'Pizza Grande',
					availability: 'preparationRequired',
				},
				halfs: [
					{
						flavor: {
							id: 87,
							name: 'Peperone',
							price: 32.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvx-zwf4C_70VXSGwGV-3xInSTXgA5DVRJQ&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Cheddar',
							price: 5,
						},
					},
					{
						flavor: {
							id: 88,
							name: '4 Queijos',
							price: 27.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJW5m9mbjt_yPKHlArcC1Hnhuu5-SL7xWbdA&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Catupiry',
							price: 5,
						},
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Sem cebola',
				status: 'waiting',
			},
			{
				menuItem: {
					id: 88,
					name: 'Coca-Cola Lata',
					price: 1.99,
					pictureUri: null,
					availability: 'readyToDelivery',
				},
				quantity: 1,
				deliveredQuantity: 0,
				status: 'ready',
			},
		],
	},
	{
		id: 2,
		tableNumber: 2,
		status: 'waiting',
		createdAt: Date.now(),
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
		items: [
			{
				id: 21,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [
					{
						id: 67,
						name: 'Bacon',
						price: 4,
						quantity: 3,
					},
					{
						id: 78,
						name: 'Cheddar',
						price: 4,
						quantity: 3,
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'waiting',
			},
			{
				id: 22,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'waiting',
			},
			{
				id: 33,
				menuItem: {
					id: 97,
					name: 'Pizza Grande',
					availability: 'preparationRequired',
				},
				halfs: [
					{
						flavor: {
							id: 87,
							name: 'Peperone',
							price: 32.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvx-zwf4C_70VXSGwGV-3xInSTXgA5DVRJQ&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Cheddar',
							price: 5,
						},
					},
					{
						flavor: {
							id: 88,
							name: '4 Queijos',
							price: 27.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJW5m9mbjt_yPKHlArcC1Hnhuu5-SL7xWbdA&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Catupiry',
							price: 5,
						},
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Sem cebola',
				status: 'waiting',
			},
			{
				menuItem: {
					id: 88,
					name: 'Coca-Cola Lata',
					price: 1.99,
					pictureUri: null,
					availability: 'readyToDelivery',
				},
				quantity: 1,
				deliveredQuantity: 0,
				status: 'ready',
			},
		],
	},
	{
		id: 3,
		tableNumber: 7,
		status: 'preparing',
		createdAt: Date.now(),
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
		items: [
			{
				id: 21,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [
					{
						id: 67,
						name: 'Bacon',
						price: 4,
						quantity: 3,
					},
					{
						id: 78,
						name: 'Cheddar',
						price: 4,
						quantity: 3,
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'preparing',
			},
			{
				id: 22,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'preparing',
			},
			{
				id: 33,
				menuItem: {
					id: 97,
					name: 'Pizza Grande',
					availability: 'preparationRequired',
				},
				halfs: [
					{
						flavor: {
							id: 87,
							name: 'Peperone',
							price: 32.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvx-zwf4C_70VXSGwGV-3xInSTXgA5DVRJQ&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Cheddar',
							price: 5,
						},
					},
					{
						flavor: {
							id: 88,
							name: '4 Queijos',
							price: 27.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJW5m9mbjt_yPKHlArcC1Hnhuu5-SL7xWbdA&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Catupiry',
							price: 5,
						},
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Sem cebola',
				status: 'preparing',
			},
			{
				menuItem: {
					id: 88,
					name: 'Coca-Cola Lata',
					price: 1.99,
					pictureUri: null,
					availability: 'readyToDelivery',
				},
				quantity: 1,
				deliveredQuantity: 0,
				status: 'ready',
			},
		],
	},
	{
		id: 3,
		tableNumber: 4,
		status: 'preparing',
		createdAt: Date.now(),
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
		items: [
			{
				id: 21,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [
					{
						id: 67,
						name: 'Bacon',
						price: 4,
						quantity: 3,
					},
					{
						id: 78,
						name: 'Cheddar',
						price: 4,
						quantity: 3,
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'preparing',
			},
			{
				id: 22,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'preparing',
			},
			{
				id: 33,
				menuItem: {
					id: 97,
					name: 'Pizza Grande',
					availability: 'preparationRequired',
				},
				halfs: [
					{
						flavor: {
							id: 87,
							name: 'Peperone',
							price: 32.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvx-zwf4C_70VXSGwGV-3xInSTXgA5DVRJQ&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Cheddar',
							price: 5,
						},
					},
					{
						flavor: {
							id: 88,
							name: '4 Queijos',
							price: 27.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJW5m9mbjt_yPKHlArcC1Hnhuu5-SL7xWbdA&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Catupiry',
							price: 5,
						},
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Sem cebola',
				status: 'preparing',
			},
			{
				menuItem: {
					id: 88,
					name: 'Coca-Cola Lata',
					price: 1.99,
					pictureUri: null,
					availability: 'readyToDelivery',
				},
				quantity: 1,
				deliveredQuantity: 0,
				status: 'ready',
			},
		],
	},
	{
		id: 5,
		tableNumber: 5,
		status: 'ready',
		createdAt: Date.now(),
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
		items: [
			{
				id: 21,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [
					{
						id: 67,
						name: 'Bacon',
						price: 4,
						quantity: 3,
					},
					{
						id: 78,
						name: 'Cheddar',
						price: 4,
						quantity: 3,
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'ready',
			},
			{
				id: 22,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'ready',
			},
			{
				id: 33,
				menuItem: {
					id: 97,
					name: 'Pizza Grande',
					availability: 'preparationRequired',
				},
				halfs: [
					{
						flavor: {
							id: 87,
							name: 'Peperone',
							price: 32.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvx-zwf4C_70VXSGwGV-3xInSTXgA5DVRJQ&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Cheddar',
							price: 5,
						},
					},
					{
						flavor: {
							id: 88,
							name: '4 Queijos',
							price: 27.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJW5m9mbjt_yPKHlArcC1Hnhuu5-SL7xWbdA&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Catupiry',
							price: 5,
						},
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Sem cebola',
				status: 'ready',
			},
			{
				menuItem: {
					id: 88,
					name: 'Coca-Cola Lata',
					price: 1.99,
					pictureUri: null,
					availability: 'readyToDelivery',
				},
				quantity: 1,
				deliveredQuantity: 0,
				status: 'ready',
			},
		],
	},
	{
		id: 6,
		tableNumber: 6,
		status: 'delivered',
		createdAt: Date.now(),
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
		items: [
			{
				id: 21,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [
					{
						id: 67,
						name: 'Bacon',
						price: 4,
						quantity: 3,
					},
					{
						id: 78,
						name: 'Cheddar',
						price: 4,
						quantity: 3,
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'delivered',
			},
			{
				id: 22,
				menuItem: {
					id: 13,
					name: 'AC/DCheese',
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				extras: [],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Quero esse hamburguer sangrando',
				status: 'delivered',
			},
			{
				id: 33,
				menuItem: {
					id: 97,
					name: 'Pizza Grande',
					availability: 'preparationRequired',
				},
				halfs: [
					{
						flavor: {
							id: 87,
							name: 'Peperone',
							price: 32.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvx-zwf4C_70VXSGwGV-3xInSTXgA5DVRJQ&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Cheddar',
							price: 5,
						},
					},
					{
						flavor: {
							id: 88,
							name: '4 Queijos',
							price: 27.98,
							pictureUri:
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJW5m9mbjt_yPKHlArcC1Hnhuu5-SL7xWbdA&usqp=CAU',
						},
						stuffedCrust: {
							name: 'Catupiry',
							price: 5,
						},
					},
				],
				quantity: 2,
				deliveredQuantity: 0,
				observation: 'Sem cebola',
				status: 'delivered',
			},
			{
				menuItem: {
					id: 88,
					name: 'Coca-Cola Lata',
					price: 1.99,
					pictureUri: null,
					availability: 'readyToDelivery',
				},
				quantity: 1,
				deliveredQuantity: 0,
				status: 'delivered',
			},
		],
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
