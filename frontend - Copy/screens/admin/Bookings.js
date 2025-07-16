import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminBookings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Lihat Booking</Text>
      <Text>Data booking user di sini</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
