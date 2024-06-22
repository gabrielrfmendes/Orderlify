import type Eatery from './types';

enum Role {
	Manager = 'manager',
	Waiter = 'waiter',
	Chef = 'chef',
	Removed = 'removed',
}

export function translateRole(role: Role): string {
	switch (role) {
		case Role.Manager:
			return 'Gerente';
		case Role.Waiter:
			return 'Garçom';
		case Role.Chef:
			return 'Cozinheiro';
		case Role.Removed:
			return 'Removido';
		default:
			return 'Papel não reconhecido';
	}
}

export function getElapsedTime(timestamp) {
	const currentTimestamp = new Date()
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');
	const now = new Date(currentTimestamp);
	const elapsedTime = now.getTime() - new Date(timestamp);

	const seconds = Math.floor(elapsedTime / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(weeks / 4);

	if (months > 0) {
		return months === 1 ? 'Há 1 mês' : `Há ${months} meses`;
	} else if (weeks > 0) {
		return weeks === 1 ? 'Há 1 semana' : `Há ${weeks} semanas`;
	} else if (days > 0) {
		return days === 1 ? 'Há 1 dia' : `Há ${days} dias`;
	} else if (hours > 0) {
		return hours === 1 ? 'Há 1 hora' : `Há ${hours} horas`;
	} else if (minutes > 0) {
		return minutes === 1 ? 'Há 1 minuto' : `Há ${minutes} minutos`;
	} else {
		return 'Agora mesmo';
	}
}

export function isEateryOpen(eatery: Eatery) {
	const currentDate = new Date();
	const currentDay = currentDate.toLocaleDateString('en-US', {
		weekday: 'long',
	});
	const currentTime = currentDate.toTimeString().slice(0, 5);

	const todayOperatingHours = eatery.operatingHours.find(
		(hours) => hours.day === currentDay
	);

	if (!todayOperatingHours) {
		return false;
	}

	const { open, close } = todayOperatingHours;

	return currentTime >= open && currentTime <= close;
}

export const weekDays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

const translatedWeekDays = {
	Sunday: 'Domingo',
	Monday: 'Segunda-feira',
	Tuesday: 'Terça-feira',
	Wednesday: 'Quarta-feira',
	Thursday: 'Quinta-feira',
	Friday: 'Sexta-feira',
	Saturday: 'Sábado',
};

export function translateWeekDay(weekDay) {
	return translatedWeekDays[weekDay] || 'Dia inválido';
}