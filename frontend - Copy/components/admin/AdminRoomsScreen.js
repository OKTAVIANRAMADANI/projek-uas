import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  Image,
  Platform,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function AdminRoomsScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    availability: true,
  });
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  const API_BASE_URL = 'http://192.168.1.11:5000'; 

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/rooms`);
      if (Array.isArray(response.data)) {
        const roomsWithFullImageUrls = response.data.map(room => ({
          ...room,
          image: (room.image && room.image !== "null") ? `${API_BASE_URL}/images/${room.image}` : null, 
        }));
        setRooms(roomsWithFullImageUrls);
      } else {
        console.error('❌ Backend response for /api/rooms is not an array:', response.data);
        setError('❌ Format data kamar tidak valid dari server.');
      }
    } catch (err) {
      console.error('❌ Error fetching rooms:', err?.response?.data || err.message);
      setError('❌ Gagal memuat daftar kamar. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Maaf, kami memerlukan izin galeri untuk ini.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleAddPress = () => {
    setCurrentRoom(null);
    setFormData({ name: '', type: '', price: '', availability: true });
    setSelectedImageUri(null);
    setModalVisible(true);
  };

  const handleEditPress = (room) => {
    setCurrentRoom(room);
    setFormData({ 
      name: room.name, 
      type: room.type, 
      price: String(room.price),
      availability: room.availability,
    });
    setSelectedImageUri(room.image); 
    setModalVisible(true);
  };

  const handleSubmitRoom = async () => {
    if (!formData.name || !formData.type || !formData.price) {
      Alert.alert('Error', 'Nama, Tipe, dan Harga wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('type', formData.type);
      data.append('price', formData.price);
      data.append('availability', formData.availability);

      if (selectedImageUri) {
        if (selectedImageUri.startsWith('http')) { 
          // Jika ini gambar lama, tidak perlu upload ulang.
          // Backend akan mempertahankan gambar yang sudah ada jika tidak ada file 'image' baru.
        } else { 
          const uriParts = selectedImageUri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          data.append('image', {
            uri: selectedImageUri,
            name: `photo_${Date.now()}.${fileType}`,
            type: `image/${fileType}`,
          });
        }
      } else {
        data.append('image', 'null'); 
      }

      const headers = { 'Content-Type': 'multipart/form-data' };

      if (currentRoom) {
        await axios.put(`${API_BASE_URL}/api/rooms/${currentRoom.id}`, data, { headers });
        Alert.alert('Sukses', '✅ Kamar berhasil diperbarui!');
      } else {
        await axios.post(`${API_BASE_URL}/api/rooms`, data, { headers });
        Alert.alert('Sukses', '✅ Kamar berhasil ditambahkan!');
      }
      setModalVisible(false);
      fetchRooms();
    } catch (err) {
      console.error('❌ Error submitting room:', err?.response?.data || err.message);
      Alert.alert('Gagal', err.response?.data?.message || '❌ Gagal menyimpan kamar!');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus kamar
  const handleDeleteRoom = (roomId) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus kamar ini? Jika kamar ini memiliki pemesanan terkait, Anda harus menghapus pemesanan tersebut terlebih dahulu!', // Pesan peringatan lebih jelas
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/api/rooms/${roomId}`);
              Alert.alert('Sukses', '✅ Kamar berhasil dihapus!');
              fetchRooms();
            } catch (err) {
              console.error('❌ Error deleting room:', err?.response?.data || err.message);
              // Pesan error spesifik untuk foreign key constraint
              if (err.response?.data?.error && err.response.data.error.includes('foreign key constraint fails')) {
                Alert.alert(
                  'Gagal Menghapus',
                  '❌ Kamar ini tidak dapat dihapus karena masih ada pemesanan yang terkait. Harap hapus pemesanan terkait terlebih dahulu di Manajemen Pemesanan.'
                );
              } else {
                Alert.alert('Gagal', err.response?.data?.message || '❌ Gagal menghapus kamar!');
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0056b3" />
        <Text style={styles.loadingText}>Memuat kamar...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchRooms}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛏️ Kelola Kamar</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>+ Tambah Kamar Baru</Text>
      </TouchableOpacity>

      {rooms.length === 0 ? (
        <Text style={styles.emptyText}>Tidak ada kamar tersedia. Tambahkan yang baru!</Text>
      ) : (
        rooms.map((room) => (
          <View key={room.id} style={styles.roomCard}>
            {room.image ? (
              <Image source={{ uri: room.image }} style={styles.roomImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>No Image</Text>
              </View>
            )}
            <View style={styles.roomDetails}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomInfo}>Tipe: {room.type}</Text>
              <Text style={styles.roomInfo}>Harga: Rp {room.price?.toLocaleString('id-ID')}</Text>
              <Text style={styles.roomInfo}>Status: {room.availability ? 'Tersedia' : 'Tidak Tersedia'}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(room)}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRoom(room.id)}>
                  <Text style={styles.actionText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

      {/* Modal untuk Form Tambah/Edit Kamar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}</Text>

            <TextInput
              placeholder="Nama Kamar"
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            <TextInput
              placeholder="Tipe Kamar (misal: Deluxe, Standard)"
              style={styles.input}
              value={formData.type}
              onChangeText={(text) => handleChange('type', text)}
            />
            <TextInput
              placeholder="Harga per Malam"
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => handleChange('price', text)}
              keyboardType="numeric"
            />
            
            {/* Bagian untuk memilih gambar */}
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerButtonText}>Pilih Gambar</Text>
            </TouchableOpacity>
            {selectedImageUri && (
              <Image source={{ uri: selectedImageUri }} style={styles.selectedImagePreview} />
            )}
            {/* Tombol untuk menghapus gambar yang dipilih */}
            {selectedImageUri && (
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImageUri(null)}>
                    <Text style={styles.removeImageButtonText}>Hapus Gambar</Text>
                </TouchableOpacity>
            )}

            {/* TODO: Tambahkan toggle untuk availability jika diinginkan */}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.actionText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRoom} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionText}>{currentRoom ? 'Simpan Perubahan' : 'Tambah Kamar'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#28a745', // Hijau
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roomCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roomImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#888',
    fontSize: 10,
  },
  roomDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  roomInfo: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10, // Memberi jarak antar tombol
  },
  editButton: {
    backgroundColor: '#007bff', // Biru
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Merah
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Gaya untuk Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d', // Abu-abu
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff', // Biru
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  button: { // Gaya umum untuk tombol coba lagi
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: { // Gaya teks tombol umum
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Gaya baru untuk Image Picker
  imagePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  selectedImagePreview: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
