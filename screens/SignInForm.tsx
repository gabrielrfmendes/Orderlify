import React, { useState } from 'react';
import { View } from 'react-native';
import AppBackground from '../components/AppBackground';
import TextField from '../components/TextField';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { authenticate } from '../services/auth';

export default function SignInFormScreen() {
  const [username, setUsername] = useState('');
  const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { saveAccessToken } = useAuth();

  function handleChangeUsername(text: string) {
    setUsername(text);
    setUsernameValidationMessage('');
  }

  function handleChangePassword(text: string) {
    setPassword(text);
    setPasswordValidationMessage('');
  }

  async function handleSignIn() {
    let invalidFields = 0;

    setIsLoading(true);

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
        const response = await authenticate({
          username,
          password,
        });

        console.log('test');

        saveAccessToken(response.data.accessToken);
      } catch(error) {
        if (error.response?.status === 404) {
          setUsernameValidationMessage('Usuário não encontrado');
        } else if (error.response?.status === 401) {
          setPasswordValidationMessage('Senha inválida');
        } else {
          Alert.alert(
            'Ops, sentimos muito por isso :(',
            'Estamos com problemas temporários com nossos servidores.'
          );
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
				  Entre com sua conta Orderlify
				</Text>
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
				  onPress={handleSignIn}
				  loading={isLoading}
				  style={{ marginBottom: 8 }}
				>
				  {isLoading ? '' : 'Entrar'}
				</Button>
				<Button onPress={() => navigation.navigate('SignUp')}>
          Não tenho um conta
        </Button>
			</View>
		</AppBackground>
	);
}
