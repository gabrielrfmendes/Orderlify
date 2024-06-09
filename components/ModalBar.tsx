import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';

export default function ModalBar({ navigation, route, options, back }) {
	const title = getHeaderTitle(options, route.name);

	return (
		<Appbar.Header>
			<Appbar.Content title={title} />
			{back ? <Appbar.Action icon="close" onPress={navigation.goBack} /> : null}
		</Appbar.Header>
	);
}
