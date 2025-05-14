import { React, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { loginUser } from '../api/auth';
import { validateLoginUsername, validateLoginPassword } from '../utils/validation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
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
            const res = await loginUser(username, password);
            const token = res.data.token;
            if (token) {
                await SecureStore.setItemAsync('token', token);
                Alert.alert('Success', 'Logged in!');
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
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
            <Button title='Back to Home' onPress={() => router.replace('/')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20
    },
    input: {
        padding: 5,
        width: 200,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 4
    },
    error: {
        color: 'red',
        marginBottom: 5
    }
});