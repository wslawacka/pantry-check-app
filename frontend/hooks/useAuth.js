import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export function useAuth() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        SecureStore.getItemAsync('token').then(token => {
            if (!token) router.replace('/login');
            setLoading(false);
        })
    }, []);

    return loading;
}