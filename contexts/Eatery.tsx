import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Eatery from '../types';
import { getMenuItems } from '../services/menu';

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
	const [menuItems, setMenuItems] = useState([]);
	const [extras, setExtras] = useState([]);
	const [flavors, setFlavors] = useState([]);
	const [stuffedCrusts, setStuffedCrusts] = useState([]);
	const [newOrder, setNewOrder] = useState<object | null>(null);
	const [orders, setOrders] = useState([]);

	const selectEatery = (eatery: Eatery | null) => {
		setNewOrder(null);
		setSelectedEatery(eatery);
	};

	useEffect(() => {
		async function listMenuItems() {
			const response = await getMenuItems();

			setMenuItems(response.data.menuItems);
			setExtras(response.data.extras);
			setFlavors(response.data.flavors);
			setStuffedCrusts(response.data.stuffedCrusts);
		}

		if (selectedEatery) {
			listMenuItems();
		}
	}, [selectedEatery]);

	return (
		<EateryContext.Provider
			value={{
				selectedEatery,
				selectEatery,
				menuItems,
				extras,
				flavors,
				stuffedCrusts,
				newOrder,
				setNewOrder,
				orders,
				setOrders,
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
