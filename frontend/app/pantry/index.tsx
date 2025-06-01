import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable, Alert } from 'react-native';
import { useAuthGuard } from "../../hooks/useAuthGuard";
import colors from "../../styles/colors";
import { router } from "expo-router";
import { getPantryItems, deletePantryItem } from "../../api/pantry";
import { PantryItem } from "../../types/pantry";
import { getCachedPantryItems, cachePantryItems, queueOfflineAction, syncWithBackend } from "../../offline/sync";
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

export default function PantryList() {
    const loadingAuth = useAuthGuard();
    const [items, setItems] = useState<PantryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    let isMounted = true;

    async function fetchData() {
        try {
            const cached = await getCachedPantryItems();
            if (isMounted) setItems(cached);
            const res = await getPantryItems();
            if (isMounted) {
                setItems(res.data.items);
                await cachePantryItems(res.data.items);
            }
        }  catch (err: any) {
            if (err.response?.status !== 401) {
                Alert.alert('Error', 'Failed to load pantry items (showing offline data if available)');
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    }

    fetchData();

    return () => { isMounted = false };
    }, []);

    const handleDelete = async (id: string) => {
        const prevItems = items;
        setItems(prev => prev.filter(item => item._id !== id));
        try {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                await deletePantryItem(id);
            } else {
                await queueOfflineAction({ type: 'DELETE', item: { _id: id } });
            }
        } catch(error) {
            if (
                error.code === 'ERR_NETWORK' ||
                error.message === 'Network Error' ||
                !error.response
            ) {
            await queueOfflineAction({ type: 'DELETE', item: { _id: id } });
            Alert.alert('Offline', 'Delete will be synced when you are back online.');
        } else {
            setItems(prevItems);
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete item');
        }
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        router.replace('/login');
    };


    if (loadingAuth || loading) return <ActivityIndicator/>;

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.logoutButton,
                    pressed && styles.logoutButtonPressed
                ]}
                onPress={handleLogout}
            >
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </Pressable>
            <Text style={styles.title}>Your Pantry</Text>
            <FlatList
                data={items}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No items in your pantry yet!</Text>
                }
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <View style={styles.itemTextContainer}>
                            <Pressable
                                onPress={() => router.push(`/pantry/${item._id}`)}
                            >
                                <Text
                                    style={styles.item}
                                >
                                    {item.name} ({item.quantity})
                                </Text>
                            </Pressable>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.editButton,
                                    pressed && styles.editButtonPressed
                                ]}
                                onPress={() => router.push(`/pantry/edit/${item._id}`)}
                            >
                                <Text style={styles.editButtonText}>Edit</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.deleteButton,
                                    pressed && styles.deleteButtonPressed
                                ]}
                                onPress={() => handleDelete(item._id)}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ alignItems: 'center', gap: 10 }}
            />
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed
                ]}
                onPress={() => router.replace('/pantry/add')}
            >
                <Text style={styles.buttonText}>Add Item</Text>
            </Pressable>


            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.syncButton,
                    pressed && styles.syncButtonPressed
                ]}
                onPress={syncWithBackend}
            >
                <Text style={styles.syncButtonText}>Sync Now</Text>
            </Pressable>

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
        fontSize: 24,
        marginBottom: 16
    },
    itemTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    item: {
        fontSize: 18,
        padding: 16,
        borderBottomWidth: 1,
        borderColor: colors.primary,
        maxWidth: 150
    },
    buttonText: {
        fontSize: 18
    },
    buttonPressed: {
        backgroundColor: colors.primaryLight
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        marginTop: 10,
        marginBottom: 30,
        alignSelf: 'center'
    },
    deleteButton: {
        backgroundColor: colors.error,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 12,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16
    },
    deleteButtonPressed: {
        opacity: 0.7
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 260,
    },
    emptyText: {
        fontSize: 20,
        marginTop: 16
    },
    logoutButton: {
        alignSelf: 'flex-end',
        marginBottom: 30
    },
    logoutButtonPressed: {
        opacity: 0.6
    },
    logoutButtonText: {
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    editButton: {
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 12,
    },
    editButtonText: {
        fontSize: 16
    },
    editButtonPressed: {
        opacity: 0.7
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    syncButton: {
        backgroundColor: colors.accent
    },
    syncButtonPressed: {
        opacity: 0.6
    },
    syncButtonText: {
        fontSize: 16
    }
});