import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, Text, Button } from 'react-native-paper';

function HomeScreen({ navigation }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Home Screen</Text>
			<Button
				title="Go to Details"
				mode="contained"
				onPress={() => navigation.navigate('Details')}
			>
				Go to Details
			</Button>
		</View>
	);
}

function DetailsScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Details Screen</Text>
		</View>
	);
}

const Stack = createNativeStackNavigator();

function App() {
	return (
		<PaperProvider>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen name="Details" component={DetailsScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	);
}

export default App;
