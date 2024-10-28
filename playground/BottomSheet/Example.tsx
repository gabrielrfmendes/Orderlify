import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import BottomSheet from './BottomSheet';

export default function Tests() {
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Button onPress={() => setIsBottomSheetVisible(true)}>
				Abrir bottom sheet
			</Button>
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={() => setIsBottomSheetVisible(false)}
				snapPoints={['50%']}
				backgroundStyle={{
					backgroundColor: 'red',
				}}
				handleIndicatorStyle={{
					backgroundColor: 'blue',
				}}
			>
				<Text>Hello</Text>
				<Text>Hello</Text>
				<Text>Hello</Text>
				<Text>Hello</Text>
				<Text>Hello</Text>
				<Text>Hello</Text>
			</BottomSheet>
		</View>
	);
}
