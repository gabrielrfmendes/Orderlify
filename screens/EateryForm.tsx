import React, { useState, useRef } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useTheme, Avatar, Button, TextInput } from 'react-native-paper';
import AppBackground from '../components/AppBackground';
import TextField from '../components/TextField';
import ImageSelector from '../components/ImageSelector';
import { formatPhoneNumberInput } from '../utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { saveEatery } from '../services/eatery';
import { useEatery } from '../contexts/Eatery';

type OpeningHour = {
	weekDay: string;
	openingTime: string;
	closingTime: string;
};

function formatOpeningHours(openingHours: OpeningHour[]) {
	const dayAbbreviations = {
		Monday: 'Seg',
		Tuesday: 'Ter',
		Wednesday: 'Qua',
		Thursday: 'Qui',
		Friday: 'Sex',
		Saturday: 'Sáb',
		Sunday: 'Dom',
	};

	const getDayAbbreviation = (day: string) => dayAbbreviations[day] || day;

	const weekDaysOrder = {
		Monday: 0,
		Tuesday: 1,
		Wednesday: 2,
		Thursday: 3,
		Friday: 4,
		Saturday: 5,
		Sunday: 6,
	};

	openingHours.sort(
		(a, b) => weekDaysOrder[a.weekDay] - weekDaysOrder[b.weekDay]
	);

	const groupedHours = {};
	openingHours.forEach(({ weekDay, openingTime, closingTime }) => {
		const timeRange = `${openingTime}-${closingTime}`;
		if (!groupedHours[timeRange]) {
			groupedHours[timeRange] = [];
		}
		groupedHours[timeRange].push(weekDay);
	});

	const result = [];
	for (const [timeRange, days] of Object.entries(groupedHours)) {
		const dayGroups = [];
		let groupStart = days[0];
		for (let i = 1; i <= days.length; i++) {
			if (
				i === days.length ||
				weekDaysOrder[days[i]] !== weekDaysOrder[days[i - 1]] + 1
			) {
				const groupEnd = days[i - 1];
				if (groupStart === groupEnd) {
					dayGroups.push(getDayAbbreviation(groupStart));
				} else {
					dayGroups.push(
						`${getDayAbbreviation(groupStart)}-${getDayAbbreviation(groupEnd)}`
					);
				}
				groupStart = days[i];
			}
		}
		result.push(`${dayGroups.join(', ')} ${timeRange}`);
	}

	return result.join('\n');
}

function formatTimerInput(input: string) {
	let cleaned = input.replace(/\D/g, '');

	if (input.length < 6 || (input.length === 7 && input.charAt(0) !== '0')) {
		cleaned = cleaned.slice(0, -1);
	}

	const truncated = cleaned.substring(0, 4);
	const padded = truncated.padStart(4, '0');
	const hours = parseInt(padded.substring(0, 2), 10);
	const minutes = parseInt(padded.substring(2, 4), 10);
	const formattedHours = hours.toString();
	const formattedMinutes = minutes.toString().padStart(2, '0');

	return `${formattedHours}h ${formattedMinutes}m`;
}

function adjustTimer(timer: string) {
	const regex = /^(\d+)h (\d+)m$/;
	const match = timer.match(regex);

	if (!match) {
		return timer;
	}

	let hours = parseInt(match[1], 10);
	let minutes = parseInt(match[2], 10);

	if (minutes > 59) {
		const extraHours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		hours += extraHours;
		minutes = remainingMinutes;
	}

	const formattedHours = hours.toString();
	const formattedMinutes = minutes.toString().padStart(2, '0');

	return `${formattedHours}h ${formattedMinutes}m`;
}

function timeToMinutes(time: string): number {
	const regex = /^(\d+)h (\d+)m$/;
	const match = time.match(regex);

	if (!match) {
		throw new Error('Invalid format. Use "Xh Ym" format.');
	}

	const hours = parseInt(match[1], 10);
	const minutes = parseInt(match[2], 10);

	const totalMinutes = hours * 60 + minutes;

	return totalMinutes;
}

