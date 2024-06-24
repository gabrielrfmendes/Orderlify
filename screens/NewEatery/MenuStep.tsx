import React, { useState, useEffect } from 'react';
import {
	useWindowDimensions,
	View,
	ScrollView,
	Image,
	ActivityIndicator,
} from 'react-native';
import { useTheme, Text, Button, List, FAB, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { NewEateryStepProps } from './';
import { MenuItem } from '../../types';
import { getMenuItems } from '../../services/menu';
import { formatMonetaryValue } from '../../utils';

interface MenuListItemProps {
	menuItem: MenuItem;
}

function MenuListItem(props: MenuListItemProps) {
	const { colors } = useTheme();

	return (
		<List.Item
			onPress={() => {}}
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
						marginLeft: 8,
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

export default function MenuStep(props: NewEateryStepProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [menuItems, setMenuItems] = useState([]);
	const window = useWindowDimensions();
	const { colors } = useTheme();

	useEffect(() => {
		async function listMenuItems() {
			const response = await getMenuItems();

			setMenuItems(response.data.menuItems);
			setIsLoading(false);
		}

		listMenuItems();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				width: window.width,
			}}
		>
			<ScrollView contentContainerStyle={{ flex: 1 }}>
				<Text
					style={{
						paddingLeft: 12,
					}}
					variant="labelLarge"
				>
					Cardápio
				</Text>
				{isLoading || !menuItems.length ? (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							padding: 32,
						}}
					>
						{isLoading ? (
							<ActivityIndicator size={36} color={colors.primary} />
						) : !menuItems.length ? (
							<Text
								variant="bodyLarge"
								style={{
									color: colors.secondary,
									textAlign: 'center',
									alignItems: 'center',
								}}
							>
								Para adicionar um novo item ao cardápio, toque em{' '}
								<Icon name="hamburger-plus" size={20} /> no final da tela.
							</Text>
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
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 16,
					marginTop: 8,
					marginBottom: 16,
				}}
			>
				<Button style={{ flex: 1 }} onPress={props.stepBackward}>
					Voltar
				</Button>
				<Button
					mode="contained"
					onPress={props.stepForward}
					loading={isLoading}
					style={{ flex: 1 }}
				>
					{isLoading ? '' : menuItems.length > 0 ? 'Continuar' : 'Pular'}
				</Button>
			</View>
			<FAB
				icon="hamburger-plus"
				onPress={() => navigation.navigate('CreateMenuItem')}
				background={colors.primaryContainer}
				color={colors.onPrimaryContainer}
				style={{
					position: 'absolute',
					bottom: 76,
					right: 16,
				}}
			/>
		</View>
	);
}
