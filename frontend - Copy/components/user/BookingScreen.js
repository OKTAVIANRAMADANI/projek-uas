import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function BookingScreen({ route, navigation }) {
  const { roomId, name, price, image } = route.params || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guest_name: '',
    request: '',
    check_in: '',
    check_out: '',
    payment_status: 'DP',
    agreement: false,
  });

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://192.168.1.11:5000'; 

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const onDateChange = (event, selectedDate, field) => {
    if (Platform.OS === 'android') {
      if (field === 'check_in') setShowCheckIn(false);
      if (field === 'check_out') setShowCheckOut(false);
    }
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange(field, formattedDate);
    }
  };

  const handleBooking = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.guest_name ||
      !formData.check_in ||
      !formData.check_out ||
      !formData.agreement
    ) {
      Alert.alert('Error', '❌ Semua field wajib diisi & Anda harus menyetujui syarat & ketentuan.');
      return;
    }

    if (new Date(formData.check_in) >= new Date(formData.check_out)) {
      Alert.alert('Error', '❌ Tanggal check-out harus sesudah tanggal check-in.');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        // ======================================================================================
        // !!! PERHATIAN SANGAT PENTING: SOLUSI UNTUK ERROR 'FOREIGN KEY CONSTRAINT FAILS' !!!
        //
        // Error ini berarti 'user_id' yang Anda kirim TIDAK ADA di tabel 'users' database Anda.
        //
        // LANGKAH-LANGKAH WAJIB YANG HARUS ANDA LAKUKAN:
        // 1.  BUKA ALAT MANAJEMEN DATABASE ANDA (phpMyAdmin, MySQL Workbench, DBeaver, dll.).
        // 2.  NAVIGASIKAN KE DATABASE 'hoteldb' ANDA.
        // 3.  BUKA TABEL 'users'.
        // 4.  LIHAT KOLOM 'id' DARI PENGGUNA YANG SUDAH TERDAFTAR DI SANA.
        //     Contoh: Jika Anda melihat ada pengguna dengan ID '5' atau '10' atau '12',
        //     CATAT ANGKA ID TERSEBUT.
        // 5.  JIKA TABEL 'users' ANDA KOSONG:
        //     Anda HARUS mendaftarkan setidaknya satu pengguna baru melalui halaman
        //     'Registrasi Akun' di aplikasi Anda terlebih dahulu. Setelah registrasi
        //     berhasil, periksa lagi tabel 'users' untuk mendapatkan ID pengguna yang baru dibuat.
        //
        // GANTI ANGKA '1' DI BAWAH INI DENGAN ID PENGGUNA YANG BENAR-BENAR ADA DI DATABASE ANDA.
        // Ini adalah placeholder sementara. NANTINYA, INI HARUS DIGANTI DENGAN
        // user_id NYATA YANG DIDAPAT DARI SISTEM AUTENTIKASI PENGGUNA YANG SEDANG LOGIN.
        // ======================================================================================
        user_id: 1, // <--- UBAH ANGKA INI SESUAI DENGAN ID PENGGUNA YANG ADA DI DATABASE ANDA
        room_id: roomId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        guest_name: formData.guest_name,
        request: formData.request,
        check_in: formData.check_in,
        check_out: formData.check_out,
        payment_status: formData.payment_status,
      };

      const res = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData);

      Alert.alert('Sukses', '✅ Pemesanan berhasil! Lanjut ke pembayaran.');
      
      navigation.navigate('PaymentDetail', {
        bookingId: res.data.data.id,
        roomId,
        roomName: name,
        price,
        image,
        checkin: res.data.data.check_in,
        checkout: res.data.data.check_out,
        name: res.data.data.name,
        phone: res.data.data.phone,
        email: res.data.data.email,
        guest: res.data.data.guest_name,
        request: res.data.data.request,
        payment_status: res.data.data.payment_status,
        totalPrice: res.data.data.total_price,
      });
    } catch (error) {
      console.error('❌ Error booking:', error?.response?.data || error.message);
      Alert.alert('Gagal', error.response?.data?.message || '❌ Pemesanan gagal! Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛏️ Form Pemesanan Kamar</Text>

      {image ? (
        <Image source={{ uri: image }} style={styles.roomImage} />
      ) : (
        <View style={styles.roomImagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      <Text style={styles.roomTitle}>{name}</Text>
      <Text style={styles.price}>Harga: Rp {price?.toLocaleString('id-ID')}</Text>

      <TextInput
        placeholder="Nama Pemesan"
        style={styles.input}
        value={formData.name}
        onChangeText={(v) => handleChange('name', v)}
      />
      <TextInput
        placeholder="Nomor HP"
        style={styles.input}
        value={formData.phone}
        onChangeText={(v) => handleChange('phone', v)}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(v) => handleChange('email', v)}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Nama Tamu"
        style={styles.input}
        value={formData.guest_name}
        onChangeText={(v) => handleChange('guest_name', v)}
      />
      <TextInput
        placeholder="Permintaan Khusus (Opsional)"
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        multiline
        value={formData.request}
        onChangeText={(v) => handleChange('request', v)}
      />

      <Text style={styles.label}>Tanggal Check-in</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowCheckIn(true)}
      >
        <Text style={formData.check_in ? styles.dateText : styles.datePlaceholderText}>
          {formData.check_in || 'Pilih Tanggal Check-in'}
        </Text>
      </TouchableOpacity>

      {showCheckIn && (
        <DateTimePicker
          mode="date"
          value={formData.check_in ? new Date(formData.check_in) : new Date()}
          display="default"
          onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'check_in')}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Tanggal Check-out</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowCheckOut(true)}
      >
        <Text style={formData.check_out ? styles.dateText : styles.datePlaceholderText}>
          {formData.check_out || 'Pilih Tanggal Check-out'}
        </Text>
      </TouchableOpacity>

      {showCheckOut && (
        <DateTimePicker
          mode="date"
          value={formData.check_out ? new Date(formData.check_out) : new Date()}
          display="default"
          onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'check_out')}
          minimumDate={formData.check_in ? new Date(formData.check_in) : new Date()}
        />
      )}

      <Text style={styles.label}>Status Pembayaran</Text>
      <View style={styles.selectRow}>
        <TouchableOpacity
          style={[styles.paymentButton, formData.payment_status === 'DP' && styles.paymentButtonActive]}
          onPress={() => handleChange('payment_status', 'DP')}
        >
          <Text style={[styles.paymentButtonText, formData.payment_status === 'DP' && styles.paymentButtonTextActive]}>DP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, formData.payment_status === 'LUNAS' && styles.paymentButtonActive]}
          onPress={() => handleChange('payment_status', 'LUNAS')}
        >
          <Text style={[styles.paymentButtonText, formData.payment_status === 'LUNAS' && styles.paymentButtonTextActive]}>Lunas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.agreementRow}
        onPress={() => handleChange('agreement', !formData.agreement)}
      >
        <Text>{formData.agreement ? '✅' : '⬜'} Saya menyetujui syarat & ketentuan</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Lanjut ke Pembayaran</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  roomImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: { // Changed from roomImagePlaceholderText to imagePlaceholderText
    color: '#888',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#0077cc',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    justifyContent: 'center',
    minHeight: 45,
  },
  dateText: {
    color: '#000',
  },
  datePlaceholderText: {
    color: '#888',
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    gap: 10,
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0077cc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  paymentButtonActive: {
    backgroundColor: '#0077cc',
  },
  paymentButtonText: {
    color: '#0077cc',
    fontWeight: 'bold',
  },
  paymentButtonTextActive: {
    color: '#fff',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
