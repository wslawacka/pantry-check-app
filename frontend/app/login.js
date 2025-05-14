import { React, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { loginUser } from '../api/auth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }
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
                error.response?.data?.message || error.message || 'Unknown error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text>Login</Text>
            <TextInput
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
            <Button title='Back to Home' onPress={() => router.replace('/')} />
        </View>
    );


}