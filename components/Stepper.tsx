import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from 'react';
import {
	View,
	Animated,
	BackHandler,
	LayoutChangeEvent,
	StyleSheet,
} from 'react-native';

type Props = {
	children?: ReactNode;
};

export type StepperHandler = {
	stepForward: () => void;
	stepBackward: () => void;
};

function Stepper({ children }: Props, ref: React.Ref<StepperHandler>) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [stepWidth, setStepWidth] = useState(0);
	const slideAnim = useRef(new Animated.Value(0)).current;

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
				toValue: -(currentIndex + 1) * stepWidth,
				duration: 300,
				useNativeDriver: true,
			}).start(() => {
				setCurrentIndex(currentIndex + 1);
				slideAnim.setValue(-(currentIndex + 1) * stepWidth);
			});
		}
	}

	function stepBackward() {
		if (currentIndex > 0) {
			Animated.timing(slideAnim, {
				toValue: -(currentIndex - 1) * stepWidth,
				duration: 300,
				useNativeDriver: true,
			}).start(() => {
				setCurrentIndex(currentIndex - 1);
				slideAnim.setValue(-(currentIndex - 1) * stepWidth);
			});
		}
	}

	function onStepperLayout(event: LayoutChangeEvent) {
		const { width } = event.nativeEvent.layout;
		setStepWidth(width);
	}

	const childrenArray = React.Children.toArray(children);

	return (
		<View style={styles.container} onLayout={onStepperLayout}>
			<Animated.View
				style={[
					styles.animatedContainer,
					{
						width: stepWidth * childrenArray.length,
						transform: [{ translateX: slideAnim }],
					},
				]}
			>
				{childrenArray.map((child, index) => (
					<View
						key={index}
						style={[styles.stepContainer, { width: stepWidth }]}
					>
						{child}
					</View>
				))}
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
	},
	animatedContainer: {
		flexDirection: 'row',
		flex: 1,
	},
	stepContainer: {
		flex: 1,
	},
});

export default forwardRef(Stepper);
