import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminRooms() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛏️ Kelola Kamar</Text>
      <Text>CRUD kamar di sini</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
