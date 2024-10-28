import React from 'react';
import { View } from 'react-native';
import {
  Text,
  Button,
} from 'react-native-paper';
import AppBackground from '../components/AppBackground';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  
  return (
    <AppBackground>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 16,
          gap: 8,
        }}
      >
        <Text variant="headlineSmall">
          Bem-vindo ao Orderlify
        </Text>
        <Text
          variant="titleMedium"
          style={{ marginBottom: 24 }}
        >
          Escolha uma opção
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignIn')}
        >
          Entrar
        </Button>
        <Button
          onPress={() => navigation.navigate('SignUp')}
        >
          Criar uma conta
        </Button>
      </View>
    </AppBackground>
  );
}
