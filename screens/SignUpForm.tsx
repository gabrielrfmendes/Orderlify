import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import AppBackground from '../components/AppBackground';
import TextField from '../components/TextField';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createAccount } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpFormScreen() {
  const [firstName, setFirstName] = useState('');
  const [firstNameValidationMessage, setFirstNameValidationMessage] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameValidationMessage, setLastNameValidationMessage] = useState('Opcional');
  const [username, setUsername] = useState('');
  const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation()
  const { saveAccessToken } = useAuth();

  function handleChangeFirstName(text: string) {
    setFirstName(text);
    setFirstNameValidationMessage('');
  }

  function handleChangeLastName(text: string) {
    setLastName(text);
    setLastNameValidationMessage('');
  }

  function handleChangeUsername(text: string) {
    setUsername(text);
    setUsernameValidationMessage('');
  }

  function handleChangePassword(text: string) {
    setPassword(text);
    setPasswordValidationMessage('');
  }

  async function handleCreateAccount() {
    let invalidFields = 0;

    setIsLoading(true);

    if (!firstName.length) {
      setFirstNameValidationMessage('O nome de usuário é necessário');
      invalidFields++;
    }

    if (!username.length) {
      setUsernameValidationMessage('O nome é necesário');
      invalidFields++;
    }

    if (!password.length) {
      setPasswordValidationMessage('A senha é necessária');
      invalidFields++;
    }

    if (invalidFields === 0) {
      try {
        const response = await createAccount({
          firstName,
          lastName,
          username,
          password,
        });

        saveAccessToken(response.data.accessToken);
      } catch(error) {
        if (error.response?.status === 409) {
          setUsernameValidationMessage('O nome de usuário já está em uso');
        } else {
          Alert.alert('Ops, sentimos muito por isso :(', 'Estamos com problemas temporários com nossos servidores.');
        }
      }
    }

    setIsLoading(false);
  }
  
	return (
		<AppBackground>
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					padding: 16,
				}}
			>
				<Text
				  variant="headlineSmall"
				  style={{ marginBottom: 32 }}
				>
				  Criar uma conta Orderlify
				</Text>
				  <TextField
				    label="Nome"
            placeholder="Nome"
            value={firstName}
            onChangeText={handleChangeFirstName}
            error={firstNameValidationMessage.length}
            validationMessage={firstNameValidationMessage}
          />
          <TextField
            label="Sobrenome"
            placeholder="Sobrenome"
            value={lastName}
            onChangeText={handleChangeLastName}
            validationMessage={lastNameValidationMessage}
          />
          <TextField
            label="Nome de usuário"
            placeholder="Nome de usuário"
            value={username}
            onChangeText={handleChangeUsername}
            error={usernameValidationMessage.length}
            validationMessage={usernameValidationMessage}
            autoCapitalize="none"
          />
          <TextField
            label="Senha"
            placeholder="Senha"
            value={password}
            onChangeText={handleChangePassword}
            error={passwordValidationMessage.length}
            validationMessage={passwordValidationMessage}
            secureTextEntry
            autoCapitalize="none"
          />
        <Button
				  mode="contained"
				  onPress={handleCreateAccount}
				  loading={isLoading}
				  style={{ marginBottom: 8 }}
				>
				  {isLoading ? '' : 'Criar conta'}
				</Button>
				<Button onPress={() => navigation.navigate('SignIn')}>
          Já tenho um conta
        </Button>
			</View>
		</AppBackground>
	);
}
