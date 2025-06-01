import { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import NetInfo from '@react-native-community/netinfo';
import { getPantryItem, updatePantryItem } from '../../../api/pantry';
import { validateName, validateCategory, validateExpiryDate, validateQuantity, validateBarcode } from '../../../utils/pantryItemValidation';
import { getCachedPantryItems, queueOfflineAction, cachePantryItems } from '../../../offline/sync';
import { PantryItem } from '../../../types/pantry';
import colors from '../../../styles/colors';

export default function EditPantryItem() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [item, setItem] = useState<PantryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [barcode, setBarcode] = useState('');
    const [errors, setErrors] = useState<{ name?: string, category?: string, expiryDate?: string, quantity?: string, barcode?: string }>({});

    useEffect(() => {
        let isMounted = true;
        async function fetchItem() {
            try {
                const res = await getPantryItem(id);
                if (isMounted) setItem(res.data.item);
            } catch (err) {
                const cached = await getCachedPantryItems();
                const found = cached.find((i: PantryItem) => i._id === id);
                if (isMounted) setItem(found || null);
                if (!found) Alert.alert('Error', 'Item not found (offline)');
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchItem();
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCategory(item.category);
            setExpiryDate(item.expiryDate);
            setQuantity(item.quantity);
            setBarcode(item.barcode || '');
        }
    }, [item]);

    const handleSave = async () => {
        if (!item) return;

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
        setSaving(true);
        const updated: PantryItem = {
            ...item,
            name,
            category: category.toLowerCase(),
            expiryDate: expiryDate.split('T')[0],
            quantity: Number(quantity),
            ...(barcode ? { barcode } : {})
        };
        try {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                await updatePantryItem(item._id, updated);
            } else {
                await queueOfflineAction({ type: 'UPDATE', item: updated });
            }
            const cached = await getCachedPantryItems();
            const newCache = cached.map(i => i._id === item._id ? updated : i);
            await cachePantryItems(newCache);
            router.replace('/pantry');
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update item');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <ActivityIndicator />;
    if (!item) return <Text style={styles.error}>Item not found.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Item</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder='Name'
                autoCapitalize='none'
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder='Category'
                autoCapitalize='none'
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
                style={styles.input}
                placeholder='Quantity'
                keyboardType='numeric'
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(Number(text))}
            />
            {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}
            <TextInput
                style={styles.input}
                value={barcode}
                onChangeText={setBarcode}
                placeholder='Barcode (optional)'
                autoCapitalize='none'
            />
            {errors.barcode && <Text style={styles.error}>{errors.barcode}</Text>}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed
                ]}
                onPress={handleSave}
                disabled={saving}
            >
                <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.cancelButtonPressed
                ]}
                onPress={() => router.back()}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        width: 220,
        marginBottom: 12,
        fontSize: 18
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 30,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18
    },
    buttonPressed: {
        backgroundColor: colors.primaryLight
    },
    cancelButton: {
        marginTop: 30,
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    cancelButtonPressed: {
        opacity: 0.6
    },
    error: {
        color: colors.error,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10
    },
    dateLabel: {
        fontSize: 18,
        opacity: 0.8
    }
});
