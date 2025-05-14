import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PantryCheck!</Text>
      <Button title='Login' onPress={() => router.push('/login')} />
      <Button title='Register' onPress={() => router.push('/register')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
