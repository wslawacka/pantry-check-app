import { React, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../api/auth';
import { validateUsername, validateEmail, validatePassword } from '../utils/validation';

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
            const res = await registerUser(username, email, password);
            Alert.alert('Success', 'Registration successful! You can now log in.');
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
            <Button title={ loading? 'Registering...' : 'Register'} onPress={handleRegister} />
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
        fontSize: 20,
        marginBottom: 10
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