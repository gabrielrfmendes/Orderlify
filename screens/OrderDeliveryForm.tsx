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
import { useEatery } from '../contexts/Eatery';

export default function OrderDeliveryFormScreen() {
	const [customerName, setCustomerName] = useState('');
	const [nameValidationMessage, setNameValidationMessage] = useState('');
	const [customerNameValidationMessage, setCustomerNameValidationMessage] =
		useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] =
		useState('');
	const [address, setAddress] = useState();
	const [addressValidationMessage, setAddressValidationMessage] = useState('');
	const customerNameInputRef = useRef();
	const phoneNumberInputRef = useRef();
	const theme = useTheme();
	const navigation = useNavigation();
	const { selectedEatery, setNewOrder } = useEatery();

	function handleCustomerNameChange(text: string) {
		setCustomerNameValidationMessage('');
		setCustomerName(text);
	}

	function handlePhoneNumberChange(text: string) {
		setPhoneNumberValidationMessage('');
		setPhoneNumber(formatPhoneNumberInput(text));
	}

	function handleSave() {
		let invalidFields = 0;
		let focusFirstInvalidField = () => {};

		if (!customerName.length) {
			setCustomerNameValidationMessage('Insira o nome do estabelecimento');
			invalidFields++;
			focusFirstInvalidField = customerNameInputRef.current?.focus;
		}

		if (!phoneNumber.length) {
			if (invalidFields === 0) {
				focusFirstInvalidField = phoneNumberInputRef.current?.focus;
			}

			setPhoneNumberValidationMessage('Insira o telefone do estabelecimento');

			invalidFields++;
		}

		if (!address) {
			setAddressValidationMessage('Preencha o endereço');
		}

		if (invalidFields > 0) {
			focusFirstInvalidField();
			return;
		}

		const data = {
			customerName,
			phoneNumber,
			address,
		};

		setNewOrder({
			customer: data,
			eateryId: selectedEatery.id,
		});

		navigation.goBack();
		navigation.navigate('Menu');
	}

	return (
		<AppBackground>
			<ScrollView>
				<View style={{ padding: 16 }}>
					<TextField
						left={<TextInput.Icon icon="account-outline" />}
						autoFocus
						reference={customerNameInputRef}
						onSubmitEditing={phoneNumberInputRef.current?.focus}
						returnKeyType="next"
						blurOnSubmit={false}
						label="Nome do cliente"
						value={customerName}
						onChangeText={handleCustomerNameChange}
						error={!!customerNameValidationMessage}
						validationMessage={customerNameValidationMessage}
					/>
					<TextField
						left={<TextInput.Icon icon="phone-outline" />}
						reference={phoneNumberInputRef}
						onSubmitEditing={() => {
							navigation.navigate('AddressForm', {
								address,
								onSave: (data) => {
									setAddress(data.address);
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
							error={!!addressValidationMessage}
							validationMessage={addressValidationMessage}
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
				</View>
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
