import React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

interface TextFieldProps extends TextInputProps {
	validationMessage?: string;
}

function TextField({ validationMessage, ...props }: TextFieldProps) {
	return (
		<View>
			<TextInput dense {...props} ref={props.reference} />
			<HelperText
				type="error"
				visible={!!props.error}
				style={{
					top: -4,
					marginBottom: -8,
				}}
			>
				{validationMessage}
			</HelperText>
		</View>
	);
}

export default TextField;
