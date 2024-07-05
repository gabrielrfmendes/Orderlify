/* eslint-disable */
const errorMock = {
	response: {
		status: 404, // or 500
		data: null,
	},
};

const menuItems = [
	{
		id: 1,
		name: 'AC/DCheese',
		description:
			"It's a long way to the top if you wanna rock 'n' roll, mas com nosso hambúrguer suculento, cheddar derretido, bacon crocante e cebolas caramelizadas, você chega lá em uma mordida! Rock 'n' roll never tasted so good!",
		price: 27.98,
		pictureUri: null,
		availability: 'PreparationRequired',
	},
	{
		id: 3,
		name: 'Kurt Cobaicon',
		price: 27.98,
		description:
			'Come as you are e experimente nosso hambúrguer com bacon crocante, queijo cheddar derretido, cebolas roxas e maionese defumada. Um sabor que vai fazer você Smell Like Teen Spirit!',
		pictureUri:
			'https://s3.us-west-2.amazonaws.com/whatsmenu/production/mostardapubburguer/products/459123/mostardapubburguer7m8dkncchl1t9g0webp',
		availability: 'PreparationRequired',
	},
	{
		id: 2,
		name: 'Coca-Cola 2 Litros',
		price: 1.99,
		availability: 'ReadyToDelivery',
	},
];

export function getMenuItems() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: { menuItems } });

			// reject(errorMock);
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
