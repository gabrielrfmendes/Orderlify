import React, { useState, useRef, useEffect } from 'react';
import {
	useWindowDimensions,
	ScrollView,
	View,
	Keyboard,
	Modal,
	ActivityIndicator,
} from 'react-native';
import { useTheme, Text, Divider, Button } from 'react-native-paper';
import TextField from '../../components/TextField';
import { getAddressByCEP } from '../../services/eatery';
import { NewEateryStepProps } from './';

export default function AddressStep(props: NewEateryStepProps) {
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
	const [isMounted, setIsMounted] = useState(false);
	const postalCodeInputRef = useRef();
	const streetInputRef = useRef();
	const addressNumberInputRef = useRef();
	const neighborhoodInputRef = useRef();
	const scrollViewRef = useRef();
	const theme = useTheme();
	const window = useWindowDimensions();

	useEffect(() => {
		if (props.isFocused) {
			setIsMounted(true);
		}
	}, [props.isFocused]);

	function handlePostalCodeChange(text: string) {
		let numericText: string = text.replace(/[^0-9]/g, '');

		if (numericText.length > 8) {
			numericText = numericText.slice(0, -1);
		}

		const maskedText = numericText.replace(/\b(\d{5})(\d{3})\b/g, '$1-$2');

		setPostalCode(maskedText);
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
			setPostalCodeValidationMessage('CEP não encontrado');
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

	function handleValidateEateryData() {
		let invalidFields = 0;
		let firstInvalidField = null;

		if (!postalCode.length) {
			setPostalCodeValidationMessage('O CEP é obrigatório');
			invalidFields++;

			scrollViewRef.current.scrollTo({ y: 0 });
			firstInvalidField = postalCodeInputRef.current?.focus;
		}

		if (!neighborhood.length) {
			setNeighborhoodValidationMessage('O bairro é obrigatório');
			invalidFields++;

			if (!firstInvalidField) {
				scrollViewRef.current.scrollTo({ y: 8 });
				firstInvalidField = neighborhoodInputRef.current?.focus;
			}
		}

		if (!street.length) {
			setStreetValidationMessage('A rua é obrigatória');
			invalidFields++;

			if (!firstInvalidField) {
				scrollViewRef.current.scrollTo({ y: 16 });
				firstInvalidField = streetInputRef.current?.focus;
			}
		}

		if (!addressNumber.length) {
			setAddressNumberValidationMessage('Obrigatório');
			invalidFields++;

			if (!firstInvalidField) {
				scrollViewRef.current.scrollTo({ y: 16 });
				firstInvalidField = addressNumberInputRef.current?.focus;
			}
		}

		if (!addressNumber.length) {
			setAddressNumberValidationMessage('Obrigatório');
			invalidFields++;

			if (!firstInvalidField) {
				scrollViewRef.current.scrollTo({ y: 16 });
				firstInvalidField = addressNumberInputRef.current?.focus;
			}
		}

		if (invalidFields > 0) {
			firstInvalidField();
			return;
		}

		Keyboard.dismiss();

		props.stepForward();
	}

	if (!isMounted) {
		return <></>;
	}

	return (
		<ScrollView ref={scrollViewRef}>
			<Modal visible={isAddressLoading} transparent animationType="fade">
				<View
					style={{
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator size="large" />
				</View>
			</Modal>
			<View
				style={{
					flex: 1,
					width: window.width,
				}}
			>
				<Text variant="labelLarge" style={{ marginBottom: 8, paddingLeft: 12 }}>
					Endereço
				</Text>
				<View
					style={{
						gap: 4,
						paddingHorizontal: 8,
					}}
				>
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
					/>
					<View style={{ flexDirection: 'row', gap: 4 }}>
						<View style={{ flex: 1 }}>
							<TextField label="Cidade" value={city} editable={false} />
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
							/>
						</View>
						<TextField
							reference={addressNumberInputRef}
							onSubmitEditing={handleValidateEateryData}
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
					<View style={{ flexDirection: 'row' }}>
						<Button style={{ flex: 1 }} onPress={props.stepBackward}>
							Voltar
						</Button>
						<Button
							mode="contained"
							onPress={handleValidateEateryData}
							style={{ flex: 1 }}
						>
							Continuar
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
							color: theme.colors.secondary,
							paddingVertical: 8,
						}}
					>
						Essas informações serão exibidas no seu cárdapio digital.
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
