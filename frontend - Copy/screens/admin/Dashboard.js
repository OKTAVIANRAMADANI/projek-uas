import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AdminDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Dashboard Admin</Text>
      <Button title="Kelola Kamar" onPress={() => navigation.navigate('AdminRooms')} />
      <Button title="Lihat Booking" onPress={() => navigation.navigate('AdminBookings')} />
      <Button title="Pembayaran" onPress={() => navigation.navigate('AdminPayments')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
