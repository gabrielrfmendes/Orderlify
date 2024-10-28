/* eslint-disable */
const errorMock = {
	response: {
		status: 401, // 404, 409 or 500
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
			firstName: 'Charles',
			lastName: 'Gabriel',
			username: 'charlesgabriel',
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
	firstName: string;
	lastName: string;
	username: string;
	password: string;
}) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
		  // reject(errorMock);
			resolve({ data: {
			  user: accountData,
			  accessToken: authDataMock.accessToken,
			}});

		}, 5000);
	});
}

export function authenticate(credentials: { email: string; password: string }) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
		  // reject(errorMock);
					
			resolve({ data: authDataMock });
		}, 2000);
	});
}
