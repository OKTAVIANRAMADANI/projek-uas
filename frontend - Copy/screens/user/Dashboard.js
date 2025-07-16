import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function UserDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏨 Dashboard Pengguna</Text>
      <Button title="Booking Kamar" onPress={() => navigation.navigate('Booking')} />
      <Button title="Pembayaran" onPress={() => navigation.navigate('Payment')} />
      <Button title="Profil Saya" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
