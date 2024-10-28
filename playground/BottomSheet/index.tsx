import React, { useState, useRef, useEffect } from 'react';
import {
	useWindowDimensions,
	View,
	BackHandler,
	LayoutChangeEvent,
	StyleProp,
	ViewStyle,
} from 'react-native';
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetModalProps,
} from '@gorhom/bottom-sheet';

interface Props extends Omit<BottomSheetModalProps, 'snapPoints'> {
	visible: boolean;
	onRequestClose: () => void;
	children: React.ReactNode;
	snapPoints?: Array<number | string>;
	backgroundStyle?: StyleProp<ViewStyle>;
	handleIndicatorStyle?: StyleProp<ViewStyle>;
}

export default function BottomSheet({
	visible,
	onRequestClose,
	children,
	snapPoints,
	backgroundStyle,
	handleIndicatorStyle,
	...modalProps
}: Props) {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [layoutHeight, setLayoutHeight] = useState(0);
	const [isLayoutCalculated, setIsLayoutCalculated] = useState(false);
	const window = useWindowDimensions();

	useEffect(() => {
		if (visible) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
			setIsLayoutCalculated(false);
		}

		const backAction = () => {
			if (visible) {
				onRequestClose();
				return true;
			}
			return false;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, [visible]);

	const handleLayout = (event: LayoutChangeEvent) => {
		if (snapPoints && snapPoints.length > 0) return;

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
			{isLayoutCalculated || (snapPoints && snapPoints.length > 0) ? (
				<BottomSheetModal
					ref={bottomSheetModalRef}
					snapPoints={snapPoints || [layoutHeight]}
					enablePanDownToClose
					onDismiss={onRequestClose}
					backdropComponent={(props) => (
						<BottomSheetBackdrop
							{...props}
							disappearsOnIndex={-1}
							appearsOnIndex={0}
						/>
					)}
					backgroundStyle={backgroundStyle}
					handleIndicatorStyle={handleIndicatorStyle}
					{...modalProps}
				>
					{children}
				</BottomSheetModal>
			) : (
				<View
					style={{ position: 'absolute', opacity: 0 }}
					onLayout={handleLayout}
				>
					{children}
				</View>
			)}
		</>
	);
}
