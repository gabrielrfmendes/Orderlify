import React, { useState, useEffect } from 'react';
import AppBackground from '../components/AppBackground';
import {
	useWindowDimensions,
	View,
	ScrollView,
	Image,
	Modal,
} from 'react-native';
import {
	useTheme,
	Text,
	List,
	FAB,
	Divider,
	ActivityIndicator,
} from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { getMenuItems, deleteMenuItem } from '../services/menu';
import { formatMonetaryValue } from '../utils';
import { useNavigation } from '@react-navigation/native';

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
	onUpdate: (menuItem: MenuItem) => void;
	onDelete: () => void;
}

function MenuListItem(props: MenuListItemProps) {
	const { colors } = useTheme();
	const navigation = useNavigation();

	return (
		<List.Item
			onPress={() =>
				navigation.navigate('MenuItem', {
					menuItem: props.menuItem,
					onUpdate: props.onUpdate,
					onDelete: props.onDelete,
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
	const [isDeleting, setIsDeleting] = useState(false);
	const { colors } = useTheme();
	const window = useWindowDimensions();
	const navigation = useNavigation();

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
			<Modal visible={isDeleting} transparent>
				<View
					style={{
						flex: 1,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator />
				</View>
			</Modal>
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
							<MenuListItem
								key={menuItem.id}
								menuItem={menuItem}
								onUpdate={(updates) => {
									setMenuItems(
										menuItems.map((item) => {
											if (item.id === menuItem.id) {
												return {
													...item,
													...updates,
												};
											}
											return item;
										})
									);
								}}
								onDelete={async () => {
									setIsDeleting(true);
									await deleteMenuItem({ id: menuItem.id });
									setIsDeleting(false);
									setMenuItems(
										menuItems.filter((item) => {
											if (item.id !== menuItem.id) {
												return item;
											}
											return;
										})
									);
								}}
							/>
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
				onPress={() =>
					navigation.navigate('MenuItemForm', {
						onSave: (data) => {
							setMenuItems([...menuItems, data]);
						},
					})
				}
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
