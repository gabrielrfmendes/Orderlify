import React, {
	useState,
	useEffect,
	useMemo,
	useRef,
	useCallback,
} from 'react';
import AppBackground from '../../components/AppBackground';
import { BackHandler, View } from 'react-native';
import { FAB, Text, List } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import OrdersTab from './OrdersTab';
import { useEatery } from '../../contexts/Eatery';
import { getActiveOrders } from '../../services/order';
import BottomSheet from '../../components/BottomSheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TableSelectorModal from './TableSelectorModal';

const Tab = createMaterialTopTabNavigator();

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const [isTableSelectorModalVisible, setIsTableSelectorModalVisible] =
		useState(false);
	const { colors } = useTheme();
	const {
	  selectedEatery,
	  newOrder,
	  setNewOrder,
	  orders,
	  setOrders,
	} = useEatery();
	const navigation = useNavigation();

	useEffect(() => {
		async function listActiveOrders() {
			setIsLoading(true);
			const response = await getActiveOrders(selectedEatery.id);

			setOrders(response.data.orders);
			setIsLoading(false);
		}

		listActiveOrders();
	}, [selectedEatery]);

	return (
		<AppBackground>
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: {
						backgroundColor: colors.background,
					},
					tabBarLabelStyle: {
						fontSize: 12,
						width: 90,
						textAlign: 'center',
						fontWeight: 'bold',
						textTransform: 'none',
					},
					tabBarIndicatorStyle: {
						backgroundColor: colors.primary,
						height: 3,
						borderTopLeftRadius: 4,
						borderTopRightRadius: 4,
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
					},
					tabBarActiveTintColor: colors.primary,
					tabBarInactiveTintColor: colors.onSurface,
				}}
			>
				<Tab.Screen name="Confirmados">
					{(props) => (
						<OrdersTab
							isLoading={isLoading}
							orders={orders.filter(
								(order) =>
									order.status === 'waiting' || order.status === 'preparing'
							)}
							{...props}
						/>
					)}
				</Tab.Screen>
				<Tab.Screen name="Prontos">
					{(props) => (
						<OrdersTab
							isLoading={isLoading}
							orders={orders.filter((order) => order.status === 'ready')}
							{...props}
						/>
					)}
				</Tab.Screen>
				<Tab.Screen name="Entregues">
					{(props) => (
						<OrdersTab
							isLoading={isLoading}
							orders={orders.filter((order) => order.status === 'delivered')}
							{...props}
						/>
					)}
				</Tab.Screen>
			</Tab.Navigator>
			{selectedEatery.memberRole !== 'chef' ? (
				!newOrder ? (
					<FAB
						style={{
							position: 'absolute',
							bottom: 16,
							right: 16,
						}}
						icon="text-box-plus-outline"
						onPress={() => setIsBottomSheetVisible(true)}
					/>
				) : (
					<FAB
						icon="text-box-outline"
						label="Continuar pedido"
						extended
						style={{
							position: 'absolute',
							bottom: 16,
							right: 16,
						}}
						onPress={() => navigation.navigate('OrderForm')}
					/>
				)
			) : (
				<></>
			)}
			<TableSelectorModal
				visible={isTableSelectorModalVisible}
				onRequestClose={() => setIsTableSelectorModalVisible(false)}
				orders={orders}
				onSelectTable={(tableNumber) => {
					setNewOrder({
						tableNumber,
					});
					navigation.navigate('OrderForm');
				}}
			/>
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={() => setIsBottomSheetVisible(false)}
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
							color: colors.onSurface,
						}}
						left={(props) => (
							<List.Icon
								{...props}
								icon={(props) => (
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
							setIsBottomSheetVisible(false);
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
							bottomSheetModalRef.current.dismiss();
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
						onPress={() => navigation.navigate('OrderForm')}
					/>
				</View>
			</BottomSheet>
		</AppBackground>
	);
}
