import React, {
	useState,
	useImperativeHandle,
	forwardRef,
	useEffect,
} from 'react';
import {
	View,
	StyleSheet,
	Modal,
	ActivityIndicator,
	Alert,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';

type Props = {
	selectedImage: ImagePicker.ImagePickerAsset;
	onImageSelected: (ImagePickerImagePickerAsset) => void;
	title?: string;
};

export type ImageSelectorHandler = {
	showOptions: () => void;
};

function ImageSelector(
	{ selectedImage, onImageSelected, title }: Props,
	ref: ImageSelectorHandler
) {
	const { showActionSheetWithOptions } = useActionSheet();
	const [loading, setLoading] = useState(false);
	const [hasPermission, setHasPermission] = useState(false);

	useImperativeHandle(ref, () => ({
		showOptions: showActionSheet,
	}));

	useEffect(() => {
		async function checkPermission() {
			const { status: galleryStatus } =
				await ImagePicker.getMediaLibraryPermissionsAsync();
			const { status: cameraStatus } =
				await ImagePicker.getCameraPermissionsAsync();
			setHasPermission(
				galleryStatus === 'granted' && cameraStatus === 'granted'
			);
		}
		checkPermission();
	}, []);

	const imagePickerOptions = {
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		aspect: [4, 4],
		quality: 1,
	};

	async function requestPermission() {
		const { status: galleryStatus } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		const { status: cameraStatus } =
			await ImagePicker.requestCameraPermissionsAsync();

		if (galleryStatus !== 'granted' || cameraStatus !== 'granted') {
			Alert.alert(
				'Permissão necessária',
				'Precisamos das permissões da galeria e câmera para fazer isso funcionar!'
			);
			return false;
		}

		setHasPermission(true);
		return true;
	}

	async function openCamera() {
		setLoading(true);
		try {
			const result = await ImagePicker.launchCameraAsync(imagePickerOptions);
			if (!result.canceled) {
				onImageSelected(result.assets[0]);
			}
		} catch (error) {
			Alert.alert('Erro', 'Não foi possível abrir a câmera. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}

	async function openGallery() {
		setLoading(true);
		try {
			const result =
				await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
			if (!result.canceled) {
				onImageSelected(result.assets[0]);
			}
		} catch (error) {
			Alert.alert('Erro', 'Não foi possível abrir a galeria. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}

	async function showActionSheet() {
		if (!hasPermission) {
			const permissionGranted = await requestPermission();
			if (!permissionGranted) {
				return;
			}
		}

		const actionSheetOptions = ['Câmera', 'Galeria'];
		const actionSheetOptionsIcons = [
			<View
				key="1"
				style={{
					backgroundColor: '#EC407A',
					...styles.actionSheetIconContainer,
				}}
			>
				<FeatherIcon name="instagram" color="#F5F5F5" size={20} />
			</View>,
			<View
				key="2"
				style={{
					backgroundColor: '#BF59CF',
					...styles.actionSheetIconContainer,
				}}
			>
				<FeatherIcon name="image" color="#F5F5F5" size={20} />
			</View>,
		];

		if (selectedImage) {
			actionSheetOptions.push('Remover imagem');
			actionSheetOptionsIcons.push(
				<View
					key="3"
					style={{
						backgroundColor: '#D93025',
						...styles.actionSheetIconContainer,
					}}
				>
					<FeatherIcon name="trash-2" color="#F5F5F5" size={20} />
				</View>
			);
		}

		showActionSheetWithOptions(
			{
				title: title || 'Selecione a imagem',
				options: actionSheetOptions,
				icons: actionSheetOptionsIcons,
				cancelButtonIndex: selectedImage ? 3 : 2,
				useModal: true,
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					openCamera();
				} else if (buttonIndex === 1) {
					openGallery();
				} else if (buttonIndex === 2 && selectedImage) {
					onImageSelected(null);
				}
			}
		);
	}

	return (
		<>
			{loading && (
				<Modal transparent={true} animationType="none" visible={loading}>
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#ffffff" />
					</View>
				</Modal>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	actionSheetIconContainer: {
		height: 40,
		width: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default forwardRef(ImageSelector);
