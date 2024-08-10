import React, { createContext, useState, ReactNode } from 'react';
import Eatery from '../types';

interface EateryContextData {
	selectedEatery: Eatery | null;
	selectEatery: (eatery: Eatery | null) => void;
	newOrder: object;
}

interface EateryProviderProps {
	children: ReactNode;
}

const EateryContext = createContext<EateryContextData | undefined>(undefined);

export const EateryProvider: React.FC<EateryProviderProps> = ({ children }) => {
	const [selectedEatery, setSelectedEatery] = useState<Eatery | null>(null);
	const [newOrder, setNewOrder] = useState<object | null>(null);

	const selectEatery = (eatery: Eatery | null) => {
		setNewOrder(null);
		setSelectedEatery(eatery);
	};

	return (
		<EateryContext.Provider
			value={{
				selectedEatery,
				selectEatery,
				newOrder,
				setNewOrder,
			}}
		>
			{children}
		</EateryContext.Provider>
	);
};

export const useEatery = (): EateryContextData => {
	const context = React.useContext(EateryContext);
	if (!context) {
		throw new Error('useEatery must be used within an EateryProvider');
	}
	return context;
};

export default EateryContext;
