import React, { useState, useEffect } from 'react';
import { List, Text } from 'react-native-paper';
import { View } from 'react-native';
import PreparationTimer from './PreparationTimer';
import { translateStatus, getElapsedTime } from '../utils';
import { useEatery } from '../contexts/Eatery';

interface Props {
	item: object;
}

function OrderListItem({ item, ...props }: Props) {
	const [preparationTimeRemaining, setPreparationTimeRemaining] = useState(100);
	const [elapsedTime, setElapsedTime] = useState(
		getElapsedTime(item.createdAt)
	);
	const { selectedEatery } = useEatery();

	useEffect(() => {
		updateStates();
		const interval = setInterval(updateStates, 60000);

		return () => clearInterval(interval);
	}, []);

	const getCreatorName = () => {
		if (selectedEatery.memberId === item.createdBy.id) {
			return 'você';
		}
		return item.createdBy.name;
	};

	function updateStates() {
		const preparationTimeTotal = selectedEatery.orderTimer * 60 * 1000;
		const now = Date.now();
		const timeDifference = now - item.createdAt;
		const updatedPreparationTimeRemaining = Math.max(
			0,
			(1 - timeDifference / preparationTimeTotal) * 100
		);

		setPreparationTimeRemaining(updatedPreparationTimeRemaining);
		setElapsedTime(getElapsedTime(item.createdAt));
	}

	return (
		<List.Item
			left={(props) => (
				<View {...props}>
					{item.status !== 'delivered' && item.status !== 'paid' ? (
						<PreparationTimer timeRemaining={preparationTimeRemaining} />
					) : (
						<View
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.2)',
								height: 48,
								width: 48,
								borderRadius: 28,
							}}
						/>
					)}
				</View>
			)}
			title={`Mesa ${item.tableNumber} - ${translateStatus(item.status)}`}
			description={`Criado por ${getCreatorName()} ${elapsedTime.toLowerCase()}`}
			right={(props) => (
				<View {...props}>
					{preparationTimeRemaining === 0 && item.status !== 'delivered' ? (
						<Text
							style={{
								fontSize: 12,
								fontWeight: '800',
								color: 'red',
							}}
							numberOfLines={1}
						>
							Atrasado
						</Text>
					) : (
						<></>
					)}
				</View>
			)}
			{...props}
		/>
	);
}

export default OrderListItem;
