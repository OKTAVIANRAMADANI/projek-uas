import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'; // Tambahkan Alert

export default function AdminDashboardScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Dashboard Admin</Text>

      <View style={styles.cardContainer}>
        {/* Kartu untuk Manajemen Kamar */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('AdminRooms')}
        >
          <Text style={styles.cardIcon}>🛏️</Text>
          <Text style={styles.cardTitle}>Manajemen Kamar</Text>
          <Text style={styles.cardDescription}>Lihat, tambah, edit, dan hapus kamar.</Text>
        </TouchableOpacity>

        {/* Kartu untuk Manajemen Pemesanan */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('AdminBookings')}
        >
          <Text style={styles.cardIcon}>📅</Text>
          <Text style={styles.cardTitle}>Manajemen Pemesanan</Text>
          <Text style={styles.cardDescription}>Kelola semua pemesanan pelanggan.</Text>
        </TouchableOpacity>

        {/* Kartu untuk Manajemen Pembayaran */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('AdminPayments')}
        >
          <Text style={styles.cardIcon}>💰</Text>
          <Text style={styles.cardTitle}>Manajemen Pembayaran</Text>
          <Text style={styles.cardDescription}>Verifikasi dan lacak pembayaran.</Text>
        </TouchableOpacity>

        {/* Kartu Opsional lainnya */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => Alert.alert('Fitur', 'Fitur laporan akan datang!')}
        >
          <Text style={styles.cardIcon}>📈</Text>
          <Text style={styles.cardTitle}>Laporan & Statistik</Text>
          <Text style={styles.cardDescription}>Analisis data pemesanan.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '45%', // Untuk 2 kolom
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
