import { useState } from 'react';
import { View, ActivityIndicator, TextInput, Text, Pressable, StyleSheet, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { validateName, validateCategory, validateExpiryDate, validateQuantity, validateBarcode } from '../../utils/pantryItemValidation';
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { addPantryItem } from '../../api/pantry';
import NetInfo from '@react-native-community/netinfo';
import { cachePantryItems, getCachedPantryItems, queueOfflineAction } from '../../offline/sync';
import colors from '../../styles/colors';

export default function AddPantryItem() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date().toISOString());
    const [quantity, setQuantity] = useState(1);
    const [barcode, setBarcode] = useState('');
    const [errors, setErrors] = useState<{ name?: string, category?: string, expiryDate?: string, quantity?: string, barcode?: string }>({});
    const loading = useAuthGuard();
    const router = useRouter();

    if (loading) return (
        <View>
            <ActivityIndicator/>
        </View>
    );

    const handleAdd = async () => {
        const nameError = validateName(name);
        const categoryError = validateCategory(category);
        const expiryDateError = validateExpiryDate(expiryDate);
        const quantityError = validateQuantity(quantity);
        const barcodeError = validateBarcode(barcode);

        if (nameError || categoryError || expiryDateError || quantityError || barcodeError) {
            setErrors({
                name: nameError,
                category: categoryError,
                expiryDate: expiryDateError,
                quantity: quantityError,
                barcode: barcodeError
            });
            return;
        }
        setErrors({});

        const item = { name, category: category.toLowerCase(), expiryDate: expiryDate.split('T')[0], quantity,  ...(barcode ? { barcode } : {}) };

        try {
            const state = await NetInfo.fetch();
            if (state.isConnected && state.isInternetReachable) {
                await addPantryItem(item);
            } else {
                await queueOfflineAction({ type: 'ADD', item });
                const cached = await getCachedPantryItems();
                await cachePantryItems([...cached, item]);
                Alert.alert('Offline', 'Item added and will sync when you are back online.');
            }
            router.replace('/pantry');
        } catch(error: any) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to add item'
            );
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Name'
                value={name}
                onChangeText={setName}
                autoCapitalize='none'
                style={styles.input}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            <TextInput
                placeholder='Category'
                value={category}
                onChangeText={setCategory}
                autoCapitalize='none'
                style={styles.input}
            />
            {errors.category && <Text style={styles.error}>{errors.category}</Text>}
            <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Expiry date:</Text>
                <DateTimePicker
                mode='date'
                display='default'
                value={new Date(expiryDate)}
                onChange={(event, selectedDate) => {
                    if (selectedDate) {
                        setExpiryDate(selectedDate.toISOString())
                    }
                }}
                minimumDate={new Date()}
                maximumDate={new Date(2050, 1, 1)}
            />
            </View>
            {errors.expiryDate && <Text style={styles.error}>{errors.expiryDate}</Text>}
            <TextInput
                placeholder='Quantity'
                keyboardType='numeric'
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(Number(text))}
                style={styles.input}
            />
            {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}
            <TextInput
                placeholder='Barcode (optional)'
                value={barcode}
                onChangeText={setBarcode}
                autoCapitalize='none'
                style={styles.input}
            />
            {errors.barcode && <Text style={styles.error}>{errors.barcode}</Text>}
            <Pressable
                style={styles.button}
                onPress={handleAdd}
            >
                <Text style={styles.buttonText}>Add Item</Text>
            </Pressable>
            <Pressable
                onPress={() => router.replace('/pantry')}
            >
                <Text style={styles.backButton}>Go to List</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        backgroundColor: colors.background
    },
    input: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        width: 220,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 4
    },
    error: {
        color: colors.error,
        fontSize: 16
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        marginTop: 14
    },
    buttonText: {
        fontSize: 18
    },
    backButton: {
        fontSize: 18,
        marginTop: 14,
        textDecorationLine: 'underline'
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    dateLabel: {
        fontSize: 18,
        opacity: 0.8
    }
});