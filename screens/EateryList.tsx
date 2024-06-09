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
import { Eatery } from '../types';
import { useEatery } from '../contexts/Eatery';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { translateRole, getElapsedTime, isEateryOpen } from '../utils';

const Tab = createMaterialTopTabNavigator();

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
						icon="store"
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

const EateriesTab: React.FC = ({ eateries, setEateries }) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const theme = useTheme();
	const window = useWindowDimensions();
	const { selectedEatery, selectEatery } = useEatery();
	const navigation = useNavigation();

	React.useEffect(() => {
		const listEateries = async () => {
			try {
				const response = await getEateries();

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
					{eateries.map((item) => (
						<EateryListItem
							key={item.id}
							item={item}
							onPress={() => {
								selectEatery(item);
								if (navigation.canGoBack()) {
									navigation.goBack();
								}
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
				</ScrollView>
			) : (
				<></>
			)}
		</AppBackground>
	);
};

interface RequestListItemProps {
	item: Eatery;
	description?: string;
	onPress: () => void;
}

const RequestListItem: React.FC<RequestListItemProps> = (props) => {
	const theme = useTheme();

	return (
		<List.Item
			title={`${translateRole(props.item.memberRole)} em ${props.item.eatery.name}`}
			description={`Solicitado por ${props.item.requestedBy.name} ${getElapsedTime(props.item.requestedAt).toLowerCase()}`}
			descriptionStyle={{ fontWeight: 'bold' }}
			left={(leftProps) =>
				!props.item.eatery.logoUri ? (
					<Avatar.Icon
						style={[
							leftProps.style,
							{ backgroundColor: theme.colors.surfaceVariant },
						]}
						icon="store"
						size={48}
					/>
				) : (
					<Avatar.Image
						source={{ uri: props.item.eatery.logoUri }}
						style={[
							leftProps.style,
							{ backgroundColor: theme.colors.surfaceVariant },
						]}
						size={48}
					/>
				)
			}
			{...props}
		/>
	);
};

const RequestsTab: React.FC = ({ requests, setRequests, setEateries }) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [snackbarMessageVisible, setIsSnackbarMessageVisible] =
		React.useState(false);
	const theme = useTheme();
	const window = useWindowDimensions();
	const navigation = useNavigation();
	const { showActionSheetWithOptions } = useActionSheet();

	React.useEffect(() => {
		const listRequests = async () => {
			try {
				const response = await getRequests();

				setRequests(response.data.requests);
				setIsLoading(false);
			} catch (error) {
				throw Error(error);
			}
		};
		listRequests();
	}, []);

	React.useEffect(() => {
		if (requests.length > 0) {
			navigation.setOptions({ title: 'Solicitações ●' });
		} else {
			navigation.setOptions({ title: 'Solicitações' });
		}
	}, [requests]);

	const showActionSheet = (request) => {
		const actionSheetOptions = ['Aceitar solicitação', 'Excluir'];
		const actionSheetOptionsIcons = [
			<View
				key="1"
				style={{
					backgroundColor: theme.colors.primaryContainer,
					...styles.actionSheetIconContainer,
				}}
			>
				<Icon
					name="store-check"
					color={theme.colors.onPrimaryContainer}
					size={20}
				/>
			</View>,
			<View
				key="2"
				style={{
					backgroundColor: theme.colors.errorContainer,
					...styles.actionSheetIconContainer,
				}}
			>
				<Icon name="close" color={theme.colors.onErrorContainer} size={20} />
			</View>,
		];

		showActionSheetWithOptions(
			{
				title: `${translateRole(request.memberRole)} em ${request.eatery.name}`,
				options: actionSheetOptions,
				icons: actionSheetOptionsIcons,
				cancelButtonIndex: 2,
				useModal: true,
			},
			async (buttonIndex) => {
				if (buttonIndex === 0) {
					setIsLoading(true);
					const response = await confirmRequest(request.id);
					setRequests(
						requests.filter((prevRequest) => prevRequest.id !== request.id)
					);
					setEateries((prevEateries) => {
						return [response.data.eatery, ...prevEateries];
					});
					setIsLoading(false);
				} else if (buttonIndex === 1) {
					setIsLoading(true);
					try {
						await deleteRequest(request.id);
						setRequests(
							requests.filter((prevRequest) => prevRequest.id !== request.id)
						);
						setIsSnackbarMessageVisible(true);
						setIsLoading(false);
					} catch (error) {
						setIsLoading(false);
						throw Error(error);
					}
				}
			}
		);
	};

	return (
		<AppBackground style={styles.container}>
			<Portal>
				<Snackbar
					visible={snackbarMessageVisible}
					onDismiss={() => setIsSnackbarMessageVisible(false)}
					duration={3500}
				>
					Solicitação escolhida.
				</Snackbar>
			</Portal>
			{isLoading || !requests?.length ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						padding: 32,
					}}
				>
					{isLoading ? (
						<ActivityIndicator />
					) : !requests?.length ? (
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
				<ScrollView>
					{requests.map((item) => (
						<RequestListItem
							key={item.id}
							item={item}
							onPress={() => showActionSheet(item)}
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
				</ScrollView>
			)}
		</AppBackground>
	);
};

const EateryListScreen: React.FC = () => {
	const { colors } = useTheme();
	const { showActionSheetWithOptions } = useActionSheet();
	const navigation = useNavigation();
	const [eateries, setEateries] = React.useState([]);
	const [requests, setRequests] = React.useState([]);

	const showActionSheet = () => {
		const actionSheetOptions = [
			'Encontrar estabelecimentos',
			'Criar estabelecimento',
		];
		const actionSheetOptionsIcons = [
			<View
				key="1"
				style={{
					backgroundColor: '#EC407A',
					...styles.actionSheetIconContainer,
				}}
			>
				<Icon name="store-search" color="#F5F5F5" size={20} />
			</View>,
			<View
				key="2"
				style={{
					backgroundColor: '#BF59CF',
					...styles.actionSheetIconContainer,
				}}
			>
				<Icon name="store-plus" color="#F5F5F5" size={20} />
			</View>,
		];

		showActionSheetWithOptions(
			{
				title: 'Adicionar estabelecimento',
				options: actionSheetOptions,
				icons: actionSheetOptionsIcons,
				cancelButtonIndex: 2,
				useModal: true,
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					navigation.navigate('FindEateries');
				} else if (buttonIndex === 1) {
					navigation.navigate('NewEatery');
				}
			}
		);
	};

	return (
		<ActionSheetProvider>
			<>
				<Tab.Navigator
					screenOptions={{
						tabBarStyle: {
							backgroundColor: colors.background,
						},
						tabBarLabelStyle: {
							fontWeight: '700',
							textTransform: 'none',
						},
						tabBarIndicatorStyle: {
							backgroundColor: colors.primary,
							height: 3,
							borderTopLeftRadius: 3,
							borderTopRightRadius: 3,
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
						},
						tabBarActiveTintColor: colors.primary,
						tabBarInactiveTintColor: colors.secondary,
					}}
				>
					<Tab.Screen
						name="EateriesTab"
						options={{ title: 'Estabelecimentos' }}
					>
						{() => (
							<EateriesTab eateries={eateries} setEateries={setEateries} />
						)}
					</Tab.Screen>
					<Tab.Screen name="RequestsTab" options={{ title: `Solicitações` }}>
						{() => (
							<RequestsTab
								requests={requests}
								setRequests={setRequests}
								setEateries={setEateries}
							/>
						)}
					</Tab.Screen>
				</Tab.Navigator>
				<Tooltip title="Adicionar estabelecimento">
					<FAB
						icon="store-plus"
						onPress={showActionSheet}
						background={colors.primaryContainer}
						color={colors.onPrimaryContainer}
						style={styles.fabStyle}
					/>
				</Tooltip>
			</>
		</ActionSheetProvider>
	);
};

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
