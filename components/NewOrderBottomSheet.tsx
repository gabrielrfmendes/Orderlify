import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Text,
  List,
  useTheme,
} from 'react-native-paper';
import BottomSheet from './BottomSheet';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEatery } from '../contexts/Eatery';
import TableSelectorModal from './TableSelectorModal';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
}

export default function NewOrderBottomSheet(props: Props) {
  const navigation = useNavigation();
  const [isTableSelectorModalVisible, setIsTableSelectorModalVisible] = useState(false);
  const { newOrder, setNewOrder, orders } = useEatery();
  const { colors } = useTheme();
  
  return (
    <>
      <BottomSheet
        visible={props.visible}
        onRequestClose={props.onRequestClose}
      >
        <View style={{ flex: 1 }}>
          <Text
            variant="titleMedium"
            style={{
              marginLeft: 16,
              color: colors.onSurface,
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Tipo do pedido
          </Text>
          <List.Item
            title="Mesa"
            titleStyle={{
              color: colors.onSurface,                                                    }}
            left={(props) => (                                                             <List.Icon
                {...props}                                                                    icon={(props) => (
                  <View
                    style={{
                      backgroundColor: 'crimson',
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons
                      name="table-bar"
                      {...props}
                      color={colors.surfaceVariant}
                    />
                  </View>
                )}
              />
            )}
            onPress={() => {
              props.onRequestClose();
              setIsTableSelectorModalVisible(true);
            }}
          />
          <List.Item
            title="Delivery"
            titleStyle={{
              color: colors.onSurface,
            }}
            left={(props) => (
              <List.Icon
                {...props}
                icon={(props) => (
                  <View
                    style={{
                      backgroundColor: '#EC407A',
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons
                      name="delivery-dining"
                      {...props}
                      color={colors.surfaceVariant}
                    />
                  </View>
                )}
              />
            )}
            onPress={() => {
              props.onRequestClose();
              navigation.navigate('OrderForm');
            }}
          />
          <List.Item
            title="Balcão"
            titleStyle={{
              color: colors.onSurface,
            }}
            left={(props) => (
              <List.Icon
                {...props}
                icon={(props) => (
                  <View
                    style={{
                      backgroundColor: '#BF59CF',
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons
                      name="local-bar"
                      {...props}
                      color={colors.surfaceVariant}
                    />
                  </View>
                )}
              />
            )}
            onPress={() => navigation.navigate('Order', {
              order: newOrder,
            })}
          />
        </View>
      </BottomSheet>
      <TableSelectorModal
        visible={isTableSelectorModalVisible}
        onRequestClose={() => setIsTableSelectorModalVisible(false)}
        orders={orders}
        onSelectTable={(tableNumber) => {
          setNewOrder({
            tableNumber,
          });
          navigation.navigate('Menu');
        }}
      />
    </>
  );
}
