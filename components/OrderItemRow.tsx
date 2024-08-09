import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { useTheme, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEatery } from '../contexts/Eatery';
import { formatMonetaryValue } from '../utils';
import BottomSheet from './BottomSheet';
import { useNavigation } from '@react-navigation/native';

function formatPizzaOrderItem(pizzaOrderItem: OrderItem, isChef: boolean) {
	const { halfs, observation } = pizzaOrderItem;

	let result = '';

	if (halfs) {
		halfs.forEach((half) => {
			result += `  ● 1/2 ${half.flavor.name}`;
			if (!isChef) {
				const halfPrice = (half.flavor.price / 2).toFixed(2);
				result += ` • ${formatMonetaryValue(halfPrice)}`;
			}
			result += '\n';
			if (half.stuffedCrust) {
				result += `  ● Borda recheada: ${half.stuffedCrust.name}`;
				if (!isChef) {
					const stuffedCrustPrice = (half.stuffedCrust.price / 2).toFixed(2);
					result += ` • ${formatMonetaryValue(stuffedCrustPrice)}`;
				}
				result += '\n';
			}
		});

		if (halfs.length === 1) {
			result = `  ● ${halfs[0].flavor.name}`;
			if (!isChef) {
				result += ` • ${formatMonetaryValue(halfs[0].flavor.price)}`;
			}
			result += '\n';
			if (halfs[0].stuffedCrust) {
				result += `  ● Borda recheada: ${halfs[0].stuffedCrust.name}`;
				if (!isChef) {
					result += ` • ${formatMonetaryValue(halfs[0].stuffedCrust.price)}`;
				}
				result += '\n';
			}
		}

		if (
			halfs.length === 2 &&
			halfs[0].stuffedCrust &&
			halfs[1].stuffedCrust &&
			halfs[0].stuffedCrust.name === halfs[1].stuffedCrust.name
		) {
			result = `  ● 1/2 ${halfs[0].flavor.name}`;
			if (!isChef) {
				result += ` • ${formatMonetaryValue(halfs[0].flavor.price / 2)}`;
			}
			result += '\n';
			result += `  ● 1/2 ${halfs[1].flavor.name}`;
			if (!isChef) {
				result += ` • ${formatMonetaryValue(halfs[1].flavor.price / 2)}`;
			}
			result += '\n';
			result += `  ● Borda recheada: ${halfs[0].stuffedCrust.name}`;
			if (!isChef) {
				result += ` • ${formatMonetaryValue(halfs[0].stuffedCrust.price)}`;
			}
			result += '\n';
		}
	}

	result += `${observation ? `Observação: "${observation}"` : 'Sem observação'}`;

	return result;
}

function formatOrderItem(orderItem: OrderItem, isChef: boolean) {
	let extrasList = '';

	if (orderItem.extras && orderItem.extras.length > 0) {
		extrasList = orderItem.extras
			.map((extra) => {
				const extraDetail = `  ● ${extra.quantity}x ${extra.name.toLowerCase()}`;
				return isChef
					? extraDetail
					: `${extraDetail} • ${formatMonetaryValue(extra.price)}`;
			})
			.join('\n');
	} else {
		extrasList = 'Sem adicionais';
	}

	const observation = orderItem.observation
		? `"${orderItem.observation}"`
		: 'Sem observação';

	return `${orderItem.extras && orderItem.extras.length > 0 ? `Adicionais:\n` : ''}${extrasList}\n${orderItem.observation ? `Observação: ` : ''}${observation}`;
}

interface OrderItemRowProps extends OrderItem {
	onUpdate: (orderOtem: OrderItem) => void;
}

