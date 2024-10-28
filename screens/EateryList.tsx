import React from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	useWindowDimensions,
} from 'react-native';
import {
	List,
	Avatar,
	useTheme,
	Divider,
	FAB,
	Text,
	ActivityIndicator,
	Tooltip,
	Snackbar,
	Portal,
	Button,
} from 'react-native-paper';
import AppBackground from '../components/AppBackground';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {
	getEateries,
	getRequests,
	confirmRequest,
	deleteRequest,
} from '../services/eatery';
import {
	ActionSheetProvider,
	useActionSheet,
} from '@expo/react-native-action-sheet';
import BottomSheet from '../components/BottomSheet';
import { Eatery } from '../types';
import { useEatery } from '../contexts/Eatery';
import { useNavigation } from '@react-navigation/native';
import { translateRole, getElapsedTime, isEateryOpen } from '../utils';
import { useAuth } from '../contexts/AuthContext';

interface EateryListItemProps {
	item: Eatery;
	onPress: () => void;
}

const EateryListItem: React.FC<EateryListItemProps> = (props) => {
	const theme = useTheme();
	const isOpen = isEateryOpen(props.item);
	const { selectedEatery } = useEatery();

	return (
		<List.Item
			title={props.item.name}
			description={isOpen ? 'Aberto agora' : 'Fechado agora'}
			descriptionStyle={{
				fontWeight: 'bold',
				...(isOpen ? { color: 'green' } : null),
			}}
			left={(leftProps) =>
				!props.item.logoUri ? (
					<Avatar.Icon
						style={[
							leftProps.style,
							{ backgroundColor: theme.colors.surfaceVariant },
						]}
						icon="store-outline"
						size={48}
					/>
				) : (
					<Avatar.Image
						source={{ uri: props.item.logoUri }}
						style={[
							leftProps.style,
							{ backgroundColor: theme.colors.surfaceVariant },
						]}
						size={48}
					/>
				)
			}
			right={(rightProps) =>
				selectedEatery?.id === props.item.id ? (
					<List.Icon
						icon="check-circle"
						{...rightProps}
						color={theme.colors.primary}
					/>
				) : (
					<></>
				)
			}
			{...props}
		/>
	);
};

export default function EateryListScreen() {
	const [eateries, setEateries] = React.useState([]);
	const [totalRequests, setTotalRequests] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);
	const theme = useTheme();
	const window = useWindowDimensions();
	const { selectedEatery, selectEatery } = useEatery();
	const navigation = useNavigation();
	const { colors } = useTheme();
	const { removeAccessToken } = useAuth();

	React.useEffect(() => {
		const listEateries = async () => {
			try {
				const response = await getEateries();
				const requestsResponse = await getRequests();

				setTotalRequests(requestsResponse.data.total);

				if (response.data.eateries.length) {
					if (selectedEatery) {
						setEateries([
							selectedEatery,
							...response.data.eateries.filter(
								(eatery) => selectedEatery.id !== eatery.id
							),
						]);
					} else {
						setEateries(response.data.eateries);
					}
				}
				setIsLoading(false);
			} catch (error) {
				throw Error(error);
			}
		};
		listEateries();
	}, []);

	return (
		<AppBackground style={styles.container}>
			{isLoading || !eateries?.length ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						padding: 32,
					}}
				>
					{isLoading ? (
						<ActivityIndicator />
					) : !eateries?.length ? (
						<Text
							variant="bodyLarge"
							style={{
								color: theme.colors.secondary,
								textAlign: 'center',
								alignItems: 'center',
							}}
						>
							Para ingressar uma equipe ou criar um estabelecimento, toque em{' '}
							<Icon name="store-plus" size={20} /> no final da tela.
						</Text>
					) : (
						<></>
					)}
				</View>
			) : (
				<></>
			)}
			{eateries?.length ? (
				<ScrollView>
					<List.Item
						title={`Solicitações (${totalRequests})`}
						left={(leftProps) => (
							<Avatar.Icon
								style={[
									leftProps.style,
									{ backgroundColor: colors.surfaceVariant },
								]}
								icon="inbox"
								size={48}
							/>
						)}
						onPress={() => navigation.navigate('Requests')}
					/>
					<Divider />
					{eateries.map((item) => (
						<EateryListItem
							key={item.id}
							item={item}
							onPress={() => {
								selectEatery(item);
								navigation.navigate('Home');
							}}
						/>
					))}
					<Divider style={{ marginHorizontal: 16 }} />
					<Text
						variant="labelMedium"
						style={{
							height: window.height / 3,
							textAlign: 'center',
							color: theme.colors.secondary,
							paddingVertical: 16,
						}}
					>
						Crie e gerencie quantos estabelecimentos precisar. {'\n'}Sem
						limites!
					</Text>
					<List.Item
            title="Sign out"
            onPress={() => {
              removeAccessToken();
            }}
          />
				</ScrollView>
			) : (
				<></>
			)}
			<Tooltip title="Adicionar estabelecimento">
				<FAB
					icon="store-plus-outline"
					onPress={() => setIsBottomSheetVisible(true)}
					background={colors.primaryContainer}
					color={colors.onPrimaryContainer}
					style={styles.fabStyle}
				/>
			</Tooltip>
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={() => setIsBottomSheetVisible(false)}
			>
				<List.Item title="Adicionar estabelecimento" />
				<Divider />
				<List.Item
					left={(leftProps) => (
						<View
							style={{
								backgroundColor: '#EC407A',
								height: 40,
								width: 40,
								borderRadius: 20,
								alignItems: 'center',
								justifyContent: 'center',
								marginLeft: 12,
							}}
						>
							<Icon name="store-search-outline" color="#F5F5F5" size={20} />
						</View>
					)}
					title="Encontrar estabelecimentos"
					onPress={() => {
						setIsBottomSheetVisible(false);
						navigation.navigate('FindEateries');
					}}
				/>
				<List.Item
					left={(leftProps) => (
						<View
							style={{
								backgroundColor: '#BF59CF',
								height: 40,
								width: 40,
								borderRadius: 20,
								alignItems: 'center',
								justifyContent: 'center',
								marginLeft: 12,
							}}
						>
							<Icon name="store-plus-outline" color="#F5F5F5" size={20} />
						</View>
					)}
					title="Cadastrar estabelecimento"
					onPress={() => {
						setIsBottomSheetVisible(false);
						navigation.navigate('NewEatery');
					}}
				/>
			</BottomSheet>
		</AppBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
	},
	fabStyle: {
		bottom: 16,
		right: 16,
		position: 'absolute',
	},
	actionSheetIconContainer: {
		height: 40,
		width: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default EateryListScreen;
