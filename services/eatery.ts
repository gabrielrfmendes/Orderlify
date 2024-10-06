import axios from 'axios';

/* eslint-disable */
const errorMock = {
	response: {
		status: 404, // or 500
		data: null,
	},
};

const eateries = [
	{
		id: 1,
		name: 'Loja 1',
		logoUri: undefined,
		operatingHours: [
			{ day: 'Monday', open: '07:00', close: '21:00' },
			{ day: 'Wednesday', open: '07:00', close: '21:00' },
			{ day: 'Thursday', open: '07:00', close: '21:00' },
			{ day: 'Friday', open: '07:00', close: '22:00' },
			{ day: 'Saturday', open: '08:00', close: '22:00' },
		],
		memberRole: 'manager',
		memberId: 69,
		orderTimer: 50,
	},
	{
		id: 2,
		name: 'Loja 2',
		logoUri: undefined,
		operatingHours: [
			{ day: 'Monday', open: '07:00', close: '21:00' },
			{ day: 'Wednesday', open: '07:00', close: '21:00' },
			{ day: 'Thursday', open: '07:00', close: '21:00' },
			{ day: 'Friday', open: '07:00', close: '22:00' },
			{ day: 'Saturday', open: '08:00', close: '22:00' },
		],
		memberRole: 'waiter',
		memberId: 69,
		orderTimer: 50,
	},
	{
		id: 3,
		name: 'Loja 3',
		logoUri: undefined,
		operatingHours: [
			{ day: 'Monday', open: '06:00', close: '20:00' },
			{ day: 'Tuesday', open: '06:00', close: '20:00' },
			{ day: 'Wednesday', open: '06:00', close: '20:00' },
			{ day: 'Thursday', open: '06:00', close: '20:00' },
			{ day: 'Friday', open: '06:00', close: '21:00' },
			{ day: 'Saturday', open: '07:00', close: '21:00' },
			{ day: 'Sunday', open: '07:00', close: '19:00' },
		],
		memberRole: 'chef',
		memberId: 69,
		orderTimer: 60,
	},
	{
		id: 4,
		name: 'Loja 4',
		logoUri: undefined,
		operatingHours: [
			{ day: 'Monday', open: '06:00', close: '20:00' },
			{ day: 'Tuesday', open: '06:00', close: '20:00' },
			{ day: 'Wednesday', open: '06:00', close: '20:00' },
			{ day: 'Thursday', open: '06:00', close: '20:00' },
			{ day: 'Friday', open: '06:00', close: '21:00' },
			{ day: 'Saturday', open: '07:00', close: '21:00' },
			{ day: 'Sunday', open: '07:00', close: '19:00' },
		],
		memberRole: 'manager',
		memberId: 69,
		orderTimer: 120,
	},
	{
		id: 5,
		name: 'Loja 5',
		logoUri: undefined,
		operatingHours: [
			{ day: 'Monday', open: '06:00', close: '20:00' },
			{ day: 'Tuesday', open: '06:00', close: '20:00' },
			{ day: 'Wednesday', open: '06:00', close: '20:00' },
			{ day: 'Thursday', open: '06:00', close: '20:00' },
			{ day: 'Friday', open: '06:00', close: '21:00' },
			{ day: 'Saturday', open: '07:00', close: '21:00' },
			{ day: 'Sunday', open: '07:00', close: '19:00' },
		],
		memberRole: 'manager',
		memberId: 69,
		orderTimer: 10,
	},
	{
		id: 6,
		name: 'Loja 6',
		logoUri: undefined,
		operatingHours: [
			{ day: 'Monday', open: '06:00', close: '20:00' },
			{ day: 'Tuesday', open: '06:00', close: '20:00' },
			{ day: 'Wednesday', open: '06:00', close: '20:00' },
			{ day: 'Thursday', open: '06:00', close: '20:00' },
			{ day: 'Friday', open: '06:00', close: '21:00' },
			{ day: 'Saturday', open: '07:00', close: '21:00' },
		],
		memberRole: 'manager',
		memberId: 69,
		orderTimer: 40,
	},
	{
		id: 7,
		name: 'Loja 7',
		logoUri: undefined,
		operatingHours: [
			{ day: 'Monday', open: '06:00', close: '20:00' },
			{ day: 'Tuesday', open: '06:00', close: '20:00' },
			{ day: 'Wednesday', open: '06:00', close: '20:00' },
			{ day: 'Thursday', open: '06:00', close: '20:00' },
			{ day: 'Friday', open: '06:00', close: '21:00' },
			{ day: 'Saturday', open: '07:00', close: '21:00' },
			{ day: 'Sunday', open: '07:00', close: '19:00' },
		],
		memberRole: 'manager',
		memberId: 69,
		orderTimer: 60,
	},
];

const requests = [
	{
		id: 1,
		eatery: {
			id: 1,
			name: 'Mostarda Pub&Burguer',
			logoUri:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNPCEt803A_8-mus7Dcs_14XS2WryMkLEynnDA5dMkYOCuRezrEND6Oew&s=10',
			operatingHours: [
				{ day: 'Monday', open: '08:00', close: '22:00' },
				{ day: 'Tuesday', open: '08:00', close: '22:00' },
				{ day: 'Wednesday', open: '08:00', close: '22:00' },
				{ day: 'Thursday', open: '08:00', close: '22:00' },
				{ day: 'Friday', open: '08:00', close: '23:00' },
				{ day: 'Saturday', open: '09:00', close: '23:00' },
				{ day: 'Sunday', open: '09:00', close: '21:00' },
			],
		},
		requestedBy: {
			id: 1,
			name: 'Rey',
		},
		requestedAt: '2024-06-06T15:57:25.839Z',
		memberRole: 'manager',
	},
];

interface OpeningHour {
	weekDay: string;
	openingTime: string;
	closingTime: string;
}

interface Address {
	postalCode: string;
	city: string;
	state: string;
	neighborhood: string;
	propertyNumber: string;
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

export function saveEatery(data: Eatery) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				data: {
					eatery: {
						id: Math.floor(Math.random() * 100) + 1,
						createdAt: new Date(),
					},
				},
			});

			// reject(errorMock);
		}, 2000);
	});
}

export function getEateries() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: {
			  eateries,
			  totalEateries: eateries.length,
			} });

			// reject(errorMock);
		}, 2000);
	});
}

export function getRequests() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: {
			  requests,
			  total: requests.length,
			}});

			// reject(errorMock);
		}, 2000);
	});
}

export function confirmRequest(requestId: number) {
	const request = requests.find((request) => request.id === requestId);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				data: {
					eatery: {
						...request.eatery,
						memberRole: request.memberRole,
					},
				},
			});
		}, 1000);
	});
}

export function deleteRequest(requestId: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), 1000);
	});
}

export async function getAddressByCEP(cep: string) {
	try {
		const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
		return response;
	} catch (error) {
		throw Error(error);
	}
}
