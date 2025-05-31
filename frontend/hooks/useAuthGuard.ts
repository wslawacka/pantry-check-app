import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export function useAuthGuard() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
        SecureStore.getItemAsync('token')
            .then(token => {
                if (!token) router.replace('/login');
            })
            .catch(() => router.replace('/login'))
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, []);


    return loading;
}