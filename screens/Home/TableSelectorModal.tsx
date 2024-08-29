import React, { useState, useEffect } from 'react';
import AppBackground from '../../components/AppBackground';
import {
	Modal,
	View,
	TouchableOpacity,
	Text,
	TextInput,
	Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useEatery } from '../contexts/Esatery';

interface Props {
	visible: boolean;
	onRequestClose: () => void;
	onSelectTable: (tableNumber: string) => void;
	orders: object;
}

function TableSelectorModal(props) {
	const confirmedOrders = props.orders.filter((order) =>
		['waiting', 'preparing'].includes(order.status)
	);
	const readyOrders = props.orders.filter((order) => order.status === 'ready');
	const deliveredOrders = props.orders.filter(
		(order) => order.status === 'delivered'
	);
	const [tableNumber, setTableNumber] = useState(props?.tableNumber || '');

	const selectTable = () => {
		const confirmedOrder = [
			...confirmedOrders,
			...readyOrders,
			...deliveredOrders,
		].find((order) => {
			if (order.tableNumber == tableNumber) {
				if (order.status !== 'paid') {
					return order;
				}
			}
		});

		if (!confirmedOrder) {
			props?.onSelectTable(tableNumber);
			props.onRequestClose();
		} else {
			Alert.alert(
				'Pedido já existente',
				'Há um pedido em aberto para esta mesa, deseja visualiza-lo?',
				[
					{
						text: 'Não',
						onPress: () => {},
						style: 'cancel',
					},
					{
						text: 'Sim, por favor',
						onPress: () => {
							alert('Ainda não implementado');
						},
					},
				]
			);
		}
	};

	return (
		<Modal
			animationType="slide"
			visible={props.visible}
			onRequestClose={props.onRequestClose}
		>
			<AppBackground>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						padding: 16,
						alignItems: 'center',
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: 700,
						}}
					>
						Informe o número da mesa
					</Text>
					<TouchableOpacity
						style={{
							backgroundColor: 'rgba(0, 0, 0, 0.6)',
							height: 36,
							width: 36,
							borderRadius: 18,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onPress={props.onRequestClose}
					>
						<Ionicons name="close" size={24} color="white" />
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1 }}>
					<TextInput
						style={{
							flex: 1,
							textAlign: 'center',
							fontSize: 28,
							fontWeight: 'bold',
						}}
						placeholder="Número da mesa"
						keyboardType="numeric"
						autoFocus
						text={tableNumber}
						onChangeText={(text) =>
							setTableNumber(text.replace(/[^0-9\s]/g, ''))
						}
					/>
				</View>
				<View style={{ padding: 16 }}>
					<Button
						disabled={!tableNumber.length}
						onPress={selectTable}
						mode="contained"
					>
						Selecionar mesa
					</Button>
				</View>
			</AppBackground>
		</Modal>
	);
}

export default TableSelectorModal;
