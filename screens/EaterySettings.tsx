import React from 'react';
import AppBackground from '../components/AppBackground';
import {
  List,
} from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
 useNavigation,
} from '@react-navigation/native'

export default function EaterySettingsScreen() {
  const navigation = useNavigation();
  
  return (
    <AppBackground>
      <List.Item
        title="Cardápio"
        description="Insira, atualize ou delete itens do cardápio."
        left={props => <MaterialIcons
          {...props}
          size={28}
          name="restaurant-menu"
        />}
        onPress={() => navigation.navigate('Menu')}
      />
    </AppBackground>
  );
}
