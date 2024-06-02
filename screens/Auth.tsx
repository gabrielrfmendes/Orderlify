import React, { useState, useRef } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Alert,
	TouchableOpacity,
} from 'react-native';
import {
	Text,
	TextInput,
	Button,
	IconButton,
	Avatar,
	useTheme,
} from 'react-native-paper';
import AppBackground from '../components/AppBackground';
import Stepper, { StepperHandler } from '../components/Stepper';
import TextField from '../components/TextField';
import { validateEmail, authenticate, createAccount } from '../services/auth';
import ImageSelector, {
	ImageSelectorHandler,
} from '../components/ImageSelector';
import { useAuth } from '../contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

function toRegret() {
	Alert.alert(
		'Ops',
		'Houve um problema com os nossos servidores, daremos um jeito nisso.'
	);
}

export default function Auth() {
	const stepperRef = useRef<StepperHandler>();
	const [email, setEmail] = useState('');
	const [validationMessage, setValidationMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState(null);
	const theme = useTheme();
	const [password, setPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const imageSelectorRef = useRef<ImageSelectorHandler>();
	const [profilePicture, setProfilePicture] = useState(null);
	const [name, setName] = useState('');
	const { saveAccessToken } = useAuth();

	function handleEmailChange(text: string) {
		setEmail(text);
		setValidationMessage('');
	}

	async function handleValidateEmail() {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!email.trim().length) {
			setValidationMessage('Preencha com seu e-mail');
			return;
		}

		if (!emailPattern.test(email.trim())) {
			setValidationMessage('E-mail inválido. Verifique e tente novamente');
			return;
		}

		try {
			setIsLoading(true);
			const response = await validateEmail(email);
			setUser(response.data.user);
			setIsLoading(false);
			stepperRef.current?.stepForward();
		} catch (error) {
			setIsLoading(false);
			toRegret();
		}
	}

	function handlePasswordChange(text: string) {
		setPassword(text.trim());
		setValidationMessage('');
	}

	async function handleValidatePassword() {
		if (password.length < 8) {
			setValidationMessage('A senha deve conter pelo meno 8 caracteres');
			return;
		}

		try {
			if (user) {
				setIsLoading(true);
				const response = await authenticate({ email, password });
				await saveAccessToken(response.data.accessToken);
				setIsLoading(false);
				return;
			}
			stepperRef.current?.stepForward();
		} catch (error) {
			throw Error(error);
			setIsLoading(false);
			toRegret();
		}
	}

	function handlePictureChange() {
		imageSelectorRef.current?.showOptions();
	}

	function handleNameChange(text: string) {
		setValidationMessage('');
		setName(text);
	}

	async function handleCreateAccount() {
		if (!name.length) {
			setValidationMessage('Insira seu nome');
			return;
		}

		try {
			setIsLoading(true);
			const response = await createAccount({ name, email, password });
			await saveAccessToken(response.data.accessToken);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			toRegret();
		}
	}

	return (
		<AppBackground>
			<Stepper ref={stepperRef}>
				<View style={styles.step}>
					<View style={styles.stepHeader}>
						<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
							Entre com seu e-mail
						</Text>
					</View>
					<TextField
						label="E-mail"
						placeholder="Digite seu melhor e-mail"
						autoFocus
						value={email}
						onChangeText={handleEmailChange}
						autoCapitalize="none"
						error={!!validationMessage}
						validationMessage={validationMessage}
					/>
					<Button
						mode="contained"
						onPress={handleValidateEmail}
						loading={isLoading}
					>
						{isLoading ? '' : 'Continuar'}
					</Button>
				</View>
				<View style={styles.step}>
					<View style={styles.stepHeader}>
						<IconButton
							icon="chevron-left"
							onPress={() => {
								stepperRef.current?.stepBackward();
							}}
						/>
						<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
							{user ? 'Insira sua senha' : 'Novo por aqui?'}
						</Text>
					</View>
					<View style={styles.account}>
						{user?.pictureUri ? (
							<Avatar.Image
								source={{ uri: user.pictureUri }}
								size={40}
								style={{
									backgroundColor: theme.colors.surfaceVariant,
								}}
							/>
						) : (
							<Avatar.Icon
								icon="account"
								size={40}
								style={{
									backgroundColor: theme.colors.surfaceVariant,
								}}
							/>
						)}
						<View>
							{user ? <Text variant="bodySmall">{email}</Text> : <></>}
							<Text variant="bodyLarge">{user?.name ? user.name : email}</Text>
						</View>
					</View>
					<TextField
						label={user ? 'Senha' : 'Crie sua senha'}
						placeholder={user ? 'Digite sua senha' : 'Nova senha'}
						value={password}
						onChangeText={handlePasswordChange}
						autoCapitalize="none"
						error={!!validationMessage}
						validationMessage={validationMessage}
						secureTextEntry={!isPasswordVisible}
						right={
							<TextInput.Icon
								icon={isPasswordVisible ? 'eye-off' : 'eye'}
								onPress={() => setIsPasswordVisible(!isPasswordVisible)}
							/>
						}
					/>
					<Button
						mode="contained"
						onPress={handleValidatePassword}
						loading={isLoading}
					>
						{!isLoading ? (user ? 'Entrar' : 'Continuar') : ''}
					</Button>
					{user ? <Button>Esqueceu a senha?</Button> : <></>}
				</View>
				<View style={styles.step}>
					<View style={styles.stepHeader}>
						<IconButton
							icon="chevron-left"
							onPress={() => {
								stepperRef.current?.stepBackward();
							}}
						/>
						<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
							Qual é o seu nome?
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							gap: 8,
						}}
					>
						<TouchableOpacity onPress={handlePictureChange}>
							{!profilePicture ? (
								<Avatar.Icon
									icon="camera-plus"
									size={52}
									style={{
										backgroundColor: theme.colors.surfaceVariant,
									}}
								/>
							) : (
								<Avatar.Image source={{ uri: profilePicture.uri }} size={52} />
							)}
						</TouchableOpacity>
						<View style={{ flex: 1 }}>
							<TextField
								label="Nome"
								placeholder="Digite seu nome"
								autoFocus
								value={name}
								onChangeText={handleNameChange}
								error={!!validationMessage}
								validationMessage={validationMessage}
							/>
							<ImageSelector
								title="Foto do perfil"
								ref={imageSelectorRef}
								selectedImage={profilePicture}
								onImageSelected={setProfilePicture}
							/>
						</View>
					</View>
					<Button
						mode="contained"
						onPress={handleCreateAccount}
						loading={isLoading}
					>
						{isLoading ? '' : 'Criar conta'}
					</Button>
				</View>
			</Stepper>
		</AppBackground>
	);
}

const styles = StyleSheet.create({
	step: {
		flex: 1,
		padding: 12,
		width: screenWidth,
		justifyContent: 'center',
	},
	stepHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	account: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		paddingHorizontal: 20,
		gap: 12,
		borderWidth: 0.8,
		borderColor: 'lightgray',
		borderRadius: 12,
		marginBottom: 20,
	},
});
