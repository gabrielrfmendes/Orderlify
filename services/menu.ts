/* eslint-disable */
const errorMock = {
	response: {
		status: 404, // or 500
		data: null,
	},
};

const extras: Extra[] = [
	{ id: 1, name: 'Bacon', price: 4 },
	{ id: 2, name: 'Cheddar', price: 3 },
	{ id: 3, name: 'Tomate', price: 2 },
];

const flavors: Flavor[] = [
	{
		id: 1,
		name: 'Peperone',
		price: 32.98,
	},
	{
		id: 2,
		name: 'Frango com Catupiry',
		price: 34.98,
	},
	{
		id: 3,
		name: 'Marguerita',
		price: 30.98,
	},

	{
		id: 4,
		name: 'Peperone',
		price: 27.98,
	},
	{
		id: 5,
		name: 'Frango com Catupiry',
		price: 29.98,
	},
	{
		id: 6,
		name: 'Marguerita',
		price: 25.98,
	},

	{
		id: 7,
		name: 'Peperone',
		price: 22.98,
	},
	{
		id: 8,
		name: 'Frango com Catupiry',
		price: 24.98,
	},
	{
		id: 9,
		name: 'Marguerita',
		price: 20.98,
	},
];

const stuffedCrusts: StuffedCrust[] = [
	{ id: 1, name: 'Catupiry', price: 7 },
	{ id: 2, name: 'Cheddar', price: 7 },
	{ id: 3, name: 'Cream Cheese', price: 8 },

	{ id: 4, name: 'Catupiry', price: 6 },
	{ id: 5, name: 'Cheddar', price: 6 },
	{ id: 6, name: 'Cream Cheese', price: 7 },

	{ id: 7, name: 'Catupiry', price: 5 },
	{ id: 8, name: 'Cheddar', price: 5 },
	{ id: 9, name: 'Cream Cheese', price: 6 },
];

const menuItems: MenuItem[] = [
	{
		id: 1,
		name: 'Pizza Grande',
		flavorIds: [1, 2, 3],
		stuffedCrustIds: [1, 2, 3],
		extraIds: [],
		status: 'available',
		availability: 'preparationRequired',
	},
	{
		id: 2,
		name: 'Pizza Média',
		flavorIds: [4, 5, 6],
		stuffedCrustIds: [4, 5, 6],
		extraIds: [],
		status: 'available',
		availability: 'preparationRequired',
	},
	{
		id: 3,
		name: 'Pizza Pequena',
		flavorIds: [7, 8, 9],
		stuffedCrustIds: [7, 8, 9],
		extraIds: [],
		status: 'available',
		availability: 'preparationRequired',
	},
	
	{
		id: 4,
		name: 'AC/DCheese',
		price: 27.98,
		flavorIds: [],
		stuffedCrustIds: [],
		extraIds: [1, 2, 3],
		isAvailable: true,
		availability: 'preparationRequired',
	},
	{
		id: 5,
		name: 'Rock Burger',
		price: 29.98,
		flavorIds: [],
		stuffedCrustIds: [],
		extraIds: [1, 2, 3],
		isAvailable: true,
		availability: 'preparationRequired',
	},
	{
		id: 6,
		name: 'Blues Bacon',
		price: 31.98,
		flavorIds: [],
		stuffedCrustIds: [],
		extraIds: [1, 2, 3],
		isAvailable: true,
		availability: 'preparationRequired',
	},

	{
		id: 7,
		name: 'Coca-Cola Lata',
		price: 4.99,
		flavorIds: [],
		stuffedCrustIds: [],
		extraIds: [],
		isAvailable: true,
		availability: 'readyToDelivery',
	},
	{
		id: 8,
		name: 'Guaraná Lata',
		price: 4.5,
		flavorIds: [],
		stuffedCrustIds: [],
		extraIds: [],
		isAvailable: true,
		availability: 'readyToDelivery',
	},
	{
		id: 9,
		name: 'Água Mineral',
		price: 2.5,
		flavorIds: [],
		stuffedCrustIds: [],
		extraIds: [],
		isAvailable: true,
		availability: 'readyToDelivery',
	},
];

export function getMenuItems() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				data: {
					menuItems,
					flavors,
					stuffedCrusts,
					extras,
				},
			});
		}, 2000);
	});
}

export function saveMenuItem(data: any) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				data: {
					id: Math.floor(Math.random() * 100),
					pictureUri: data?.picture?.uri || null,
				},
			});
		}, 2000);
	});
}

export function updateMenuItem(data: any) {
	return new Promise((resolve, reject) => {
		const update = {};

		if (data.picture?.uri) {
			update.pictureUri = data.picture.uri;
		}

		setTimeout(() => {
			resolve({
				data: update,
			});
		}, 1000);
	});
}

export function deleteMenuItem(data: any) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, 1000);
	});
}
