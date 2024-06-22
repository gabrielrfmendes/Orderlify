import React, { useState, useRef, useEffect } from 'react';
import {
	useWindowDimensions,
	View,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import {
	useTheme,
	List,
	Text,
	Switch,
	Button,
	Divider,
	ActivityIndicator,
} from 'react-native-paper';
import BottomSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { weekDays, translateWeekDay } from '../../utils';
import { weekDay } from '../../types';
import { NewEateryStepProps } from './';

interface OpeningHourListItemProps {
	weekDay: weekDay;
	openingTime: string;
	closingTime: string;
	onDisableOpeningHour: () => void;
	onConfirm: (params: {
		weekDays: weekDay[];
		openingTime: string;
		closingTime: string;
	}) => void;
}

function OpeningHourListItem(props: OpeningHourListItemProps) {
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
	const [openingTime, setOpeningTime] = useState('08:00');
	const [closingTime, setClosingTime] = useState('23:00');
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState('openingTime');
	const [selectedWeekDays, setSelectedWeekDays] = useState([]);

	useEffect(() => {
		setSelectedWeekDays([props.weekDay]);
		setOpeningTime(props.openingTime || '08:00');
		setClosingTime(props.closingTime || '23:00');
	}, [props.openingTime, props.closingTime]);

	const bottomSheetRef = useRef();
	const window = useWindowDimensions();
	const { colors } = useTheme();

	function defineOpeningTime(timeToSelect, time) {
		setSelectedTime(timeToSelect);
		const [hours, minutes] = time.split(':');
		const newDate = new Date();
		newDate.setHours(hours);
		newDate.setMinutes(minutes);
		setSelectedDate(newDate);
		setIsDatePickerVisible(true);
	}

	return (
		<React.Fragment>
			<List.Item
				title={translateWeekDay(props.weekDay)}
				titleStyle={{
					fontWeight: 'bold',
					color: colors.secondary,
				}}
				right={() => (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<Text
							variant="titleMedium"
							style={{
								color:
									props.openingTime && props.closingTime
										? colors.secondary
										: colors.error,
							}}
						>
							{props.openingTime && props.closingTime
								? `${props.openingTime} - ${props.closingTime}`
								: 'Fechado'}
						</Text>
						<Switch
							value={Boolean(props.openingTime && props.closingTime)}
							onValueChange={() => {
								if (props.openingTime && props.closingTime) {
									props.onDisableOpeningHour();
								} else {
									bottomSheetRef.current?.open();
								}
							}}
							style={{ height: 28 }}
						/>
					</View>
				)}
				onPress={() => bottomSheetRef.current?.open()}
			/>
			<BottomSheet
				openDuration={500}
				closeDuration={400}
				ref={bottomSheetRef}
				height={window.height / 2}
				customModalProps={{
					statusBarTranslucent: true,
				}}
				closeOnPressBack
				draggable
				dragOnContent
			>
				<Text
					variant="titleMedium"
					style={{
						marginLeft: 8,
						color: colors.secondary,
					}}
				>
					Definir horário de funcionamento
				</Text>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 16,
					}}
				>
					<TouchableOpacity
						style={{
							borderWidth: 1,
							borderColor: colors.secondary,
							borderRadius: 4,
							paddingHorizontal: 4,
						}}
						onPress={() => defineOpeningTime('openingTime', openingTime)}
					>
						<Text variant="titleLarge" style={{ color: colors.secondary }}>
							{openingTime}
						</Text>
					</TouchableOpacity>
					<Text variant="titleLarge" style={{ color: colors.secondary }}>
						-
					</Text>
					<TouchableOpacity
						style={{
							borderWidth: 1,
							borderColor: colors.secondary,
							borderRadius: 4,
							paddingHorizontal: 4,
						}}
						onPress={() => defineOpeningTime('closingTime', closingTime)}
					>
						<Text variant="titleLarge" style={{ color: colors.secondary }}>
							{closingTime}
						</Text>
					</TouchableOpacity>
					<DateTimePickerModal
						isVisible={isDatePickerVisible}
						date={selectedDate}
						mode="time"
						onConfirm={(date) => {
							const newDate = new Date(date);
							const hours = String(newDate.getHours()).padStart(2, '0');
							const minutes = String(newDate.getMinutes()).padStart(2, '0');
							if (selectedTime === 'openingTime') {
								setOpeningTime(`${hours}:${minutes}`);
							} else {
								setClosingTime(`${hours}:${minutes}`);
							}

							setIsDatePickerVisible(false);
						}}
						onCancel={() => setIsDatePickerVisible(false)}
					/>
				</View>
				<Text
					variant="labelLarge"
					style={{
						color: colors.secondary,
						marginHorizontal: 16,
					}}
				>
					Dias da semana
				</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						gap: 8,
						paddingTop: 8,
						paddingBottom: 32,
					}}
				>
					{weekDays.map((weekDay) => {
						const isWeekDaySelected = Boolean(
							selectedWeekDays.find(
								(selectedWeekDay) => selectedWeekDay === weekDay
							)
						);

						return (
							<TouchableOpacity
								key={weekDay}
								style={{
									height: 40,
									width: 40,
									borderRadius: 20,
									backgroundColor: isWeekDaySelected
										? colors.primary
										: 'transparent',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								onPress={() => {
									if (isWeekDaySelected) {
										const selectedWeekDaysUpdate = selectedWeekDays.filter(
											(swd) => swd !== weekDay
										);

										setSelectedWeekDays(selectedWeekDaysUpdate);
									} else {
										setSelectedWeekDays([...selectedWeekDays, weekDay]);
									}
								}}
							>
								<Text
									variant="titleMedium"
									style={{
										color: isWeekDaySelected ? 'white' : colors.primary,
									}}
								>
									{translateWeekDay(weekDay).charAt(0)}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						padding: 8,
						gap: 8,
					}}
				>
					<Button
						style={{ flex: 1 }}
						onPress={() => bottomSheetRef.current.close()}
					>
						Cancelar
					</Button>
					<Button
						style={{ flex: 1 }}
						mode="contained"
						onPress={() => {
							props?.onConfirm({
								weekDays: selectedWeekDays,
								openingTime,
								closingTime,
							});
							bottomSheetRef.current.close();
							setSelectedWeekDays([props.weekDay]);
						}}
					>
						Confirmar
					</Button>
				</View>
			</BottomSheet>
		</React.Fragment>
	);
}

export default function OpeningHoursStep(props: NewEateryStepProps) {
	const [openingHours, setOpeningHours] = useState([
		{ weekDay: 'Monday', openingTime: '06:00', closingTime: '20:00' },
		{ weekDay: 'Tuesday', openingTime: '06:00', closingTime: '20:00' },
		{ weekDay: 'Wednesday', openingTime: '06:00', closingTime: '20:00' },
		{ weekDay: 'Thursday', openingTime: '06:00', closingTime: '20:00' },
		{ weekDay: 'Friday', openingTime: '06:00', closingTime: '21:00' },
		{ weekDay: 'Saturday', openingTime: '07:00', closingTime: '21:00' },
	]);
	const [isLoading, setIsLoading] = useState(true);
	const { colors } = useTheme();
	const window = useWindowDimensions();

	useEffect(() => {
		setTimeout(() => setIsLoading(false), 1000);
	}, []);

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					width: window.width,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				width: window.width,
			}}
		>
			<Text variant="labelLarge" style={{ marginBottom: 8, paddingLeft: 12 }}>
				Horários de funcionamento
			</Text>
			<ScrollView>
				{weekDays.map((weekDay) => {
					const openingHour = openingHours.find((o) => o.weekDay === weekDay);

					return (
						<OpeningHourListItem
							key={weekDay}
							weekDay={weekDay}
							openingTime={openingHour?.openingTime}
							closingTime={openingHour?.closingTime}
							onConfirm={({ weekDays, openingTime, closingTime }) => {
								const openingHoursUpdate = [...openingHours];

								weekDays.forEach((weekDay) => {
									const index = openingHoursUpdate.findIndex(
										(openingHour) => openingHour.weekDay === weekDay
									);

									if (index !== -1) {
										openingHoursUpdate[index] = {
											...openingHoursUpdate[index],
											openingTime,
											closingTime,
										};
									} else {
										openingHoursUpdate.push({
											weekDay,
											openingTime,
											closingTime,
										});
									}
								});

								setOpeningHours(openingHoursUpdate);
							}}
							onDisableOpeningHour={() => {
								setOpeningHours(
									openingHours.filter(
										(openingHour) => openingHour.weekDay !== weekDay
									)
								);
							}}
						/>
					);
				})}
				<View
					style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: 8 }}
				>
					<Button style={{ flex: 1 }} onPress={props.stepBackward}>
						Voltar
					</Button>
					<Button
						mode="contained"
						onPress={props.stepForward}
						loading={isLoading}
						style={{ flex: 1 }}
					>
						{isLoading ? '' : 'Continuar'}
					</Button>
				</View>
				<Divider
					style={{
						marginHorizontal: 16,
						marginTop: 8,
					}}
				/>
				<Text
					variant="labelMedium"
					style={{
						height: window.height / 3,
						textAlign: 'center',
						color: colors.secondary,
						paddingVertical: 8,
					}}
				>
					Somente gerentes podem operar fora dos horários de funcionamento.
				</Text>
			</ScrollView>
		</View>
	);
}