export default function EateryFormScreen() {
	const [picture, setPicture] = useState(null);
	const [name, setName] = useState('');
	const [nameValidationMessage, setNameValidationMessage] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] =
		useState('');
	const [address, setAddress] = useState();
	const [openingHours, setOpeningHours] = useState([]);
	const [orderTimer, setOrderTimer] = useState('0h 00m');
	const [orderTimerValidationMessage, setOrderTimerValidationMessage] =
		useState('');
	const [isLoading, setIsLoading] = useState(false);
	const imageSelectorRef = useRef();
	const nameInputRef = useRef();
	const phoneNumberInputRef = useRef();
	const theme = useTheme();
	const navigation = useNavigation();
	const { selectEatery } = useEatery();

	function handlePictureChange() {
		imageSelectorRef.current?.showOptions();
	}

	function handleNameChange(text: string) {
		setNameValidationMessage('');
		setName(text);
	}

	function handlePhoneNumberChange(text: string) {
		setPhoneNumberValidationMessage('');
		setPhoneNumber(formatPhoneNumberInput(text));
	}

	function handleOrderTimerChange(text: string) {
		setOrderTimerValidationMessage('');
		setOrderTimer(formatTimerInput(text));
	}

	async function handleSave() {
		let invalidFields = 0;
		let focusFirstInvalidField = () => {};

		if (!name.length) {
			setNameValidationMessage('Insira o nome do estabelecimento');
			invalidFields++;
			focusFirstInvalidField = nameInputRef.current?.focus;
		}

		if (!phoneNumber.length) {
			if (invalidFields === 0) {
				focusFirstInvalidField = phoneNumberInputRef.current?.focus;
			}

			setPhoneNumberValidationMessage('Insira o telefone do estabelecimento');

			invalidFields++;
		}

		if (timeToMinutes(orderTimer) < 10) {
			setOrderTimerValidationMessage('O tempo de preparo mínimo é 10 minutos');
			invalidFields++;
		}

		if (invalidFields > 0) {
			focusFirstInvalidField();
			return;
		}

		setIsLoading(true);

		const data = {
			picture,
			name,
			phoneNumber,
			address,
			openingHours,
			orderTimer: timeToMinutes(orderTimer),
		};

		const result = await saveEatery(data);

		selectEatery({
			...data,
			...result.data.eatery,
		});
	}

	return (
		<AppBackground>
			<ScrollView>
				<View style={{ padding: 16 }}>
					<TouchableOpacity
						style={{
							alignSelf: 'center',
							marginBottom: 16,
						}}
						onPress={handlePictureChange}
					>
						{!picture ? (
							<Avatar.Icon
								icon={() => (
									<MaterialCommunityIcons
										name="camera-plus-outline"
										size={24}
										color={theme.colors.onSurfaceVariant}
									/>
								)}
								size={76}
								style={{
									backgroundColor: theme.colors.surfaceVariant,
								}}
							/>
						) : (
							<Avatar.Image
								source={{ uri: picture.uri }}
								size={76}
								style={{
									backgroundColor: theme.colors.surfaceVariant,
								}}
							/>
						)}
					</TouchableOpacity>
					<TextField
						left={<TextInput.Icon icon="store-outline" />}
						autoFocus
						reference={nameInputRef}
						onSubmitEditing={phoneNumberInputRef.current?.focus}
						returnKeyType="next"
						blurOnSubmit={false}
						label="Nome"
						value={name}
						onChangeText={handleNameChange}
						error={!!nameValidationMessage}
						validationMessage={nameValidationMessage}
					/>
					<ImageSelector
						title="Logomarca"
						ref={imageSelectorRef}
						selectedImage={picture}
						onImageSelected={setPicture}
					/>
					<TextField
						left={<TextInput.Icon icon="phone-outline" />}
						reference={phoneNumberInputRef}
						onSubmitEditing={() => {
							navigation.navigate('AddressForm', {
								address,
								onSave: (data) => {
									setAddress(data.address);
									navigation.navigate('OpeningHours', {
										openingHours,
										onSave: (data) => {
											setOpeningHours(data.openingHours);
										},
									});
								},
							});
						}}
						returnKeyType="next"
						label="Número de telefone"
						value={phoneNumber}
						onChangeText={handlePhoneNumberChange}
						maxLength={13}
						keyboardType="phone-pad"
						error={!!phoneNumberValidationMessage}
						validationMessage={phoneNumberValidationMessage}
					/>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('AddressForm', {
								address,
								onSave: (data) => {
									setAddress(data.address);
								},
							});
						}}
					>
						<TextField
							multiline
							value={
								address
									? `${address.street} ${address.addressNumber} \n${address.neighborhood} \n${address.city} ${address.state} \n${address.postalCode}`
									: ''
							}
							left={<TextInput.Icon icon="map-marker-outline" />}
							label="Endereço"
							editable={false}
							right={
								<TextInput.Icon
									icon={(props) => <Ionicons name="caret-forward" {...props} />}
								/>
							}
						/>
						<View
							style={{
								backgroundColor: 'transparent',
								height: 50,
								width: '100%',
								position: 'absolute',
							}}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('OpeningHours', {
								openingHours,
								onSave: (data) => {
									setOpeningHours(data.openingHours);
								},
							});
						}}
					>
						<TextField
							multiline
							value={formatOpeningHours(openingHours)}
							left={<TextInput.Icon icon="clock-outline" />}
							label="Horários de funcionamento"
							editable={false}
							right={
								<TextInput.Icon
									icon={(props) => <Ionicons name="caret-forward" {...props} />}
								/>
							}
						/>
						<View
							style={{
								backgroundColor: 'transparent',
								height: 50,
								width: '100%',
								position: 'absolute',
							}}
						/>
					</TouchableOpacity>
					<TextField
						left={<TextInput.Icon icon="timer-sand" />}
						onBlur={() => setOrderTimer(adjustTimer(orderTimer))}
						returnKeyType="next"
						label="Tempo entrega dos pedidos"
						value={orderTimer}
						onChangeText={handleOrderTimerChange}
						maxLength={7}
						keyboardType="number-pad"
						error={!!orderTimerValidationMessage}
						validationMessage={orderTimerValidationMessage}
					/>
				</View>
			</ScrollView>
			<View
				style={{
					paddingHorizontal: 32,
					paddingVertical: 16,
				}}
			>
				<Button mode="contained" onPress={handleSave} loading={isLoading}>
					{isLoading ? '' : 'Salvar'}
				</Button>
			</View>
		</AppBackground>
	);
}
