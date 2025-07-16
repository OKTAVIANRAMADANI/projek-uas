import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ImageBackground } from 'react-native';

export default function UserDashboardScreen({ navigation }) {
  const currentYear = new Date().getFullYear();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section with Image */}
      <ImageBackground
        source={require('../../assets/images/hotel.jpg')}
        style={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Selamat Datang di Grand Lux Hotel</Text>
          <Text style={styles.heroSubtitle}>
            Tempat terbaik untuk kenyamanan, liburan, dan perjalanan bisnis Anda.
          </Text>
          <View style={styles.heroButton}>
            <Button title="Lihat Kamar" onPress={() => navigation.navigate('Rooms')} />
          </View>
        </View>
      </ImageBackground>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Mengapa Memilih Kami?</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🛏️ Kamar Nyaman</Text>
            <Text style={styles.featureDesc}>
              Fasilitas modern dengan pemandangan menakjubkan.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📶 Wi-Fi Gratis</Text>
            <Text style={styles.featureDesc}>
              Akses internet cepat di seluruh hotel.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🍽️ Restoran Mewah</Text>
            <Text style={styles.featureDesc}>
              Sajian internasional dari chef terbaik.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {currentYear} Grand Lux Hotel. All rights reserved.
        </Text>
        <Text style={styles.footerText}>
          Jl. Raya Liburan No. 99, Bali, Indonesia | Telp: (0361) 1234567
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
  },
  heroImage: {
    width: '100%',
    height: 700,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    zIndex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  featuresSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 40,
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 15,
  },
  featureCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
