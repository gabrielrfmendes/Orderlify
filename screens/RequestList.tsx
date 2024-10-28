import React from 'react';
import {
	useWindowDimensions,
	View,
	ScrollView,
	StyleSheet,
} from 'react-native';
import {
	useTheme,
	ActivityIndicator,
	Divider,
	Text,
	List,
	Avatar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getRequests, confirmRequest, deleteRequest } from '../services/eatery';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AppBackground from '../components/AppBackground';
import BottomSheet from '../components/BottomSheet';
import { translateRole, getElapsedTime, isEateryOpen } from '../utils';

interface RequestListItemProps {
	item: Eatery;
	description?: string;
	onPress: () => void;
}

const RequestListItem: React.FC<RequestListItemProps> = (props) => {
	const theme = useTheme();

	return (
		<List.Item
			title={`${translateRole(props.item?.memberRole)} em ${props.item?.eatery?.name}`}
			description={`Solicitado por ${props.item?.requestedBy?.name} ${getElapsedTime(props.item?.requestedAt).toLowerCase()}`}
			descriptionStyle={{ fontWeight: 'bold' }}
			left={(leftProps) =>
				!props.item?.eatery.logoUri ? (
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
						source={{ uri: props.item?.eatery?.logoUri }}
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

export default function RequestListScreen() {
	const [requests, setRequests] = React.useState();
	const [selectedRequest, setSelectedRequest] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [snackbarMessageVisible, setIsSnackbarMessageVisible] =
		React.useState(false);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);
	const theme = useTheme();
	const window = useWindowDimensions();
	const navigation = useNavigation();

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

	function handlePresentRequestOptions(request) {
		setSelectedRequest(request);
		setIsBottomSheetVisible(true);
	}

	return (
		<AppBackground style={styles.container}>
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
							Suas solicitações para ingresso a equipes de outros
							estabelecimentos aparecerão aqui.
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
							onPress={() => handlePresentRequestOptions(item)}
						/>
					))}
				</ScrollView>
			)}
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={() => setIsBottomSheetVisible(false)}
			>
				<RequestListItem item={selectedRequest} />
				<Divider />
				<List.Item
					title="Aceitar solicitação"
					titleStyle={{
						color: theme.colors.onSurface,
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
									<Icon name="store-check-outline" {...props} color="green" />
								</View>
							)}
						/>
					)}
					onPress={async () => {
						setIsBottomSheetVisible(false);
						setIsLoading(true);
						const response = await confirmRequest(selectedRequest.id);
						setRequests(
							requests.filter(
								(prevRequest) => prevRequest.id !== selectedRequest.id
							)
						);
						/*setEateries((prevEateries) => {
            return [response.data.eatery, ...prevEateries];
          });*/
						setIsLoading(false);
					}}
				/>
				<List.Item
					title="Excluir solicitação"
					titleStyle={{
						color: theme.colors.onSurface,
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
									<Icon name="close-outline" {...props} color="red" />
								</View>
							)}
						/>
					)}
					onPress={async () => {
						setIsBottomSheetVisible(false);
						setIsLoading(true);
						try {
							await deleteRequest(selectedRequest.id);
							setRequests(
								requests.filter(
									(prevRequest) => prevRequest.id !== selectedRequest.id
								)
							);
							setIsLoading(false);
						} catch (error) {
							setIsLoading(false);
							throw Error(error);
						}
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
