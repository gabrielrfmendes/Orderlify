import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

type AppBackgroundProps = {
	children?: React.ReactNode;
};

function AppBackground({ children }: AppBackgroundProps) {
	const { colors } = useTheme();
	const containerStyle = useMemo(
		() => [
			styles.container,
			{
				backgroundColor: colors.background,
			},
		],
		[colors.background]
	);

	return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default AppBackground;
