import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from 'react';
import { View, Animated, BackHandler, LayoutChangeEvent } from 'react-native';

type Props = {
	children?: ReactNode;
};

export type StepperHandler = {
	stepForward: () => void;
	stepBackward: () => void;
};

function Stepper({ children }: Props, ref: StepperHendler) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [stepWidth, setStepWidth] = useState('100%');
	const slideAnim = useRef(new Animated.Value(0)).current;
	const isLayoutMeasured = useRef(false);

	const handleBackPress = useCallback(() => {
		if (currentIndex > 0) {
			stepBackward();
			return true;
		}
		return false;
	}, [currentIndex]);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		};
	}, [handleBackPress]);

	useImperativeHandle(ref, () => ({
		stepForward,
		stepBackward,
	}));

	function stepForward() {
		if (currentIndex + 1 < childrenArray.length) {
			Animated.timing(slideAnim, {
				toValue: -stepWidth * (currentIndex + 1),
				duration: 100,
				useNativeDriver: true,
			}).start(() => {
				setCurrentIndex(currentIndex + 1);
			});
		}
	}

	function stepBackward() {
		if (currentIndex > 0) {
			Animated.timing(slideAnim, {
				toValue: -stepWidth * (currentIndex - 1),
				duration: 100,
				useNativeDriver: true,
			}).start(() => {
				setCurrentIndex(currentIndex - 1);
			});
		}
	}

	function onStepperLayout(event: LayoutChangeEvent) {
		if (!isLayoutMeasured.current) {
			const { width } = event.nativeEvent.layout;
			setStepWidth(width);
			isLayoutMeasured.current = true;
		}
	}

	const childrenArray = React.Children.toArray(children);

	return (
		<Animated.View
			style={{
				flex: 1,
				flexDirection: 'row',
				transform: [{ translateX: slideAnim }],
			}}
			onLayout={onStepperLayout}
		>
			{childrenArray.map((child, index) => (
				<View key={index} style={{ width: stepWidth }}>
					{child}
				</View>
			))}
		</Animated.View>
	);
}

export default forwardRef(Stepper);
