import { useState } from 'react';
import { View, ActivityIndicator, TextInput, Text, Pressable, StyleSheet, Alert, Keyboard } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { validateName, validateCategory, validateExpiryDate, validateQuantity, validateBarcode } from '../../utils/pantryItemValidation';
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { addPantryItem } from '../../api/pantry';
import { cachePantryItems, getCachedPantryItems, queueOfflineAction } from '../../offline/sync';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import BarcodeScanner from '../../components/BarcodeScanner';
import colors from '../../styles/colors';

export default function AddPantryItem() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date().toISOString());
    const [quantity, setQuantity] = useState(1);
    const [barcode, setBarcode] = useState('');
    const [errors, setErrors] = useState<{ name?: string, category?: string, expiryDate?: string, quantity?: string, barcode?: string }>({});
    const [showScanner, setShowScanner] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

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
            await addPantryItem(item);
            router.replace('/pantry');
        } catch (err) {
            console.log('clicked add offline');
            const newItem = { _id: uuidv4(), ...item };
            console.log(newItem);
            await queueOfflineAction({ type: 'ADD', item: newItem });
            const cached = await getCachedPantryItems();
            await cachePantryItems([...cached, newItem]);
            Alert.alert('Offline', 'Item added and will sync when you are back online.');
            router.replace('/pantry');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Name'
                placeholderTextColor='#6e6e6e'
                value={name}
                onChangeText={setName}
                autoCapitalize='none'
                style={styles.input}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            <TextInput
                placeholder='Category'
                placeholderTextColor='#6e6e6e'
                value={category}
                onChangeText={setCategory}
                autoCapitalize='none'
                style={styles.input}
            />
            {errors.category && <Text style={styles.error}>{errors.category}</Text>}
            <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Expiry date:</Text>
                <Pressable
                    style={styles.dateField}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.dateFieldText}>
                        {expiryDate ? new Date(expiryDate).toLocaleDateString() : 'Select date'}
                    </Text>
                </Pressable>
            </View>
            {showDatePicker && (
                    <DateTimePicker
                        mode='date'
                        display='default'
                        value={new Date(expiryDate)}
                        onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setExpiryDate(selectedDate.toISOString());
                        }}
                        minimumDate={new Date()}
                        maximumDate={new Date(2050, 1, 1)}
                    />
            )}

            {errors.expiryDate && <Text style={styles.error}>{errors.expiryDate}</Text>}
            <TextInput
                placeholder='Quantity'
                placeholderTextColor='#6e6e6e'
                keyboardType='numeric'
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(Number(text))}
                style={styles.input}
            />
            {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}
            <View style={styles.barcodeRow}>
                <TextInput
                    placeholder='Barcode (optional)'
                    placeholderTextColor='#6e6e6e'
                    value={barcode}
                    onChangeText={setBarcode}
                    autoCapitalize='none'
                    style={[styles.input, { flex: 1 }]}
                />
                <Pressable
                    style={{ marginLeft: 8, padding: 8, backgroundColor: colors.primaryLight, borderRadius: 4 }}
                    onPress={() => {
                        Keyboard.dismiss();
                        setShowScanner(true);
                    }}
                >
                    <Text>📷</Text>
                </Pressable>
            </View>
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


            {showScanner && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, backgroundColor: '#000' }}>
                    <BarcodeScanner
                        onScan={data => {
                        setBarcode(data);
                        setShowScanner(false);
                        }}
                        onClose={() => setShowScanner(false)}
                />
                </View>
            )}

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
    },
    barcodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 220
    },
    dateField: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        width: 140,
        backgroundColor: colors.background,
        justifyContent: 'center',
        marginLeft: 8,
    },
    dateFieldText: {
        fontSize: 18,
        color: '#222'
    }
});