import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import AppBackground from '../components/AppBackground';
import { useTheme, Button, TextInput } from 'react-native-paper';
import TextField from '../components/TextField';
import { getAddressByCEP } from '../services/eatery';
import { useNavigation, useRoute } from '@react-navigation/native';

function formatPostalCodeInput(input: string) {
	let digits = input.replace(/\D/g, '');

	if (digits.length > 8) {
		digits = digits.slice(0, 8);
	}

	if (digits.length <= 5) {
		return digits;
	} else {
		return `${digits.slice(0, 5)}-${digits.slice(5)}`;
	}
}

export default function AddresFormScreen() {
	const [postalCode, setPostalCode] = useState('');
	const [postalCodeValidationMessage, setPostalCodeValidationMessage] =
		useState('');
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [street, setStreet] = useState('');
	const [streetValidationMessage, setStreetValidationMessage] = useState('');
	const [addressNumber, setAddressNumber] = useState('');
	const [addressNumberValidationMessage, setAddressNumberValidationMessage] =
		useState('');
	const [neighborhood, setNeighborhood] = useState('');
	const [neighborhoodValidationMessage, setNeighborhoodValidationMessage] =
		useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const postalCodeInputRef = useRef();
	const streetInputRef = useRef();
	const addressNumberInputRef = useRef();
	const neighborhoodInputRef = useRef();
	const scrollViewRef = useRef();
	const theme = useTheme();
	const navigation = useNavigation();
	const route = useRoute();

	useEffect(() => {
		const address = route.params.address;

		if (address) {
			setPostalCode(address.postalCode);
			setStreet(address.street);
			setAddressNumber(address.addressNumber);
			setNeighborhood(address.neighborhood);
			setCity(address.city);
			setState(address.state);
		}
	}, [route]);

	function handlePostalCodeChange(text: string) {
		setPostalCode(formatPostalCodeInput(text));
		setPostalCodeValidationMessage('');
	}

	async function handlePostalCodeInputBlur() {
		if (postalCode.length === 0) {
			setPostalCodeValidationMessage('');
			return;
		}

		if (postalCode.length < 9) {
			setPostalCodeValidationMessage('CEP incompleto');
			return;
		}

		setIsAddressLoading(true);
		const { data } = await getAddressByCEP(postalCode.replace(/-/g, ''));
		setIsAddressLoading(false);

		if (!data.erro) {
			handleStreetChange(data.logradouro);
			handleNeighborhoodChange(data.bairro);
			setCity(data.localidade);
			setState(data.uf);
			if (!data.logradouro) {
				neighborhoodInputRef.current?.focus();
			} else {
				addressNumberInputRef.current?.focus();
			}
		} else {
			setPostalCodeValidationMessage('CEP inválido');
			postalCodeInputRef.current?.focus();
		}
	}

	function handleStreetChange(text: string) {
		setStreetValidationMessage('');
		setStreet(text);
	}

	function handleAddressNumberChange(text: string) {
		setAddressNumberValidationMessage('');
		setAddressNumber(text);
	}

	function handleNeighborhoodChange(text: string) {
		setNeighborhoodValidationMessage('');
		setNeighborhood(text);
	}

	function handleSave() {
		let invalidFields = 0;
		let focusFirstInvalidField = () => {};

		if (!postalCode.length) {
			setPostalCodeValidationMessage('Insira o CEP');
			invalidFields++;

			focusFirstInvalidField = postalCodeInputRef.current?.focus;
		}

		if (!neighborhood.length) {
			setNeighborhoodValidationMessage('Insira o bairro');
			invalidFields++;

			if (invalidFields === 0) {
				focusFirstInvalidField = neighborhoodInputRef.current?.focus;
			}
		}

		if (!street.length) {
			setStreetValidationMessage('Insira a rua');
			invalidFields++;

			if (invalidfields === 0) {
				focusFirstInvalidField = streetInputRef.current?.focus;
			}
		}

		if (!addressNumber.length) {
			setAddressNumberValidationMessage('Insira o número');
			invalidFields++;

			if (!invalidFields === 0) {
				focusFirstInvalidField = addressNumberInputRef.current?.focus;
			}
		}

		if (invalidFields > 0) {
			focusFirstInvalidField();
			return;
		}

		navigation.navigate('NewEatery', {
			address: {
				postalCode,
				city,
				state,
				neighborhood,
				street,
				addressNumber,
			},
		});
	}

	return (
		<AppBackground>
			<ScrollView ref={scrollViewRef}>
				<View style={{ padding: 16 }}>
					<TextField
						reference={postalCodeInputRef}
						onBlur={handlePostalCodeInputBlur}
						onSubmitEditing={handlePostalCodeInputBlur}
						returnKeyType="next"
						blurOnSubmit={true}
						label="CEP"
						placeholder="Digite o CEP"
						value={postalCode}
						onChangeText={handlePostalCodeChange}
						maxLength={9}
						keyboardType="number-pad"
						autoFocus
						error={!!postalCodeValidationMessage}
						validationMessage={postalCodeValidationMessage}
						left={<TextInput.Icon icon="mailbox" />}
						right={
							<TextInput.Icon
								icon={(props) => (
									<ActivityIndicator
										animating={isAddressLoading}
										color={theme.colors.primary}
										{...props}
									/>
								)}
							/>
						}
					/>
					<View style={{ flexDirection: 'row', gap: 4 }}>
						<View style={{ flex: 1 }}>
							<TextField
								label="Cidade"
								value={city}
								editable={false}
								left={<TextInput.Icon icon="city" />}
							/>
						</View>
						<TextField label="Estado" value={state} editable={false} />
					</View>
					<TextField
						reference={neighborhoodInputRef}
						onSubmitEditing={streetInputRef.current?.focus}
						returnKeyType="next"
						blurOnSubmit={false}
						label="Bairro"
						placeholder="Digite o bairro"
						value={neighborhood}
						onChangeText={handleNeighborhoodChange}
						error={!!neighborhoodValidationMessage}
						validationMessage={neighborhoodValidationMessage}
						left={<TextInput.Icon icon="map-marker" />}
					/>
					<View style={{ flexDirection: 'row', gap: 4 }}>
						<View style={{ flex: 1 }}>
							<TextField
								reference={streetInputRef}
								onSubmitEditing={addressNumberInputRef.current?.focus}
								blurOnSubmit={false}
								returnKeyType="next"
								label="Rua"
								placeholder="Digite a rua"
								value={street}
								onChangeText={handleStreetChange}
								error={!!streetValidationMessage}
								validationMessage={streetValidationMessage}
								left={<TextInput.Icon icon="sign-direction" />}
							/>
						</View>
						<TextField
							reference={addressNumberInputRef}
							onSubmitEditing={handleSave}
							returnKeyType="done"
							label="Número"
							placeholder="Número"
							value={addressNumber}
							maxLength={5}
							onChangeText={handleAddressNumberChange}
							error={!!addressNumberValidationMessage}
							validationMessage={addressNumberValidationMessage}
						/>
					</View>
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
