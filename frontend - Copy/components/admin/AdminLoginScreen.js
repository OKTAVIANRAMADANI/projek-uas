import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
// import axios from 'axios'; // Tidak lagi diperlukan untuk login lokal

export default function AdminLoginScreen({ navigation }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // API_BASE_URL tidak lagi diperlukan untuk login lokal
  // const API_BASE_URL = 'http://192.168.1.11:5000'; 

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert('Error', '❌ Email dan password harus diisi!');
      return;
    }

    setLoading(true);

    // --- PERUBAHAN DI SINI: Logika login lokal tanpa backend ---
    // Kredensial admin hardcode untuk pengembangan
    const ADMIN_EMAIL = 'admin@gmail.com'; // Ganti dengan email admin yang Anda inginkan
    const ADMIN_PASSWORD = 'admin123'; // Ganti dengan password admin yang Anda inginkan

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      Alert.alert('Sukses', '✅ Login Admin berhasil!');
      // TODO: Dalam aplikasi nyata, Anda akan menyimpan token JWT di sini setelah login backend
      navigation.navigate('AdminDashboard'); // Navigasi ke Drawer Navigator admin
    } else {
      Alert.alert('Gagal', '❌ Email atau password admin salah!');
    }
    // --- AKHIR PERUBAHAN ---

    setLoading(false); // Nonaktifkan loading setelah proses selesai
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Login Admin</Text>

      <TextInput
        placeholder="Email Admin"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password Admin"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#0056b3', // Warna biru tua untuk admin
    padding: 18,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 18,
  },
});
