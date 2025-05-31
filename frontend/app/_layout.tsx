import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { listenForNetworkSync } from '../offline/sync';

export default function Layout() {

  useEffect(() => {
    const unsubscribe = listenForNetworkSync();
    return unsubscribe();
  }, []);

  return <Stack />;
}
