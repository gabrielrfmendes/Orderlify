import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, Text, Button } from 'react-native-paper';
import Auth from './screens/Auth';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import EateryListScreen from './screens/EateryList';
import { EateryProvider, useEatery } from './contexts/Eatery';
import CustomNavigationBar from './components/CustomNavigationBar';
import ModalBar from './components/ModalBar';
import NewEateryScreen from './screens/NewEatery';
import NewMenuItemScreen from './screens/NewMenuItem';

function HomeScreen() {
	const { removeAccessToken } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const { selectEatery } = useEatery();

	async function signOut() {
		setIsLoading(true);
		await removeAccessToken();
		selectEatery(null);
		setIsLoading(false);
	}

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Text>Home Screen</Text>
			<Button mode="contained" onPress={signOut} loading={isLoading}>
				{!isLoading ? 'SignOut' : ''}
			</Button>
		</View>
	);
}

const Stack = createNativeStackNavigator();

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
						<Stack.Group
							screenOptions={{
								presentation: 'modal',
								header: (props) => <ModalBar {...props} />,
								animation: 'slide_from_bottom',
							}}
						>
							<Stack.Screen
								name="NewEatery"
								component={NewEateryScreen}
								options={{ title: 'Novo estabelecimento' }}
							/>
							<Stack.Screen
								name="NewMenuItem"
								component={NewMenuItemScreen}
								options={{ title: 'Novo produto' }}
							/>
						</Stack.Group>
					</>
				) : (
					<Stack.Screen name="Home" component={HomeScreen} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

function App() {
	return (
		<PaperProvider>
			<AuthProvider>
				<ActionSheetProvider>
					<EateryProvider>
						<AppNavigator />
					</EateryProvider>
				</ActionSheetProvider>
			</AuthProvider>
		</PaperProvider>
	);
}

export default App;
