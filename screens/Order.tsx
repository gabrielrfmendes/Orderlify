import React, { useState, useEffect, useLayoutEffect } from 'react';
import AppBackground from '../components/AppBackground';
import { useWindowDimensions, View, ScrollView } from 'react-native';
import {
	useTheme,
	Text,
	List,
	Divider,
	Appbar,
	Button,
} from 'react-native-paper';
import { formatMonetaryValue } from '../utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEatery } from '../contexts/Eatery';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { translateStatus } from '../utils';
import OrderItemRow from '../components/OrderItemRow';
import BottomSheet from '../components/BottomSheet';

const statusOrder = ['waiting', 'preparing', 'ready', 'delivered', 'finished'];

function determineOrderStatus(items: OrderItem[]) {
	let highestStatusIndex = -1;
	let lowestStatusIndex = statusOrder.length;

	if (!items.length) {
		return 'empty';
	}

	items.forEach((item) => {
		const statusIndex = statusOrder.indexOf(item.status);

		if (statusIndex > highestStatusIndex) {
			highestStatusIndex = statusIndex;
		}

		if (statusIndex < lowestStatusIndex) {
			lowestStatusIndex = statusIndex;
		}
	});

	const allItemsSameStatus = items.every((item) => {
		return item.status === statusOrder[highestStatusIndex];
	});

	if (allItemsSameStatus) {
		return statusOrder[highestStatusIndex];
	} else {
		return statusOrder[lowestStatusIndex] === 'waiting'
			? 'waiting'
			: statusOrder[highestStatusIndex - 1] || 'waiting';
	}
}

function calculateTotal(orderItems: OrderItem[]) {
	let total = 0;

	if (!orderItems) {
		return total;
	}

	orderItems.forEach((item) => {
		if (item?.halfs) {
			item.halfs.forEach((half) => {
				total = total + (half.flavor.price / 2) * item.quantity;

				if (half.stuffedCrust) {
					total = total + (half.stuffedCrust.price / 2) * item.quantity;
				}
			});
		} else {
			total = total + item.menuItem.price * item.quantity;
		}

		if (item?.extras) {
			item.extras.forEach((extra) => {
				total = total + extra.price * extra.quantity * item.quantity;
			});
		}
	});

	return total;
}

