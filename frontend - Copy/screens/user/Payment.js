import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator, // Ditambahkan untuk loading
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios'; // Ditambahkan untuk panggilan API

export default function Payment({ route, navigation }) {
  // Terima semua data yang dikirim PaymentDetailScreen
  const {
    bookingId, 
    roomId,
    roomName,
    price, // Harga per malam (bukan total)
    image,
    checkin,
    checkout,
    name, // Nama Pemesan
    phone,
    email,
    guest, // Nama Tamu
    request,
    payment_status, // Status pembayaran yang dipilih di BookingScreen (DP/LUNAS)
    totalPrice, // <<< Total harga yang dihitung backend
  } = route.params || {}; // Tambahkan default {} untuk route.params

  const [duration, setDuration] = useState(1);
  const [selectedBank, setSelectedBank] = useState('BRI');
  const [rekening, setRekening] = useState({
    nama: 'TVLK BRI',
    nomor: '222222226669948',
  });
  const [loading, setLoading] = useState(false);

  // PENTING: ALAMAT BASE URL TELAH DIUBAH KE PORT 5000
  // Gunakan alamat IP lokal komputer Anda (192.168.1.11)
  // Atau, jika Anda menggunakan emulator Android, Anda bisa menggunakan 'http://10.0.2.2:5000'
  const API_BASE_URL = 'http://192.168.1.11:5000'; 

  const bankList = {
    Qris: { nama: 'TVLK QRIS', nomor: 'QRIS123456' },
    BCA: { nama: 'TVLK BCA', nomor: '1234567890' },
    BRI: { nama: 'TVLK BRI', nomor: '222222226669948' },
    Mandiri: { nama: 'TVLK Mandiri', nomor: '9876543210' },
    BNI: { nama: 'TVLK BNI', nomor: '1122334455' },
  };

  useEffect(() => {
    if (checkin && checkout) {
      const d1 = new Date(checkin);
      const d2 = new Date(checkout);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      setDuration(diff > 0 ? diff : 1);
    }
  }, [checkin, checkout]);

  useEffect(() => {
    setRekening(bankList[selectedBank]);
  }, [selectedBank]);

  const totalFinal = totalPrice; // Menggunakan totalPrice yang diterima dari props

  const handleCopy = async () => {
    await Clipboard.setStringAsync(rekening.nomor);
    Alert.alert('✅ Nomor rekening disalin!');
  };

  const handleFinish = async () => {
    setLoading(true);

    try {
      // Data yang akan dikirim ke endpoint pembayaran di backend
      const paymentData = {
        booking_id: bookingId,
        room: roomName,
        name: name,
        guest_name: guest || '', // Menggunakan 'guest' dari props, tambahkan fallback jika undefined
        email: email,
        check_in: checkin,
        check_out: checkout,
        duration: duration,
        request: request,
        price: price, // Harga per malam
        total: totalFinal, // Menggunakan totalFinal (yang merupakan totalPrice dari props)
        
        // PERBAIKAN DI SINI: Menambahkan 'bank' dan 'rekening' sebagai top-level fields
        // sesuai dengan yang diharapkan oleh validasi di paymentController.js
        bank: selectedBank, // Mengirim nama bank yang dipilih (misal: "BRI")
        rekening: rekening.nomor, // Mengirim nomor rekening sebagai string

        // Field-field ini juga dikirim karena backend menggunakannya untuk Payment.create
        rekening_name: rekening.nama, // Nama pemilik rekening (misal: "TVLK BRI")
        rekening_number: rekening.nomor, // Nomor rekening (misal: "2222...")
        method: selectedBank, // Metode pembayaran (misal: "BRI")
        status: 'Pending', // Status awal pembayaran
        image: image || null, // URL gambar, tambahkan fallback jika undefined
      };

      const res = await axios.post(`${API_BASE_URL}/api/payments`, paymentData);

      Alert.alert(
        '✅ Pembayaran dikonfirmasi',
        `Terima kasih sudah transfer ke ${selectedBank}\nTotal: Rp ${totalFinal?.toLocaleString('id-ID')}\nTransaksi ID: ${res.data.data.id}`,
        [
          {
            text: 'Selesai',
            onPress: () => navigation.navigate('UserDashboard'),
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error confirming payment:', error?.response?.data || error.message);
      Alert.alert('Gagal', error.response?.data?.message || '❌ Konfirmasi pembayaran gagal! Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💳 Pembayaran</Text>

      <Text style={styles.label}>Metode Pembayaran</Text>
      {Object.keys(bankList).map((bank) => (
        <TouchableOpacity
          key={bank}
          style={[
            styles.bankOption,
            selectedBank === bank && styles.selectedBank,
          ]}
          onPress={() => setSelectedBank(bank)}
        >
          <Text style={selectedBank === bank ? styles.selectedText : styles.bankText}>
            {bank}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Transfer ke</Text>
      <View style={styles.transferRow}>
        <TextInput value={rekening.nama} editable={false} style={styles.input} />
        <Text style={styles.bankNameText}>{selectedBank}</Text> 
      </View>
      <View style={styles.transferRow}>
        <TextInput value={rekening.nomor} editable={false} style={styles.input} />
        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Text style={styles.copyText}>Salin</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Jumlah Bayar</Text>
      <TextInput
        value={`Rp ${totalFinal?.toLocaleString('id-ID')}`} 
        editable={false}
        style={styles.input}
      />

      <Text style={styles.label}>Nama Pemesan</Text>
      <TextInput value={name} editable={false} style={styles.input} />

      <Text style={styles.label}>Email Pemesan</Text>
      <TextInput value={email} editable={false} style={styles.input} />

      <TouchableOpacity 
        style={styles.finishButton} 
        onPress={handleFinish}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.finishText}>Saya Sudah Transfer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  bankOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    borderRadius: 8,
  },
  selectedBank: {
    backgroundColor: '#0077cc',
  },
  bankText: { color: '#000' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
  },
  copyButton: {
    backgroundColor: '#0077cc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  copyText: { color: '#fff', fontWeight: 'bold' },
  finishButton: {
    marginTop: 24,
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
  },
  finishText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  bankNameText: { 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
