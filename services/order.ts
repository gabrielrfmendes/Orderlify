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
		items: [
			{
				menuItem: {
					id: 2,
					name: 'AC/DCheese',
					description:
						"It's a long way to the top if you wanna rock 'n' roll, mas com nosso hambúrguer suculento, cheddar derretido, bacon crocante e cebolas caramelizadas, você chega lá em uma mordida! Rock 'n' roll never tasted so good!",
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				details: [
					{
						id: 1,
						observation: 'Quero esse hamburguer sangrando',
						extras: [
							{
								name: 'Bacon',
								price: 4,
								quantity: 3,
							},
							{
								name: 'Cheddar',
								price: 4,
								quantity: 3,
							},
						],
						quantity: 2,
						deliveredQuantity: 2,
						status: 'delivered',
					},
					{
						id: 2,
						quantity: 1,
						deliveredQuantity: 1,
						status: 'delivered',
					},
				],
			},
			{
				menuItem: null,
				pizza: {
					name: 'Pizza Grande',
					halfs: [
						{
							menuItem: {
								id: 87,
								name: 'Peperone',
								description:
									"It's a long way to the top if you wanna rock 'n' roll, mas com nosso hambúrguer suculento, cheddar derretido, bacon crocante e cebolas caramelizadas, você chega lá em uma mordida! Rock 'n' roll never tasted so good!",
								price: 32.98,
								pictureUri: null,
							},
							stuffedCrust: {
								name: 'Cheddar',
								price: 6,
							},
						},
						{
							menuItem: {
								id: 88,
								name: '4 Queijos',
								description:
									"It's a long way to the top if you wanna rock 'n' roll, mas com nosso hambúrguer suculento, cheddar derretido, bacon crocante e cebolas caramelizadas, você chega lá em uma mordida! Rock 'n' roll never tasted so good!",
								price: 27.98,
								pictureUri: null,
							},
							stuffedCrust: {
								name: 'Catupiry',
								price: 4,
							},
						},
					],
					quantity: 2,
					deliveredQuantity: 2,
					status: 'delivered',
					observation: 'Sem cebola',
				},
			},
		],
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
						name: 'Bacon',
						price: 4,
						quantity: 3,
					},
					{
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
		tableNumber: 2,
		status: 'ready',
		createdAt: 1720304415945,
		createdBy: {
			id: 69,
			name: 'Roberto',
			role: 'waiter',
		},
		items: [
			{
				menuItem: {
					id: 1,
					name: 'AC/DCheese',
					description:
						"It's a long way to the top if you wanna rock 'n' roll, mas com nosso hambúrguer suculento, cheddar derretido, bacon crocante e cebolas caramelizadas, você chega lá em uma mordida! Rock 'n' roll never tasted so good!",
					price: 27.98,
					pictureUri: null,
					availability: 'preparationRequired',
				},
				details: [
					{
						id: 6,
						observation: 'Quero esse hamburguer sangrando',
						extras: [
							{
								name: 'Bacon',
								price: 4,
								quantity: 3,
							},
							{
								name: 'Cheddar',
								price: 4,
								quantity: 3,
							},
						],
						quantity: 2,
						deliveredQuantity: 0,
						status: 'ready',
					},
					{
						id: 7,
						quantity: 1,
						deliveredQuantity: 0,
						status: 'ready',
					},
				],
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
