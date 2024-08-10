import React, { useState, useRef, useEffect } from 'react';
import {
	useWindowDimensions,
	View,
	Text,
	StyleSheet,
	Button,
	BackHandler,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

interface Props {
	visible: boolean;
	onRequestClose: () => void;
	children: React.ReactNode;
}

export default function BottomSheet(props: Props) {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [layoutHeight, setLayoutHeight] = useState(0);
	const [isLayoutCalculated, setIsLayoutCalculated] = useState(false);
	const window = useWindowDimensions();
	const { colors } = useTheme();

	useEffect(() => {
		if (props.visible) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
			setIsLayoutCalculated(false);
		}

		const backAction = () => {
			if (props.visible) {
				props.onRequestClose();
				return true;
			}
			return false;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, [props.visible]);

	const handleLayout = (event) => {
		const { height } = event.nativeEvent.layout;

		if (height > window.height) {
			setLayoutHeight(window.height);
		} else {
			setLayoutHeight(height + 32);
		}

		setIsLayoutCalculated(true);
	};

	return (
		<>
			{isLayoutCalculated ? (
				<BottomSheetModal
					ref={bottomSheetModalRef}
					snapPoints={[layoutHeight]}
					enablePanDownToClose
					onDismiss={props.onRequestClose}
					backdropComponent={(props) => (
						<BottomSheetBackdrop
							{...props}
							disappearsOnIndex={-1}
							appearsOnIndex={0}
						/>
					)}
					backgroundStyle={{
						backgroundColor: colors.surface,
					}}
					handleIndicatorStyle={{
						backgroundColor: colors.onSurfaceVariant,
					}}
				>
					{props.children}
				</BottomSheetModal>
			) : (
				<View style={styles.hiddenContent} onLayout={handleLayout}>
					{props.children}
				</View>
			)}
		</>
	);
}

export function Test() {
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

	function handleOpenModal() {
		setIsBottomSheetVisible(true);
	}

	function handleCloseModal() {
		setIsBottomSheetVisible(false);
	}

	return (
		<View style={styles.container}>
			<Button title="Open Bottom Sheet" onPress={handleOpenModal} />
			<BottomSheet
				visible={isBottomSheetVisible}
				onRequestClose={handleCloseModal}
			>
				<Text>Awesome 🎉</Text>
				<Text>Awesome 🎉</Text>
				<Text>Awesome 🎉</Text>
				<Text>Awesome 🎉</Text>
			</BottomSheet>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	hiddenContent: {
		position: 'absolute',
		opacity: 0,
	},
});
