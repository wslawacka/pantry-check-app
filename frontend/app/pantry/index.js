import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../../api/axios';
import { useAuth } from "../../hooks/useAuth";

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
                    <View style={styles.item}>
                        <Text>{item.name} ({item.quantity})</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold'
    },
    item: {

    }
})