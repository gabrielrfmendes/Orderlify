import React, { useState } from 'react';
import AppBackground from '../components/AppBackground';
import { TextInput } from 'react-native';
import { useTheme, FAB, List, Text } from 'react-native-paper';
import BottomSheet from '../components/BottomSheet';
import { useNavigation } from '@react-navigation/native';
import { useEatery } from '../contexts/Eatery';
import generateOrderBody from '../services/generateOrder';
import { formatPizzaOrderItem, formatOrderItem } from '../utils';

function generateOrder({
	orderBody,
	menuItems,
	extras,
	flavors,
	stuffedCrusts,
}: {
	orderBody: OrderItemBody[];
	menuItems: MenuItem[];
	extras: Extra[];
	flavors: Flavor[];
	stuffedCrusts: StuffedCrust[];
}): Order {
	const orderItems: OrderItem[] = orderBody.map((itemBody) => {
		let menuItem = menuItems.find(
			(menuItem) => menuItem.id === itemBody.menuItemId
		);
		if (!menuItem) {
			menuItem = {
				id: itemBody.menuItemId,
				name: itemBody.menuItemId,
				price: 0,
				availability: 'preparationRequired',
				status: 'available',
			};
		}

		const orderItemExtras = itemBody.extras?.map((extra) => {
			const extraDetails = extras.find((e) => e.id === extra.extraId);

			if (extraDetails) {
				return {
					id: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
					name: extraDetails.name,
					price: extraDetails.price,
					quantity: extra.quantity,
				};
			}

			return {
				id: extra.extraId,
				name: extra.extraId,
				price: 0,
				quantity: extra.quantity,
			};
		});

		const orderItemHalfs = itemBody.halfs?.map((half) => {
			let flavor = flavors.find((f) => f.id === half.flavorId);
			let stuffedCrust = half.stuffedCrustId
				? stuffedCrusts.find((sc) => sc.id === half.stuffedCrustId)
				: undefined;

			if (!flavor) {
				flavor = {
					id: half.flavorId,
					name: half.flavorId,
					price: 0,
				};
			}

			if (!stuffedCrust) {
				stuffedCrust = {
					id: half.stuffedCrustId,
					name: half.stuffedCrustId,
					price: 0,
				};
			}

			return {
				flavor,
				stuffedCrust,
			};
		});

		return {
			id: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
			menuItem,
			extras: orderItemExtras,
			halfs: orderItemHalfs,
			quantity: itemBody.quantity,
			deliveredQuantity: 0,
			observation: itemBody.observation,
			status: menuItem.availability === 'readyToDelivery' ? 'ready' : 'waiting',
		};
	});

	return {
		items: orderItems,
	};
}

export default function OrderFormScreen() {
	const [order, setOrder] = useState(null);
	const [savedOrderText, setSavedOrderText] = useState('');
	const [orderText, setOrderText] = useState('');
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { colors } = useTheme();
	const { menuItems, extras, flavors, stuffedCrusts } = useEatery();
	const navigation = useNavigation();

	return (
		<AppBackground>
			<TextInput
				style={{
					flex: 1,
					padding: 20,
					textAlignVertical: 'top',
					fontSize: 20,
					color: colors.onSurface,
				}}
				value={orderText}
				onChangeText={(text) => {
					setOrderText(text);
				}}
				multiline
				placeholder="Escreva o pedido exatamente como faria com papel e caneta. Use abreviações, códigos e jargões; temos um modelo de inteligência artificial treinado especialmente para interpretá-los..."
				placeholderTextColor={colors.outline}
				autoFocus
			/>
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={() => setIsBottomSheetVisible(false)}
			>
				<Text
					variant="titleMedium"
					style={{
						marginLeft: 16,
						color: colors.onSurface,
						marginTop: 16,
						marginBottom: 8,
					}}
				>
					Escolha o tamanho da pizza
				</Text>
				<List.Item
					title="Grande"
					titleStyle={{
						color: colors.onSurface,
					}}
					onPress={() => {
						setIsBottomSheetVisible(false);
						setIsTableSelectorModalVisible(true);
					}}
				/>
				<List.Item
					title="Média"
					titleStyle={{
						color: colors.onSurface,
					}}
					onPress={() => {
						setIsBottomSheetVisible(false);
						setIsTableSelectorModalVisible(true);
					}}
				/>
				<List.Item
					title="Pequena"
					titleStyle={{
						color: colors.onSurface,
					}}
					onPress={() => {
						setIsBottomSheetVisible(false);
						setIsTableSelectorModalVisible(true);
					}}
				/>
			</BottomSheet>
			<FAB
				visible={orderText.length && orderText === savedOrderText}
				icon="auto-fix"
				label="Confirmar"
				style={{
					position: 'absolute',
					margin: 16,
					right: 0,
					bottom: 0,
				}}
				onPress={async () => {
					if (orderText.includes('[INSERIR TAMANHO]')) {
						return setIsBottomSheetVisible(true);
					}
					navigation.navigate('Order', {
						order,
					});
				}}
			/>
			<FAB
				visible={orderText !== savedOrderText}
				loading={isLoading}
				icon="auto-fix"
				label="Formatar"
				style={{
					position: 'absolute',
					margin: 16,
					right: 0,
					bottom: 0,
				}}
				onPress={async () => {
					setIsLoading(true);
					const data = await generateOrderBody({
						orderText,
						menuItems,
						extras,
						flavors,
						stuffedCrusts,
					});
					setIsLoading(false);

					if (data.ironicAnswer) {
						return alert(data.ironicAnswer);
					}

					if (data.orderBody) {
						const newOrder = generateOrder({
							orderBody: data.orderBody,
							menuItems,
							extras,
							flavors,
							stuffedCrusts,
						});

						setOrder(newOrder);
					}

					if (data.formatedPrompt) {
						setOrderText(data.formatedPrompt);
					}

					setSavedOrderText(data.formatedPrompt);
				}}
			/>
		</AppBackground>
	);
}
