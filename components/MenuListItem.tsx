import React from 'react';
import { View, Image } from 'react-native';
import { useTheme, List, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MenuItem, OrderItem } from '../interfaces';
import { formatMonetaryValue } from '../utils';

function getTotalQuantity(orderDetails: OrderItem['details']) {
	let totalQuantity = 0;

	for (const detail of orderDetails) {
		totalQuantity += detail.quantity;
	}

	return totalQuantity;
}

interface MenuListItemProps {
	menuItem: MenuItem;
	orderDetails: OrderItem['details'];
	onUpdate: (menuItem: MenuItem) => void;
	onDelete: () => void;
}

export default function MenuListItem(props: MenuListItemProps) {
	const { colors } = useTheme();
	const navigation = useNavigation();

	return (
		<List.Item
			onPress={() => navigation.navigate('MenuItem', { ...props })}
			style={{ paddingVertical: 0 }}
			title={props.menuItem.name}
			titleStyle={{ fontWeight: 'bold' }}
			description={formatMonetaryValue(props.menuItem.price)}
			descriptionStyle={{
				fontWeight: 'bold',
				fontSize: 16,
			}}
			left={() => (
				<View
					style={{
						width: 96,
						height: 80,
						borderRadius: 12,
						backgroundColor: colors.secondaryContainer,
						marginLeft: 12,
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'hidden',
					}}
				>
					{props.menuItem.pictureUri ? (
						<Image
							style={{
								height: '100%',
								width: '100%',
							}}
							source={{
								uri: props.menuItem.pictureUri,
							}}
						/>
					) : (
						<List.Icon color={colors.onSecondaryContainer} icon="food" />
					)}
				</View>
			)}
			right={() => {
				if (props.orderDetails) {
					return (
						<Badge style={{ backgroundColor: colors.primary }}>
							{getTotalQuantity(props.orderDetails)}
						</Badge>
					);
				}

				return;
			}}
		/>
	);
}
