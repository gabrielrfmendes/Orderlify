import React, { useState, useEffect } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

function generateTintColor(timeRemaining: number) {
	const num = Math.min(Math.max(timeRemaining, 0), 100);
	let r, g, b;

	if (num <= 50) {
		r = 255;
		g = Math.round((num / 50) * 255);
		b = 0;
	} else {
		r = Math.round(((100 - num) / 50) * 255);
		g = 255;
		b = 0;
	}

	const hexR = r.toString(16).padStart(2, '0');
	const hexG = g.toString(16).padStart(2, '0');
	const hexB = b.toString(16).padStart(2, '0');

	const color = '#' + hexR + hexG + hexB;

	return color;
}

interface Props {
	timeRemaining: number;
}

export default function PreparationTimer({ timeRemaining }: Props) {
	const [tintColor, setTintColor] = useState(generateTintColor(100));

	useEffect(() => {
		const newTintColor = generateTintColor(timeRemaining);
		setTintColor(newTintColor);
	}, [timeRemaining]);

	return (
		<AnimatedCircularProgress
			size={48}
			width={24}
			tintColor={tintColor}
			fill={timeRemaining}
			backgroundColor={timeRemaining === 0 ? 'red' : 'rgba(0, 0, 0, 0.2)'}
			rotation={0}
		/>
	);
}
