import React, { useState, useRef } from 'react';
import AppBackground from '../../components/AppBackground';
import Stepper, { StepperHandler } from '../../components/Stepper';
import BasicDataStep from './BasicDataStep';

export interface NewEateryStepProps {
	isFocused: boolean;
	stepForward: () => void;
	setpBackward: () => void;
}

export default function NewEatery() {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const stepperRef = useRef<StepperHandler>();

	function stepForward() {
		stepperRef.current?.stepForward();
		setCurrentStepIndex(currentStepIndex + 1);
	}

	function stepBackward() {
		stepperRef.current?.stepForward();
		setCurrentStepIndex(currentStepIndex - 1);
	}

	return (
		<AppBackground>
			<Stepper ref={stepperRef}>
				<BasicDataStep
					isFocused={currentStepIndex === 0}
					stepForward={stepForward}
					stepBackward={stepBackward}
				/>
			</Stepper>
		</AppBackground>
	);
}
