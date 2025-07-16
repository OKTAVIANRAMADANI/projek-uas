import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';

export default function RoomsScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ALAMAT BASE URL DENGAN PORT 5000
  // Sesuaikan IP lokal Anda (192.168.1.11) atau gunakan 10.0.2.2 untuk emulator Android
  const API_BASE_URL = 'http://192.168.1.11:5000'; 

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/rooms`);
        
        // Memastikan response.data adalah array sebelum memproses
        if (Array.isArray(response.data)) {
          const roomsWithFullImageUrls = response.data.map(room => ({
            ...room,
            // LOGIKA PENTING DI SINI:
            // Memeriksa apakah room.image ada (bukan null/undefined) DAN BUKAN string "null".
            // Jika valid, buat URL lengkap. Jika tidak, set ke null agar placeholder ditampilkan.
            image: (room.image && room.image !== "null") ? `${API_BASE_URL}/images/${room.image}` : null, 
          }));
          setRooms(roomsWithFullImageUrls);
        } else {
          // Log error jika format data tidak sesuai ekspektasi
          console.error('❌ Backend response for /api/rooms is not an array:', response.data);
          setError('❌ Format data kamar tidak valid dari server.');
          Alert.alert('Error', '❌ Format data kamar tidak valid dari server.');
        }
      } catch (err) {
        // Tangani error saat fetching data dari API
        console.error('❌ Error fetching rooms:', err?.response?.data || err.message);
        setError('❌ Gagal memuat daftar kamar. Silakan coba lagi nanti.');
        Alert.alert('Error', '❌ Gagal memuat daftar kamar. Silakan coba lagi nanti.');
      } finally {
        setLoading(false); // Sembunyikan indikator loading
      }
    };

    fetchRooms();
  }, []); // useEffect ini hanya berjalan sekali saat komponen di-mount

  // Tampilan kondisional berdasarkan status loading, error, atau data kosong
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat kamar...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (rooms.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tidak ada kamar tersedia saat ini.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛏️ Daftar Kamar Tersedia</Text>

      {rooms.map((room) => (
        <View key={room.id} style={styles.card}>
          {/* LOGIKA PENTING DI SINI:
              Tampilkan komponen Image hanya jika room.image memiliki URL yang valid.
              Jika tidak, tampilkan placeholder "No Image". */}
          {room.image ? (
            <Image 
              source={{ uri: room.image }} 
              style={styles.image} 
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)} 
            />
          ) : (
            // Placeholder jika tidak ada gambar atau gambar adalah string "null"
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomType}>Tipe: {room.type}</Text>
            <Text style={styles.price}>Rp {room.price ? room.price.toLocaleString() : 'N/A'}</Text>
            <Text style={styles.facilities}>Fasilitas:</Text>
            <Text style={styles.facilities}>🛏️ Tempat Tidur | ❄️ AC | 📺 TV | 📶 Wi-Fi</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('Booking', {
                  roomId: room.id,
                  name: room.name,
                  price: room.price,
                  image: room.image, // Meneruskan URL gambar lengkap (atau null)
                })
              }
            >
              <Text style={styles.buttonText}>Booking Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// Gaya untuk komponen React Native
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row', 
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 120, 
    height: 120,
    resizeMode: 'cover', // Pastikan gambar mengisi area dengan baik
  },
  imagePlaceholder: { // Gaya untuk placeholder gambar
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: { // Gaya teks placeholder gambar
    color: '#888',
    fontSize: 12,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomType: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    color: '#009688',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  facilities: {
    fontSize: 12,
    color: '#555',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0077cc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-end', 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
});
