import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/LoadingScreen';

interface AuthContextData {
	accessToken: string | null;
	saveAccessToken: (newToken: string) => Promise<void>;
	removeAccessToken: () => Promise<void>;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadAccessToken = async () => {
			const storedToken = await AsyncStorage.getItem('accessToken');
			if (storedToken) {
				setAccessToken(storedToken);
			}
			setIsLoading(false);
		};
		loadAccessToken();
	}, []);

	const saveAccessToken = async (newAccessToken: string) => {
		await AsyncStorage.setItem('accessToken', newAccessToken);
		setAccessToken(newAccessToken);
	};

	const removeAccessToken = async () => {
		await AsyncStorage.removeItem('accessToken');
		setAccessToken(null);
	};

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<AuthContext.Provider
			value={{
				accessToken,
				saveAccessToken,
				removeAccessToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextData => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export default AuthContext;
