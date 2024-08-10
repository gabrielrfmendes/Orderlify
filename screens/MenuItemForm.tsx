import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Image, ScrollView, View } from 'react-native';
import AppBackground from '../components/AppBackground';
import { MaterialIcons } from '@expo/vector-icons';
import ImageSelector, {
	ImageSelectorHandler,
} from '../components/ImageSelector';
import TextField from '../components/TextField';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme, Text, Button, RadioButton } from 'react-native-paper';
import { formatMonetaryInput, formatMonetaryValue } from '../utils';
import { saveMenuItem, updateMenuItem } from '../services/menu';

function extractObjectUpdates(oldObject, newObject) {
	const updates = {};

	for (const key in newObject) {
		if (oldObject.hasOwnProperty(key)) {
			if (newObject[key] !== oldObject[key]) {
				updates[key] = newObject[key];
			}
		} else {
			updates[key] = newObject[key];
		}
	}

	return updates;
}

export default function MenuItemFormScreen() {
	const [picture, setPicture] = useState({ uri: null });
	const [availability, setAvailability] = useState('ReadyToDelivery');
	const [name, setName] = useState('');
	const [nameValidationMessage, setNameValidationMessage] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('R$ 0,00');
	const [priceValidationMessage, setPriceValidationMessage] = useState('');
	const [category, setCategory] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const imageSelectorRef = useRef<ImageSelectorHandler>();
	const nameInputRef = useRef();
	const descriptionInputRef = useRef();
	const priceInputRef = useRef();
	const navigation = useNavigation();
	const route = useRoute();
	const { colors } = useTheme();

	useEffect(() => {
		const { menuItem } = route.params;

		if (menuItem) {
			navigation.setOptions({ title: 'Editar produto' });
			setAvailability(menuItem.availability);
			if (menuItem.pictureUri) {
				setPicture({ uri: menuItem?.pictureUri });
			}
			setName(menuItem.name);
			setDescription(menuItem.description);
			setPrice(formatMonetaryValue(menuItem.price));
			setCategory(menuItem.category || '');
		} else {
			navigation.setOptions({ title: 'Novo produto' });
		}
	}, []);

	function handleNameChange(text: string) {
		setNameValidationMessage('');
		setName(text);
	}

	function handleDescriptionChange(text: string) {
		setDescription(text);
	}

	function handlePriceChange(text: string) {
		setPriceValidationMessage('');
		setPrice(formatMonetaryInput(text));
	}

	async function handleSave() {
		let invalidFields = 0;
		let focusFirstInvalidField = null;

		if (name.length === 0) {
			invalidFields++;
			focusFirstInvalidField = nameInputRef.current.focus;
			setNameValidationMessage('O nome é obrigatório');
		}

		if (price === 'R$ 0,00') {
			if (invalidFields === 0) {
				focusFirstInvalidField = priceInputRef.current.focus;
			}

			invalidFields++;
			setPriceValidationMessage('O preço deve ser maior que R$ 0,00');
		}

		if (invalidFields > 0) {
			focusFirstInvalidField();
			return;
		}

		setIsLoading(true);

		const menuItemData = {
			availability,
			name,
			description,
			price: Number(
				price.replace('R$ ', '').replace('.', '').replace(',', '.')
			),
		};

		if (picture.uri) {
			menuItemData.picture = picture;
		}

		if (category.length) {
			menuItemData.category = category;
		}

		if (description.length) {
			menuItemData.description = description;
		}

		if (route.params.menuItem) {
			const oldMenuItem = Object.fromEntries(
				Object.entries(route.params.menuItem).filter(
					([key]) => !['pictureUri'].includes(key)
				)
			);

			if (route.params.menuItem.pictureUri) {
				oldMenuItem.picture = {
					...picture,
					uri: route.params.menuItem.pictureUri,
				};

				menuItemData.picture = picture;
			}

			if (oldMenuItem?.picture?.uri === menuItemData?.picture?.uri) {
				delete menuItemData.picture;
			}

			const menuItemUpdates = extractObjectUpdates(oldMenuItem, menuItemData);

			if (Object.keys(menuItemUpdates).length > 0) {
				const response = await updateMenuItem(menuItemUpdates);

				route.params.onSave({
					...menuItemUpdates,
					...response.data,
				});
			}
		} else {
			const response = await saveMenuItem(menuItemData);

			route.params.onSave({
				...response.data,
				...menuItemData,
			});
		}

		navigation.goBack();
	}

	return (
		<AppBackground>
			<ScrollView>
				<View style={{ padding: 16 }}>
					<View
						style={{
							flexDirection: 'row',
							gap: 12,
							alignItems: 'flex-end',
							marginBottom: 12,
						}}
					>
						<ImageSelector
							title="Image do produto"
							ref={imageSelectorRef}
							selectedImage={picture}
							onImageSelected={setPicture}
						/>
						<View>
							<Text
								style={{ marginLeft: 8, color: colors.secondary }}
								variant="labelLarge"
							>
								Foto
							</Text>
							<TouchableOpacity
								style={{
									backgroundColor: colors.surfaceVariant,
									height: 104,
									width: 104,
									borderRadius: 8,
									alignItems: 'center',
									justifyContent: 'center',
									overflow: 'hidden',
								}}
								onPress={() => {
									imageSelectorRef.current.showOptions();
								}}
							>
								{picture.uri ? (
									<Image
										source={{ uri: picture.uri }}
										style={{ height: '100%', width: '100%' }}
									/>
								) : (
									<MaterialIcons
										name="add-photo-alternate"
										size={32}
										color={colors.onSurfaceVariant}
									/>
								)}
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1 }}>
							<Text
								style={{ marginLeft: 8, color: colors.secondary }}
								variant="labelLarge"
							>
								Disponibilidade
							</Text>
							<View
								style={{
									backgroundColor: colors.surfaceVariant,
									borderRadius: 4,
									flex: 1,
								}}
							>
								<RadioButton.Group
									onValueChange={(value) => setAvailability(value)}
									value={availability}
								>
									<RadioButton.Item
										label="Pronta entrega"
										value="ReadyToDelivery"
									/>
									<RadioButton.Item
										label="Após preparo"
										value="PreparationRequired"
									/>
								</RadioButton.Group>
							</View>
						</View>
					</View>
					<TextField
						reference={nameInputRef}
						label="Nome"
						placeholder="Insira o nome do produto"
						value={name}
						onChangeText={handleNameChange}
						onSubmitEditing={descriptionInputRef.current?.focus}
						blurOnSubmit={false}
						returnKeyType="next"
						validationMessage={nameValidationMessage}
						error={!!nameValidationMessage}
					/>
					<TextField
						multiline
						reference={descriptionInputRef}
						label="Descrição"
						placeholder="Insira a descrição do produto"
						value={description}
						onChangeText={handleDescriptionChange}
						onSubmitEditing={priceInputRef.current?.focus}
						blurOnSubmit={false}
						returnKeyType="done"
					/>
					<TextField
						reference={priceInputRef}
						label="Preço"
						value={price}
						onChangeText={handlePriceChange}
						keyboardType="numeric"
						returnKeyType="next"
						validationMessage={priceValidationMessage}
						error={!!priceValidationMessage}
					/>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Categories', {
								onSelect: setCategory,
							});
						}}
					>
						<TextField value={category} label="Categoria" editable={false} />
					</TouchableOpacity>
				</View>
			</ScrollView>
			<View
				style={{
					paddingVertical: 16,
					paddingHorizontal: 32,
				}}
			>
				<Button mode="contained" onPress={handleSave} loading={isLoading}>
					{isLoading ? '' : 'Salvar'}
				</Button>
			</View>
		</AppBackground>
	);
}
