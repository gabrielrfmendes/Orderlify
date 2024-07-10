import React from 'react';
import AppBackground from '../../components/AppBackground';
import { useTheme, ActivityIndicator, Text, Divider } from 'react-native-paper';
import OrderListItem from './OrderListItem';
import { useWindowDimensions, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface Props {
	isLoading: boolean;
	orders: object[];
}

export default function OrdersTab(props: Props) {
	const { colors } = useTheme();
	const navigation = useNavigation();
	const window = useWindowDimensions();

	function renderItem({ item }) {
		return (
			<OrderListItem
				item={item}
				onPress={() => {
					navigation.navigate('Order', {
						order: item,
					});
				}}
			/>
		);
	}

	if (props.isLoading) {
		return (
			<AppBackground>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator />
				</View>
			</AppBackground>
		);
	}

	if (!props.orders.length) {
		return (
			<AppBackground>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						padding: 32,
					}}
				>
					<Text
						variant="bodyLarge"
						style={{
							color: colors.secondary,
							textAlign: 'center',
							alignItems: 'center',
						}}
					>
						Para criar um novo pedido, toque em{' '}
						<Icon name="text-box-plus-outline" size={20} /> no final da tela.
					</Text>
				</View>
			</AppBackground>
		);
	}

	return (
		<AppBackground>
			<FlatList
				data={props.orders}
				renderItem={renderItem}
				keyExtractor={(_, index) => index}
				ListFooterComponent={
					<>
						<Divider style={{ marginHorizontal: 16 }} />
						<Text
							variant="labelMedium"
							style={{
								height: window.height / 3,
								textAlign: 'center',
								color: colors.secondary,
								paddingVertical: 16,
							}}
						>
							Gerencie seus pedidos de forma simples e intuitiva!
						</Text>
					</>
				}
			/>
		</AppBackground>
	);
}
