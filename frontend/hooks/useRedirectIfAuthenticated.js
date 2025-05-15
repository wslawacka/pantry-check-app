import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export function useRedirectIfAuthenticated() {
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        SecureStore.getItemAsync('token').then(token => {
            if (token) router.replace('/pantry');
            setChecking(false);
        })
    }, []);

    return checking;
}