import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getPantryItem } from "../../api/pantry";
import { getCachedPantryItems } from "../../offline/sync";
import { PantryItem } from "../../types/pantry";
import colors from "../../styles/colors";

export default function PantryItemScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [item, setItem] = useState<PantryItem | null>(null);
    const [loading, setLoading] = useState(true);

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
                if (!found) {
                    Alert.alert("Error", "Item not found (offline)");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchItem();
        return () => { isMounted = false; };
    }, [id]);

    if (loading) return <ActivityIndicator />;

    if (!item) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Item not found.</Text>
                <Pressable onPress={() => router.back()} style={styles.button}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.label}>Category: <Text style={styles.value}>{item.category}</Text></Text>
            <Text style={styles.label}>Expiry Date: <Text style={styles.value}>{item.expiryDate}</Text></Text>
            <Text style={styles.label}>Quantity: <Text style={styles.value}>{item.quantity}</Text></Text>
            {item.barcode && (
                <Text style={styles.label}>Barcode: <Text style={styles.value}>{item.barcode}</Text></Text>
            )}
            <Pressable onPress={() => router.back()} style={styles.button}>
                <Text style={styles.buttonText}>Go Back</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 24
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 50
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 10
    },
    value: {
        fontWeight: "400"
    },
    error: {
        color: colors.error,
        fontSize: 18,
        marginBottom: 20
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 240
    },
    buttonText: {
        fontSize: 18
    }
});