export default function OrderItemRow(props: OrderItemRowProps) {
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const { colors } = useTheme();
	const { selectedEatery } = useEatery();
	const navigation = useNavigation();
	const isPizza = props.halfs;
	const isChef = selectedEatery.memberRole === 'chef';
	const status = props.status;
	const menuItem = props.menuItem;
	const { onUpdate, ...orderItem } = props;

	function renderLeft() {
		const { menuItem } = props;

		if (menuItem?.pictureUri) {
			return (
				<Image
					style={{ height: '100%', width: '100%' }}
					source={{ uri: menuItem.pictureUri }}
				/>
			);
		}

		if (isPizza) {
			if (props.halfs.length === 2) {
				const [firstHalf, secondHalf] = props.halfs;
				const firstHalfUri = firstHalf.flavor.pictureUri;
				const secondHalfUri = secondHalf.flavor.pictureUri;

				if (firstHalfUri || secondHalfUri) {
					return (
						<View
							style={{
								flexDirection: 'row',
								width: '100%',
								height: '100%',
							}}
						>
							{firstHalfUri ? (
								<Image
									style={{ height: '100%', width: '50%' }}
									source={{ uri: firstHalfUri }}
								/>
							) : (
								<View
									style={{
										height: '100%',
										width: '50%',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<List.Icon color={colors.onSecondaryContainer} icon="pizza" />
								</View>
							)}
							{secondHalfUri ? (
								<Image
									style={{ height: '100%', width: '50%' }}
									source={{ uri: secondHalfUri }}
									resizeMode="cover"
								/>
							) : (
								<View
									style={{
										height: '100%',
										width: '50%',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<List.Icon color={colors.onSecondaryContainer} icon="pizza" />
								</View>
							)}
						</View>
					);
				}
			}

			return <List.Icon color={colors.onSecondaryContainer} icon="pizza" />;
		}

		return <List.Icon color={colors.onSecondaryContainer} icon="food" />;
	}

	function renderPrice() {
		if (selectedEatery.memberRole === 'chef') {
			return '';
		}

		if (isPizza) {
			const price = props.halfs.reduce((price, currentHalf) => {
				return (
					price +
					currentHalf.flavor.price / 2 +
					currentHalf.stuffedCrust.price / 2
				);
			}, 0);

			return `\n${formatMonetaryValue(price)}`;
		}

		const extraPrice =
			props.extras?.reduce((price, currentExtra) => {
				return price + currentExtra.price;
			}, 0) || 0;

		return `\n${formatMonetaryValue(
			props.menuItem.price * props.quantity + extraPrice
		)}`;
	}

	function renderRight() {
		if (['waiting', 'preparing'].includes(status)) {
			return (
				<MaterialCommunityIcons
					name="clock-time-three-outline"
					size={24}
					color={status === 'preparing' ? 'royalblue' : colors.onSurface}
				/>
			);
		}

		if (status === 'ready') {
			return (
				<MaterialCommunityIcons name="check" size={24} color="royalblue" />
			);
		}

		if (status === 'delivered') {
			return (
				<MaterialCommunityIcons name="check-all" size={24} color="royalblue" />
			);
		}
		return <></>;
	}

	function renderActions() {
		if (status === 'waiting') {
			if (selectedEatery.memberRole === 'manager') {
				return (
					<>
						<List.Item
							title="Preparar item"
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
								onUpdate({
									...orderItem,
									status: 'preparing',
								});
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
								navigation.navigate('UpdateOrderItem', {
									orderItem,
									onUpdate,
								});
								setIsBottomSheetVisible(false);
							}}
						/>
						<List.Item
							title="Remover item"
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
								onUpdate({
									...orderItem,
									status: 'removed',
								});
								setIsBottomSheetVisible(false);
							}}
						/>
					</>
				);
			}

			if (selectedEatery.memberRole === 'chef') {
				return (
					<List.Item
						title="Preparar item"
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
							onUpdate({
								...orderItem,
								status: 'preparing',
							});
							setIsBottomSheetVisible(false);
						}}
					/>
				);
			}

			if (selectedEatery.memberRole === 'waiter') {
				return (
					<>
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
								navigation.navigate('UpdateOrderItem', {
									orderItem,
									onUpdate,
								});
							}}
						/>
						<List.Item
							title="Remover item"
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
								onUpdate({
									...orderItem,
									status: 'removed',
								});
								setIsBottomSheetVisible(false);
							}}
						/>
					</>
				);
			}
		}

		if (status === 'preparing') {
			if (['manager', 'chef'].includes(selectedEatery.memberRole)) {
				return (
					<>
						<List.Item
							title="Finalizar preparo do item"
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
								onUpdate({
									...orderItem,
									status: 'ready',
								});
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
								onUpdate({
									...orderItem,
									status: 'waiting',
								});
								setIsBottomSheetVisible(false);
							}}
						/>
					</>
				);
			}
		}

		if (status === 'ready') {
			if (['manager', 'waiter'].includes(selectedEatery.memberRole)) {
				return (
					<>
						<List.Item
							title="Marcar item como entregue"
							onPress={() => {
								onUpdate({
									...orderItem,
									status: 'delivered',
								});
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
						{menuItem.availability !== 'readyToDelivery' ? (
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
									onUpdate({
										...orderItem,
										status: 'preparing',
									});
									setIsBottomSheetVisible(false);
								}}
							/>
						) : (
							<>
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
										navigation.navigate('UpdateOrderItem', {
											orderItem,
											onUpdate,
										});
										setIsBottomSheetVisible(false);
									}}
								/>
								<List.Item
									title="Remover item"
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
										onUpdate({
											...orderItem,
											status: 'removed',
										});
										setIsBottomSheetVisible(false);
									}}
								/>
							</>
						)}
					</>
				);
			}

			if (selectedEatery.memberRole === 'chef') {
				return menuItem.availability !== 'readyToDelivery' ? (
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
							onUpdate({
								...orderItem,
								status: 'preparing',
							});
							setIsBottomSheetVisible(false);
						}}
					/>
				) : (
					<></>
				);
			}
		}

		if (status === 'delivered') {
			if (['manager', 'waiter'].includes(selectedEatery.memberRole)) {
				return (
					<>
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
								onUpdate({
									...orderItem,
									status: 'ready',
								});
								setIsBottomSheetVisible(false);
							}}
						/>
					</>
				);
			}
		}
	}

	return (
		<>
			<List.Item
				style={{ paddingVertical: 0 }}
				left={() => (
					<View
						style={{
							width: 56,
							height: 56,
							borderRadius: 28,
							backgroundColor: colors.secondaryContainer,
							marginLeft: 12,
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					>
						{renderLeft()}
					</View>
				)}
				title={`${props.quantity}x ${props.menuItem.name}${renderPrice()}`}
				titleNumberOfLines={null}
				description={
					isPizza
						? formatPizzaOrderItem(props, isChef)
						: formatOrderItem(props, isChef)
				}
				descriptionNumberOfLines={null}
				right={renderRight}
				onPress={() => setIsBottomSheetVisible(true)}
			/>
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={() => setIsBottomSheetVisible(false)}
			>
				<List.Item
					style={{ paddingVertical: 0 }}
					left={() => (
						<View
							style={{
								width: 56,
								height: 56,
								borderRadius: 28,
								backgroundColor: colors.secondaryContainer,
								marginLeft: 12,
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
							}}
						>
							{renderLeft()}
						</View>
					)}
					title={`${props.quantity}x ${props.menuItem.name}${renderPrice()}`}
					titleNumberOfLines={null}
					description={
						isPizza
							? formatPizzaOrderItem(props, isChef)
							: formatOrderItem(props, isChef)
					}
					descriptionNumberOfLines={null}
					right={renderRight}
				/>
				<Divider style={{ marginBottom: 12 }} />
				{renderActions()}
			</BottomSheet>
		</>
	);
}