export default function OrderScreen() {
	const { selectedEatery, newOrder } = useEatery();
	const [isLoading] = useState();
	const [order, setOrder] = useState(null);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const { colors } = useTheme();
	const window = useWindowDimensions();
	const navigation = useNavigation();
	const route = useRoute();

	useEffect(() => {
		setOrder(route.params.order);
	}, []);

	useEffect(() => {
		if (order) {
			const updatedStatus = determineOrderStatus(order?.items);

			if (order?.status !== updatedStatus) {
				setOrder((prevOrder) => ({
					...prevOrder,
					status: updatedStatus,
				}));
			}
		}
	}, [order]);

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					<Appbar.BackAction onPress={() => navigation.goBack()} />
					<Appbar.Content
						title={route.params?.order ? 'Pedido' : 'Novo pedido'}
					/>
					<Button
						labelStyle={{ fontWeight: 'bold' }}
						onPress={() => {
							navigation.navigate('OrderDatails', {
								order: route.params?.order ? route.params.order : newOrder,
							});
						}}
					>
						Detalhes
					</Button>
				</Appbar.Header>
			),
		});
	}, [navigation]);

	function renderActions() {
		if (order?.status === 'waiting') {
			if (selectedEatery.memberRole === 'manager') {
				return (
					<>
						<List.Item
							title="Preparar pedido"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialIcons
												name="access-time"
												{...props}
												color="royalblue"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								const updatedOrder = {
									...order,
									items: order.items.map((item) => {
										if (item.status === 'waiting') {
											return {
												...item,
												status: 'preparing',
											};
										}

										return item;
									}),
								};

								setOrder(updatedOrder);
								setIsBottomSheetVisible(false);
							}}
						/>
						<List.Item
							title="Editar item"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialIcons
												name="mode-edit-outline"
												{...props}
												color="royalblue"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								navigation.navigate('UpdateOrder', {
									order,
									onUpdate: setOrder,
								});
								setIsBottomSheetVisible(false);
							}}
						/>
						<List.Item
							title="Cancelar pedido"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialIcons
												name="remove-circle-outline"
												{...props}
												color="red"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								navigation.goBack();
							}}
						/>
					</>
				);
			}

			if (selectedEatery.memberRole === 'chef') {
				return (
					<List.Item
						title="Preparar pedido"
						titleStyle={{
							color: colors.onSurface,
						}}
						left={(props) => (
							<List.Icon
								{...props}
								icon={(props) => (
									<View
										style={{
											height: 40,
											width: 40,
											borderRadius: 20,
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<MaterialCommunityIcons
											name="clock-time-five-outline"
											{...props}
											color="royalblue"
										/>
									</View>
								)}
							/>
						)}
						onPress={() => {
							const updatedOrder = {
								...order,
								items: order.items.map((item) => {
									if (item.status === 'waiting') {
										return {
											...item,
											status: 'preparing',
										};
									}

									return item;
								}),
							};

							setOrder(updatedOrder);
							setIsBottomSheetVisible(false);
						}}
					/>
				);
			}

			if (selectedEatery.memberRole === 'waiter') {
				return (
					<>
						<List.Item
							title="Editar pedido"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialIcons
												name="mode-edit-outline"
												{...props}
												color="royalblue"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								navigation.navigate('UpdateOrder', {
									order,
									onUpdate: setOrder,
								});
							}}
						/>
						<List.Item
							title="Cancelar pedido"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialIcons
												name="remove-circle-outline"
												{...props}
												color="red"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								navigation.goBack();
							}}
						/>
					</>
				);
			}
		}

		if (order?.status === 'preparing') {
			if (['manager', 'chef'].includes(selectedEatery.memberRole)) {
				return (
					<>
						<List.Item
							title="Finalizar preparo"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialIcons
												name="check"
												{...props}
												color="royalblue"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								const updatedOrder = {
									...order,
									items: order.items.map((item) => {
										if (item.status === 'preparing') {
											return {
												...item,
												status: 'ready',
											};
										}

										return item;
									}),
								};

								setOrder(updatedOrder);
								setIsBottomSheetVisible(false);
							}}
						/>
						<List.Item
							title="Cancelar preparação"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialCommunityIcons
												name="undo-variant"
												{...props}
												color="red"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								const updatedOrder = {
									...order,
									items: order.items.map((item) => {
										if (item.status === 'preparing') {
											return {
												...item,
												status: 'waiting',
											};
										}

										return item;
									}),
								};

								setOrder(updatedOrder);
								setIsBottomSheetVisible(false);
							}}
						/>
					</>
				);
			}
		}

		if (order?.status === 'ready') {
			if (['manager', 'waiter'].includes(selectedEatery.memberRole)) {
				return (
					<>
						<List.Item
							title="Marcar item como entregue"
							onPress={() => {
								const updatedOrder = {
									...order,
									items: order.items.map((item) => {
										if (item.status === 'ready') {
											return {
												...item,
												status: 'delivered',
											};

											return item;
										}
									}),
								};

								setOrder(updatedOrder);
								setIsBottomSheetVisible(false);
							}}
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialCommunityIcons
												name="check-all"
												{...props}
												color="royalblue"
											/>
										</View>
									)}
								/>
							)}
						/>
						<List.Item
							title="Desfazer preparo"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialCommunityIcons
												name="undo-variant"
												{...props}
												color="red"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								const updatedOrder = {
									...order,
									items: order.items.map((item) => {
										if (item.status === 'ready') {
											if (item.menuItem.availability !== 'readyToDelivery') {
												return {
													...item,
													status: 'preparing',
												};
											}
										}

										return item;
									}),
								};

								setOrder(updatedOrder);
								setIsBottomSheetVisible(false);
							}}
						/>
					</>
				);
			}

			if (selectedEatery.memberRole === 'chef') {
				return (
					<List.Item
						title="Desfazer preparo"
						titleStyle={{
							color: colors.onSurface,
						}}
						left={(props) => (
							<List.Icon
								{...props}
								icon={(props) => (
									<View
										style={{
											height: 40,
											width: 40,
											borderRadius: 20,
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<MaterialCommunityIcons
											name="undo-variant"
											{...props}
											color="red"
										/>
									</View>
								)}
							/>
						)}
						onPress={() => {
							const updatedOrder = {
								...order,
								items: order.items.map((item) => {
									if (item.status === 'ready') {
										if (item.menuItem.availability !== 'readyToDelivery') {
											return {
												...item,
												status: 'preparing',
											};
										}
									}

									return item;
								}),
							};

							setOrder(updatedOrder);
							setIsBottomSheetVisible(false);
						}}
					/>
				);
			}
		}

		if (order?.status === 'delivered') {
			if (['manager', 'waiter'].includes(selectedEatery.memberRole)) {
				return (
					<>
						<List.Item
							title="Adicionar pagamento"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialIcons
												name="attach-money"
												{...props}
												color="green"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								navigation.navigate('AddPayment', {
									order,
								});
							}}
						/>
						<List.Item
							title="Desfazer entrega"
							titleStyle={{
								color: colors.onSurface,
							}}
							left={(props) => (
								<List.Icon
									{...props}
									icon={(props) => (
										<View
											style={{
												height: 40,
												width: 40,
												borderRadius: 20,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<MaterialCommunityIcons
												name="undo-variant"
												{...props}
												color="red"
											/>
										</View>
									)}
								/>
							)}
							onPress={() => {
								const updatedOrder = {
									...order,
									items: order.items.map((item) => {
										if (item.status === 'delivered') {
											return {
												...item,
												status: 'ready',
											};
										}

										return item;
									}),
								};

								setOrder(updatedOrder);
								setIsBottomSheetVisible(false);
							}}
						/>
					</>
				);
			}
		}
	}

	return (
		<AppBackground>
			<ScrollView contentContainerStyle={{ flex: 1 }}>
				{order?.items.length === 0 ? (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							padding: 32,
						}}
					>
						<Text
							variant="titleLarge"
							style={{
								color: colors.secondary,
								textAlign: 'center',
								alignItems: 'center',
							}}
						>
							Pedido vazio
						</Text>
						<Text
							variant="bodyLarge"
							style={{
								color: colors.secondary,
								textAlign: 'center',
								alignItems: 'center',
							}}
						>
							Para adicionar um novo item ao pedido, toque em{' '}
							<MaterialCommunityIcons name="hamburger-plus" size={20} /> no
							final da tela.
						</Text>
					</View>
				) : (
					<>
						{order?.items
							.map((orderItem, index) => {
								if (
									selectedEatery.memberRole === 'chef' &&
									orderItem.menuItem.availability === 'readyToDelivery'
								) {
									return null;
								}

								return (
									<React.Fragment key={index}>
										{order?.items.length > index && index !== 0 ? (
											<Divider
												style={{
													marginLeft: 80,
													marginRight: 16,
												}}
											/>
										) : (
											<></>
										)}
										<OrderItemRow
											{...orderItem}
											onUpdate={async (updatedOrderItem: OrderItem) => {
												const updatedOrder = {
													...order,
													items: order?.items
														.map((orderItem) => {
															if (orderItem.id === updatedOrderItem.id) {
																if (updatedOrderItem.status === 'removed') {
																	return null;
																}

																return updatedOrderItem;
															}

															return orderItem;
														})
														.filter((orderItem) => orderItem !== null),
												};

												setOrder(updatedOrder);
											}}
										/>
									</React.Fragment>
								);
							})
							.filter((orderItem) => orderItem !== null)}
						<Divider
							style={{
								marginHorizontal: 16,
								marginTop: 8,
							}}
						/>
						<Text
							variant="labelMedium"
							style={{
								height: window.height / 3,
								textAlign: 'center',
								color: colors.secondary,
								paddingVertical: 8,
							}}
						>
							Gostaria de relatar um problema ou fazer uma sugestão de melhoria?
							Agite seu telefone.
						</Text>
					</>
				)}
			</ScrollView>
			<View
				style={{
					position: 'absolute',
					bottom: 16,
					left: 16,
					right: 16,
					backgroundColor: colors.primaryContainer,
					height: 72,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingHorizontal: 16,
					borderRadius: 16,
					shadowColor: '#000',
					shadowOffset: { width: 1, height: 1 },
					shadowOpacity: 0.5,
					shadowRadius: 2,
					elevation: 5,
				}}
			>
				<View>
					<Text variant="labelLarge">Total</Text>
					<Text variant="titleLarge">
						{formatMonetaryValue(calculateTotal(order?.items))}
					</Text>
				</View>
				<Button
					mode="contained"
					onPress={() => setIsBottomSheetVisible(true)}
					loading={isLoading}
					disabled={isLoading}
					icon={
						['preparing'].includes(order?.status)
							? 'clock-time-five-outline'
							: order?.status === 'ready'
								? 'check'
								: order?.status === 'delivered'
									? 'check-all'
									: 'clock-time-three-outline'
					}
				>
					{isLoading ? '' : order?.status ? translateStatus(order.status) : ''}
				</Button>
			</View>
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={() => setIsBottomSheetVisible(false)}
			>
				<List.Item
					style={{ paddimgVertical: 0 }}
					title={order?.status ? translateStatus(order.status) : ''}
					titleStyle={{
						color: colors.onSurface,
					}}
					left={(props) => (
						<List.Icon
							{...props}
							icon={(props) => (
								<View
									style={{
										height: 40,
										width: 40,
										borderRadius: 20,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<MaterialCommunityIcons
										name={
											['preparing'].includes(order?.status)
												? 'clock-time-five-outline'
												: order?.status === 'ready'
													? 'check'
													: order?.status === 'delivered'
														? 'check-all'
														: 'clock-time-three-outline'
										}
										{...props}
										color={
											order?.status === 'waiting'
												? colors.onSurface
												: 'royalblue'
										}
									/>
								</View>
							)}
						/>
					)}
				/>
				<Divider />
				{renderActions()}
			</BottomSheet>
		</AppBackground>
	);
}
