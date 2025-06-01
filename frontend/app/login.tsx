import { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { loginUser } from '../api/auth';
import { validateLoginUsername, validateLoginPassword } from '../utils/userValidation';
import colors from '../styles/colors';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string, password?: string }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        const usernameError = validateLoginUsername(username);
        const passwordError = validateLoginPassword(password);

        if (usernameError || passwordError) {
            setErrors({
                username: usernameError,
                password: passwordError
            });
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            const res = await loginUser({ username, password });
            const token = res.data.token;
            if (token) {
                await SecureStore.setItemAsync('token', token);
                router.replace('/pantry');
            } else {
                Alert.alert('Login failed', 'No token received.');
            }
        } catch(error) {
            Alert.alert(
                'Login failed',
                error.response?.data?.message || error.message || 'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder='Username'
                placeholderTextColor='#6e6e6e'
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
                textContentType='username'
                style={styles.input}
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}
            <TextInput
                placeholder='Password'
                placeholderTextColor='#6e6e6e'
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
                secureTextEntry
                textContentType='password'
                style={styles.input}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
           <Pressable
                style={({ pressed }) => [
                    styles.loginButton,
                    pressed && styles.loginButtonPressed,
                    loading && styles.loginButtonDisabled
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.loginButtonText}>
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </Pressable>
            <View style={styles.promptRow}>
                <Text style={styles.promptText}>Don’t have an account?</Text>
                    <Pressable
                        style={({ pressed }) => [
                        pressed && styles.buttonPressed
                        ]}
                        onPress={() => router.replace('/register')}
                    >
                        <Text style={styles.buttonText}>
                            Register
                        </Text>
                    </Pressable>
            </View>
            <Pressable
                style={({ pressed }) => [
                    pressed && styles.buttonPressed
                ]}
                onPress={() => router.replace('/')}
            >
                <Text style={styles.buttonText}>
                    Back to Home
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        backgroundColor: colors.background
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 14
    },
    input: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        width: 220,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 4
    },
    error: {
        color: colors.error,
        fontSize: 16
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        marginTop: 10,
        marginBottom: 30
    },
    loginButtonPressed: {
        backgroundColor: colors.primaryLight
    },
    loginButtonDisabled: {
        backgroundColor: colors.accent
    },
    loginButtonText: {
        fontSize: 18
    },
    buttonText: {
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    buttonPressed: {
        opacity: 0.6
    },
    promptRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    promptText: {
        fontSize: 18,
        marginRight: 10
    }
});