/* eslint-disable */
const errorMock = {
	response: {
		status: 404, // or 500
		data: null,
	},
};

const authDataMock = {
	accessToken:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvbiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};

export function validateEmail(email: string) {
	const dataMock = {
		user: {
			name: 'Gabriel',
			pictureUri:
				'https://pbs.twimg.com/media/GBqyoM4WkAAKTS6?format=jpg&name=medium', // or null
		},
	};

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: dataMock });

			// reject(errorMock);
		}, 2000);
	});
}

export function createAccount(accountData: {
	name: string;
	pictureUri?: string;
	email: string;
	password: string;
}) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: authDataMock });

			//reject(errorMock);
		}, 2000);
	});
}

export function authenticate(credentials: { email: string; password: string }) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: authDataMock });

			//reject(errorMock);
		}, 2000);
	});
}
