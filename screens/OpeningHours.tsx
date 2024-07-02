import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
} from 'react';
import { View, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { useTheme, List, Text, Switch, Button } from 'react-native-paper';
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { weekDays, translateWeekDay } from '../utils';
import { weekDay } from '../types';
import AppBackground from '../components/AppBackground';
import { useRoute, useNavigation } from '@react-navigation/native';

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
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const { colors } = useTheme();
	const snapPoints = useMemo(() => ['50%'], []);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const handlePresentModalPress = useCallback(() => {
		setSelectedWeekDays([props.weekDay]);
		bottomSheetModalRef.current?.present();
		setIsBottomSheetVisible(true);
	}, []);
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);
	const handleDismissModalPress = useCallback(() => {
		bottomSheetModalRef.current.dismiss();
		setIsBottomSheetVisible(false);
	}, []);

	useEffect(() => {
		setSelectedWeekDays([props.weekDay]);
		setOpeningTime(props.openingTime || '08:00');
		setClosingTime(props.closingTime || '23:00');
	}, [props.openingTime, props.closingTime]);

	useEffect(() => {
		const onBackPress = () => {
			handleDismissModalPress();
			if (isBottomSheetVisible) {
				return true;
			}
			return false;
		};

		BackHandler.addEventListener('hardwareBackPress', onBackPress);

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', onBackPress);
		};
	}, [isBottomSheetVisible]);

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
									handlePresentModalPress();
								}
							}}
							style={{ height: 28 }}
						/>
					</View>
				)}
				onPress={handlePresentModalPress}
			/>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={snapPoints}
				enablePanDownToClose
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={{ flex: 1 }}>
					<Text
						variant="titleMedium"
						style={{
							fontWeight: 'bold',
							marginLeft: 8,
							color: colors.secondary,
							marginTop: 16,
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
						variant="titleMedium"
						style={{
							color: colors.secondary,
							marginHorizontal: 16,
							marginVertical: 32,
						}}
					>
						Aplique este horário para mais dias na semana
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							gap: 8,
							flex: 1,
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
										height: 48,
										width: 48,
										borderRadius: 24,
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
										{translateWeekDay(weekDay).substring(0, 3)}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							paddingHorizontal: 32,
							paddingVertical: 16,
							gap: 8,
						}}
					>
						<Button style={{ flex: 1 }} onPress={handleDismissModalPress}>
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
								bottomSheetModalRef.current.dismiss();
								setIsBottomSheetVisible(true);
								setSelectedWeekDays([props.weekDay]);
							}}
						>
							Confirmar
						</Button>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</React.Fragment>
	);
}

export default function OpeningHoursStep() {
	const [openingHours, setOpeningHours] = useState([]);
	const route = useRoute();
	const navigation = useNavigation();

	useEffect(() => {
		const params = route.params;

		if (params.openingHours) {
			setOpeningHours(params.openingHours);
		}
	}, [route]);

	function handleSave() {
		route.params.onSave({
			openingHours,
		});
		navigation.goBack();
	}

	return (
		<AppBackground>
			<ScrollView contentContainerStyle={{ flex: 1 }}>
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
			</ScrollView>
			<View
				style={{
					paddingHorizontal: 32,
					paddingVertical: 16,
				}}
			>
				<Button mode="contained" onPress={handleSave}>
					Salvar
				</Button>
			</View>
		</AppBackground>
	);
}
