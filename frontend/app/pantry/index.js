import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../../api/axios';
import { useAuth } from "../../hooks/useAuth";
import colors from "../../styles/colors";

export default function PantryList() {
    const loadingAuth = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       api.get('/pantryItems')
        .then(res => {
            console.log('Pantry items:', res.data);
            setItems(res.data.pantryItems);
        })
        .catch(err => {
            console.log('Error fetching pantry items:', err);
        })
        .finally(
            setLoading(false)
        );
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