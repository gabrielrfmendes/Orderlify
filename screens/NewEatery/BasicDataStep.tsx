import React, { useState, useRef, useEffect } from 'react';
import {
	useWindowDimensions,
	ScrollView,
	View,
	TouchableOpacity,
	Keyboard,
} from 'react-native';
import { useTheme, Text, Avatar, Divider, Button } from 'react-native-paper';
import MaskInput from 'react-native-mask-input';
import TextField from '../../components/TextField';
import ImageSelector from '../../components/ImageSelector';
import { NewEateryStepProps } from './';

export default function BasicDataStep(props: NewEateryStepProps) {
	const [eateryLogo, setEateryLogo] = useState(null);
	const [eateryName, setEateryName] = useState('');
	const [eateryNameValidationMessage, setEateryNameValidationMessage] =
		useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] =
		useState('');
	const [isLoading, setIsLoading] = useState(false);
	const imageSelectorRef = useRef();
	const nameInputRef = useRef();
	const phoneNumberInputRef = useRef();
	const theme = useTheme();
	const window = useWindowDimensions();

	useEffect(() => {
		nameInputRef.current?.focus();
	}, []);

	function handlePictureChange() {
		imageSelectorRef.current?.showOptions();
	}

	function handleEateryNameChange(text: string) {
		setEateryNameValidationMessage('');
		setEateryName(text);
	}

	function handleValidateEateryData() {
		let invalidFields = 0;
		let firstInvalidField = null;

		if (!eateryName.length) {
			setEateryNameValidationMessage('Nome do estabelecimento obrigatório');
			invalidFields++;
			firstInvalidField = nameInputRef.current?.focus;
		}

		if (!phoneNumber.length) {
			setPhoneNumberValidationMessage('O telefone é obrigatório');
			invalidFields++;
			if (!firstInvalidField) {
				firstInvalidField = phoneNumberInputRef.current?.focus;
			}
		}

		if (invalidFields > 0) {
			firstInvalidField();
			return;
		}

		Keyboard.dismiss();

		setIsLoading(true);
		props.stepForward();
		setIsLoading(false);
	}

	return (
		<ScrollView>
			<View
				style={{
					flex: 1,
					width: window.width,
				}}
			>
				<Text variant="labelLarge" style={{ marginBottom: 8, paddingLeft: 12 }}>
					Dados básicos
				</Text>
				<View
					style={{
						gap: 4,
						paddingHorizontal: 8,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							gap: 8,
						}}
					>
						<TouchableOpacity onPress={handlePictureChange}>
							{!eateryLogo ? (
								<Avatar.Icon
									icon="camera-plus"
									size={52}
									style={{
										backgroundColor: theme.colors.surfaceVariant,
									}}
								/>
							) : (
								<Avatar.Image source={{ uri: eateryLogo.uri }} size={52} />
							)}
						</TouchableOpacity>
						<View style={{ flex: 1 }}>
							<TextField
								reference={nameInputRef}
								onSubmitEditing={phoneNumberInputRef.current?.focus}
								returnKeyType="next"
								blurOnSubmit={false}
								label="Nome"
								placeholder="Digite o nome do estabelecimento"
								value={eateryName}
								onChangeText={handleEateryNameChange}
								error={!!eateryNameValidationMessage}
								validationMessage={eateryNameValidationMessage}
							/>
							<ImageSelector
								title="Logomarca"
								ref={imageSelectorRef}
								selectedImage={eateryLogo}
								onImageSelected={setEateryLogo}
							/>
						</View>
					</View>
					<TextField
						reference={phoneNumberInputRef}
						onSubmitEditing={handleValidateEateryData}
						render={(props) => (
							<MaskInput
								{...props}
								mask={[
									'(',
									/\d/,
									/\d/,
									')',
									' ',
									/\d/,
									/\d/,
									/\d/,
									/\d/,
									/\d/,
									'-',
									/\d/,
									/\d/,
									/\d/,
									/\d/,
								]}
							/>
						)}
						returnKeyType="done"
						label="Número de telefone"
						placeholder="Digite o telefone"
						value={phoneNumber}
						onChangeText={setPhoneNumber}
						maxLength={15}
						keyboardType="number-pad"
						error={!!phoneNumberValidationMessage}
						validationMessage={phoneNumberValidationMessage}
					/>
					<Button
						mode="contained"
						onPress={handleValidateEateryData}
						loading={isLoading}
					>
						{isLoading ? '' : 'Continuar'}
					</Button>
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
						Você poderá atualizar essas informações a qualquer momento.
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
