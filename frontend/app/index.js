import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../styles/colors';
import { useRedirectIfAuthenticated } from '../hooks/useRedirectIfAuthenticated';

export default function Home() {
  const checking = useRedirectIfAuthenticated();
  const router = useRouter();

  if (checking) return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={colors.primary} />
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PantryCheck!</Text>
      <Text style={styles.subtitle}>Your smart kitchen companion. Track, manage and never waste food again!</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => router.replace('/register')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 50,
    marginHorizontal: 50
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 16
  },
  buttonPressed: {
    backgroundColor: colors.primaryLight
  },
  buttonText: {
    fontSize: 18
  }
});
