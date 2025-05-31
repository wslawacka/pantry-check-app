import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { useAuthGuard } from "../../hooks/useAuthGuard";
import colors from "../../styles/colors";
import { router } from "expo-router";
import { getPantryItems } from "../../api/pantry";
import { PantryItem } from "../../types/pantry";
import { getCachedPantryItems, cachePantryItems } from "../../offline/sync";

export default function PantryList() {
    const loadingAuth = useAuthGuard();
    const [items, setItems] = useState<PantryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    let isMounted = true;

    async function fetchData() {
        try {
            const res = await getPantryItems();
            if (isMounted) {
                setItems(res.data.items);
                await cachePantryItems(res.data.items);
            }
        } catch (err: any) {
            console.log('Error fetching pantry items:', err);
            if (err.response?.status !== 401) {
                const cached = await getCachedPantryItems();
                if (isMounted) setItems(cached);
                Alert.alert('Error', 'Failed to load pantry items (showing offline data if available)');
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    }

    fetchData();

    return () => { isMounted = false };
}, []);


    if (loadingAuth || loading) return <ActivityIndicator/>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Pantry</Text>
            <FlatList
                data={items}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item.name} ({item.quantity})</Text>
                )}
                contentContainerStyle={{ alignItems: 'center', gap: 10 }}
            />
            <Button title='Go to Add' onPress={() => router.replace('/pantry/add')}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 50
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 12
    },
    item: {
        fontSize: 18,
        padding: 16,
        borderBottomWidth: 1,
        borderColor: colors.primary
    }
});