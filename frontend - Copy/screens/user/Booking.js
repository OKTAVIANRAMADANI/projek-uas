import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Booking({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Booking Kamar</Text>
      <Text>Form Booking di sini</Text>
      <Button title="Kembali" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
