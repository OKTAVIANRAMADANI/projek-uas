import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminPayments() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Pembayaran Masuk</Text>
      <Text>Data pembayaran di sini</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
