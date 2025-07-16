import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity, // Diubah dari Button ke TouchableOpacity untuk konsistensi gaya
  StyleSheet,
  Alert,
  ActivityIndicator, // Ditambahkan untuk indikator loading
} from 'react-native';
import axios from 'axios'; // Ditambahkan untuk panggilan API

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State untuk indikator loading

  // PENTING: ALAMAT BASE URL TELAH DIUBAH KE PORT 5000
  // Gunakan alamat IP lokal komputer Anda (192.168.1.11)
  // Atau, jika Anda menggunakan emulator Android, Anda bisa menggunakan 'http://10.0.2.2:5000'
  const API_BASE_URL = 'http://192.168.1.11:5000'; 

  const handleLogin = async () => { // Diubah menjadi async karena ada panggilan API
    if (!email || !password) {
      Alert.alert('Error', '❌ Semua kolom harus diisi!');
      return;
    }

    setLoading(true); // Aktifkan indikator loading

    try {
      // Melakukan panggilan API ke endpoint login backend
      // URL lengkap akan menjadi http://192.168.1.11:5000/api/auth/login
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      
      Alert.alert('Sukses', '✅ Login berhasil!');
      // Anda mungkin ingin menyimpan token JWT (res.data.token) di AsyncStorage di sini
      // dan kemudian navigasi ke dashboard pengguna.
      navigation.navigate('UserDashboard'); // Pindah ke Dashboard User
    } catch (error) {
      // Tangani error dari respons backend atau error jaringan
      console.error(error?.response?.data || error.message);
      Alert.alert('Gagal', error.response?.data?.message || '❌ Login gagal! Email atau password salah.');
    } finally {
      setLoading(false); // Nonaktifkan indikator loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Pelanggan</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Diubah dari Button ke TouchableOpacity untuk konsistensi gaya */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading} // Tombol dinonaktifkan saat loading
      >
        {loading ? (
          <ActivityIndicator color="#fff" /> // Tampilkan loading spinner
        ) : (
          <Text style={styles.buttonText}>Login</Text> // Teks tombol normal
        )}
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Belum punya akun?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          Daftar disini
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', // Ditambahkan untuk konsistensi dengan RegisterScreen
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30 
  },
  input: { 
    width: '100%', // Ditambahkan untuk konsistensi dengan RegisterScreen
    padding: 12, // Ditambahkan untuk konsistensi dengan RegisterScreen
    borderWidth: 1, 
    borderColor: '#ddd', // Diubah untuk konsistensi
    borderRadius: 8, // Diubah untuk konsistensi
    marginBottom: 15 
  },
  button: { // Gaya tombol baru, konsisten dengan RegisterScreen
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { // Gaya teks tombol baru
    color: '#fff', 
    fontWeight: 'bold' 
  },
  registerText: { 
    marginTop: 20, 
    textAlign: 'center' 
  },
  registerLink: { 
    color: '#007bff', // Diubah untuk konsistensi
    textDecorationLine: 'underline' 
  },
});
