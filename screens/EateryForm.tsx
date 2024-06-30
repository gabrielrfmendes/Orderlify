import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useTheme, Avatar, Button, TextInput } from 'react-native-paper';
import AppBackground from '../components/AppBackground';
import TextField from '../components/TextField';
import ImageSelector from '../components/ImageSelector';
import { formatPhoneNumberInput } from '../utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EateryFormScreen() {
	const [picture, setPicture] = useState(null);
	const [name, setName] = useState('');
	const [nameValidationMessage, setNameValidationMessage] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] =
		useState('');
	const [address, setAddress] = useState();
	const [openingHours, setOpeningHours] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const imageSelectorRef = useRef();
	const nameInputRef = useRef();
	const phoneNumberInputRef = useRef();
	const theme = useTheme();
	const navigation = useNavigation();
	const route = useRoute();

	useEffect(() => {
		setAddress(route.params?.address);
		setOpeningHours(route.params?.openingHours);
	}, [route]);

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

	function handleSave() {
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

		if (invalidFields > 0) {
			focusFirstInvalidField();
			return;
		}

		setIsLoading(true);
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
						onSubmitEditing={handleSave}
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
						onPress={() =>
							navigation.navigate('AddressForm', {
								address,
							})
						}
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
						onPress={() =>
							navigation.navigate('OpeningHours', {
								openingHours,
							})
						}
					>
						<TextField
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
