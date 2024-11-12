import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import {
  Button,
  useTheme,
} from 'react-native-paper';
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  onAddToOrder: () => void;
}

export default function AddToOrderBottomSheet(props: Props) {
  const [quantity, setQuantity] = useState('1');
  const { colors } = useTheme();

  const handleChangeText = (input: string) => {
    setQuantity(input.replace(/[0-9]/g, ''));
  }
  
  return (
    <BottomSheet
      visible={props.visible}
      onRequestClose={() => {
        if (props.visible) {
          props.onRequestClose();
        }
      }}
    >
       <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ padding: 16 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <TouchableOpacity onPress={() => {
            setQuantity(String(Number(quantity) - 1));
          }}>
            <MaterialIcon
              name="remove-circle"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TextInput
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
            }}
            value={quantity}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            editable={false}
          />
          <TouchableOpacity onPress={() => {
            setQuantity(String(Number(quantity) + 1));
          }}>
            <MaterialIcon
              name="add-circle"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
        <Button mode="contained">
          Adicionar ao pedido
        </Button>
      </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}
