import React from 'react';
import { View } from 'react-native';
import AppBackground from '../components/AppBackground';
import { Button } from 'react-native-paper';

const data = {
  username: 'joaosilva',
  password: 'senha123',
}

export default function SignUp() {
  function sign() {
    fetch('https://cardapio.host/api/usuarios.php/api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      console.log(response.json());
    }).then(data => {
    console.log(data); // Aqui você pode manipular os dados recebidos
  }).catch((error) => console.error(error));
  }
  
  return (
    <AppBackground>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Button onPress={sign}>
        Testar
      </Button>
      </View>
    </AppBackground>
  );
}
