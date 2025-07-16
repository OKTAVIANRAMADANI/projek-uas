import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SELAMAT DATANG DI SISTEM RESERVASI HOTEL</Text>

      <View style={styles.buttonContainer}>
        <Button title="Pelanggan" onPress={() => navigation.navigate('LoginUser')} />
        {/* PERBAIKAN DI SINI: Mengubah 'LoginAdmin' menjadi 'AdminLogin' */}
        <Button title="Login Admin" onPress={() => navigation.navigate('AdminLogin')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  buttonContainer: { width: '80%', gap: 15 },
});
