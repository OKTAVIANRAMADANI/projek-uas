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
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // PENTING: ALAMAT BASE URL TELAH DIUBAH KE PORT 5000
  // Gunakan alamat IP lokal komputer Anda (192.168.1.11)
  // Atau, jika Anda menggunakan emulator Android, Anda bisa menggunakan 'http://10.0.2.2:5000'
  const API_BASE_URL = 'http://192.168.1.11:5000'; 


  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const { name, email, password } = formData;

    // Validasi input sederhana di sisi klien
    if (!name || !email || !password) {
      Alert.alert('Error', '❌ Semua kolom harus diisi!');
      return;
    }

    setLoading(true); // Aktifkan indikator loading

    try {
      // Melakukan permintaan POST ke endpoint registrasi backend
      // URL lengkap akan menjadi http://192.168.1.11:5000/api/auth/register
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      
      Alert.alert('Sukses', '✅ Registrasi berhasil!');
      // PERBAIKAN DI SINI: Navigasi ke 'LoginUser' sesuai dengan nama di AppNavigator
      navigation.navigate('LoginUser'); 
    } catch (error) {
      // Tangani error dari respons backend atau error jaringan
      console.error(error?.response?.data || error.message);
      Alert.alert('Gagal', error.response?.data?.message || '❌ Registrasi gagal!');
    } finally {
      setLoading(false); // Nonaktifkan indikator loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrasi Akun</Text>

      <TextInput
        placeholder="Nama"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading} // Tombol dinonaktifkan saat loading
      >
        {loading ? (
          <ActivityIndicator color="#fff" /> // Tampilkan loading spinner
        ) : (
          <Text style={styles.buttonText}>Registrasi</Text> // Teks tombol normal
        )}
      </TouchableOpacity>

      {/* PERBAIKAN DI SINI: Navigasi ke 'LoginUser' sesuai dengan nama di AppNavigator */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginUser')}>
        <Text style={styles.registerText}>Sudah punya akun? Masuk Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

// Gaya untuk komponen React Native
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30 
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  registerText: { 
    color: '#007bff' 
  },
});
