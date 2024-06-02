import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, Text, Button } from 'react-native-paper';
import Auth from './screens/Auth';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function HomeScreen() {
	const { removeAccessToken } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	async function signOut() {
		setIsLoading(true);
		await removeAccessToken();
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

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{!accessToken ? (
					<Stack.Screen
						name="Auth"
						component={Auth}
						options={{ headerShown: false }}
					/>
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
					<AppNavigator />
				</ActionSheetProvider>
			</AuthProvider>
		</PaperProvider>
	);
}

export default App;
