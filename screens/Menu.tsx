import React, { useState, useEffect } from 'react';
import AppBackground from '../components/AppBackground';
import {
	useWindowDimensions,
	View,
	ScrollView,
	Image,
	ActivityIndicator,
} from 'react-native';
import { useTheme, Text, List, FAB, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { getMenuItems } from '../services/menu';
import { formatMonetaryValue } from '../utils';

interface MenuItem {
	id: number;
	name: string;
	price: number;
	pictureUri: string | null;
	ingredients: {
		id: number;
		name: string;
		quantity: number;
	}[];
}

interface MenuListItemProps {
	menuItem: MenuItem;
}

function MenuListItem(props: MenuListItemProps) {
	const { colors } = useTheme();

	return (
		<List.Item
			onPress={() =>
				navigation.navigate('MenuItem', {
					menuItem: props.menuItem,
				})
			}
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
		/>
	);
}

export default function MenuScreen() {
	const [isLoading, setIsLoading] = useState(true);
	const [menuItems, setMenuItems] = useState([]);
	const { colors } = useTheme();
	const window = useWindowDimensions();

	useEffect(() => {
		async function listMenuItems() {
			const response = await getMenuItems();

			setMenuItems(response.data.menuItems);
			setIsLoading(false);
		}

		listMenuItems();
	}, []);

	return (
		<AppBackground>
			<ScrollView contentContainerStyle={{ flex: 1 }}>
				{isLoading || menuItems.length === 0 ? (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							padding: 32,
						}}
					>
						{isLoading ? (
							<ActivityIndicator size={36} color={colors.primary} />
						) : menuItems.length === 0 ? (
							<>
								<Text
									variant="titleLarge"
									style={{
										color: colors.secondary,
										textAlign: 'center',
										alignItems: 'center',
									}}
								>
									Comece criando o seu menu
								</Text>
								<Text
									variant="bodyLarge"
									style={{
										color: colors.secondary,
										textAlign: 'center',
										alignItems: 'center',
									}}
								>
									Para adicionar um novo item, toque em{' '}
									<Icon name="hamburger-plus" size={20} /> no final da tela.
								</Text>
							</>
						) : (
							<></>
						)}
					</View>
				) : (
					<>
						{menuItems.map((menuItem) => (
							<MenuListItem key={menuItem.id} menuItem={menuItem} />
						))}
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
							Gerencie seu cardápio de forma simples e eficiente.
						</Text>
					</>
				)}
			</ScrollView>
			<FAB
				icon="hamburger-plus"
				onPress={() => navigation.navigate('MenuItemForm')}
				background={colors.primaryContainer}
				color={colors.onPrimaryContainer}
				style={{
					position: 'absolute',
					bottom: 16,
					right: 16,
				}}
			/>
		</AppBackground>
	);
}
