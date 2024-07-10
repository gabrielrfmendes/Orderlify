import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, Appbar } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Auth from './screens/Auth';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import EateryListScreen from './screens/EateryList';
import { EateryProvider, useEatery } from './contexts/Eatery';
import CustomNavigationBar from './components/CustomNavigationBar';
import ModalBar from './components/ModalBar';
import EateryFormScreen from './screens/EateryForm';
import AddressFormScreen from './screens/AddressForm';
import OpeningHoursScreen from './screens/OpeningHours';
import MenuScreen from './screens/Menu';
import MenuItemFormScreen from './screens/MenuItemForm';
import MenuItemScreen from './screens/MenuItem';
import HomeScreen from './screens/Home';

const Stack = createNativeStackNavigator();

function HomeHeader() {
	const { selectedEatery } = useEatery();
	const navigation = useNavigation();

	return (
		<Appbar.Header>
			<Appbar.Content
				title={selectedEatery.name}
				onPress={() => navigation.navigate('Eateries')}
			/>
			<Appbar.Action
				icon="store-cog-outline"
				onPress={() => navigation.navigate('EaterySettings')}
			/>
		</Appbar.Header>
	);
}

function AppNavigator() {
	const { accessToken } = useAuth();
	const { selectedEatery } = useEatery();

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					header: (props) => <CustomNavigationBar {...props} />,
					animation: 'slide_from_right',
				}}
			>
				{!accessToken ? (
					<Stack.Screen
						name="Auth"
						component={Auth}
						options={{ headerShown: false }}
					/>
				) : !selectedEatery ? (
					<>
						<Stack.Screen
							name="SelectEatery"
							component={EateryListScreen}
							options={{ title: 'Selecionar estabelecimento' }}
						/>
						<Stack.Screen
							name="NewEatery"
							component={EateryFormScreen}
							options={{ title: 'Novo estabelecimento' }}
						/>
						<Stack.Screen
							name="AddressForm"
							component={AddressFormScreen}
							options={{ title: 'Endereço' }}
						/>
						<Stack.Screen
							name="OpeningHours"
							component={OpeningHoursScreen}
							options={{ title: 'Horários de funcionamento' }}
						/>
					</>
				) : (
					<>
						<Stack.Screen
							name="Home"
							component={HomeScreen}
							options={{
								header: () => <HomeHeader />,
							}}
						/>
						<Stack.Screen
							name="Eateries"
							component={EateryListScreen}
							options={{ title: 'Selecionar estabelecimento' }}
						/>
						<Stack.Screen
							name="NewEatery"
							component={EateryFormScreen}
							options={{ title: 'Novo estabelecimento' }}
						/>
						<Stack.Screen
							name="AddressForm"
							component={AddressFormScreen}
							options={{ title: 'Endereço' }}
						/>
						<Stack.Screen
							name="OpeningHours"
							component={OpeningHoursScreen}
							options={{ title: 'Horários de funcionamento' }}
						/>
						<Stack.Screen
							name="Menu"
							component={MenuScreen}
							options={{ title: 'Menu' }}
						/>
						<Stack.Screen
							name="MenuItemForm"
							component={MenuItemFormScreen}
							options={{ title: 'Novo produto' }}
						/>
						<Stack.Group
							screenOptions={{
								presentation: 'modal',
								header: (props) => <ModalBar {...props} />,
								animation: 'slide_from_bottom',
							}}
						>
							<Stack.Screen
								name="MenuItem"
								component={MenuItemScreen}
								options={{ headerShown: false }}
							/>
						</Stack.Group>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<PaperProvider>
					<AuthProvider>
						<ActionSheetProvider>
							<EateryProvider>
								<AppNavigator />
							</EateryProvider>
						</ActionSheetProvider>
					</AuthProvider>
				</PaperProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}

export default App;
