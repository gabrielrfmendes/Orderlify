import React, { useState } from 'react';
import {
	useWindowDimensions,
	ImageBackground,
	TouchableOpacity,
	View,
	Alert,
} from 'react-native';
import { useTheme, Text, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppBackground from '../components/AppBackground';
import { formatMonetaryValue } from '../utils';
import { useEatery } from '../contexts/Eatery';
import OrderListItem from '../components/OrderListItem';
import MenuListItem from '../components/MenuListItem';

export default function AddToOrderScreen() {
  const [isNewOrderBottomSheetVisible, setIsNewOrderBottomSheetVisible] = useState(false);
  const [isAddToOrderBottomSheetVisible, setIsAddToOrderBottomSheetVisible] = useState(false);
	const window = useWindowDimensions();
	const route = useRoute();
	const { colors } = useTheme();
	const navigation = useNavigation();
	const { newOrder, setNewOrder } = useEatery();

	function handleAddToOrder() {
	  setIsAddToOrderBottomSheetVisible(true);
	}

	function handleCreateOrder() {
	  setIsNewOrderBottomSheetVisible(true);
	}

	return (
		<AppBackground>
		  <OrderListItem
        item={route.params.order}
      />
      <MenuListItem
        menuItem={route.params.menuItem}
      />
		</AppBackground>
	);
}
