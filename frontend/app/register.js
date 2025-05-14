import { React, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../api/auth';
import { validateUsername, validateEmail, validatePassword } from '../utils/validation';
import colors from '../styles/colors';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        const usernameError = validateUsername(username);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (usernameError || emailError || passwordError) {
            setErrors({
                username: usernameError,
                email: emailError,
                password: passwordError
            });
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            await registerUser(username, email, password);
            router.replace('/login');
        } catch(error) {
            Alert.alert(
                'Registration failed',
                error.response?.data?.message || error.message || 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            <Pressable
                style={({ pressed }) => [
                    styles.registerButton,
                    pressed && styles.registerButtonPressed,
                    loading && styles.registerButtonDisabled
                ]}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.registerButtonText}>
                    {loading ? 'Registering...' : 'Register'}
                </Text>
            </Pressable>
            <View style={styles.promptRow}>
                <Text style={styles.promptText}>Already have an account?</Text>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={() => router.replace('/login')}
                >
                    <Text style={styles.buttonText}>
                        Log in
                    </Text>
                </Pressable>
            </View>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
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
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
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
    registerButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        marginTop: 10,
        marginBottom: 30
    },
    registerButtonPressed: {
        backgroundColor: colors.primaryLight
    },
    registerButtonDisabled: {
        backgroundColor: colors.accent
    },
    registerButtonText: {
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