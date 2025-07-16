  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';

  import HomeScreen from '../screens/common/HomeScreen';
  import LoginScreen from '../screens/user/LoginScreen'
  import RegisterScreen from '../screens/user/RegisterScreen';
  import RoomsScreen from '../screens/user/RoomsScreen';
  import UserDashboardScreen from '../components/user/UserDashboardScreen';
  import BookingScreen from '../components/user/BookingScreen';
  import PaymentDetailScreen from '../components/user/PaymentDetailScreen';
  import Payment from '../screens/user/Payment';

  import AdminLoginScreen from '../components/admin/AdminLoginScreen';
  import AdminDashboardScreen from '../components/admin/AdminDashboardScreen';
  import AdminRoomsScreen from '../components/admin/AdminRoomsScreen';
  import AdminBookingsScreen from '../components/admin/AdminBookingsScreen';
  import AdminPaymentsScreen from '../components/admin/AdminPaymentsScreen';

  const Stack = createNativeStackNavigator();

  export default function AppNavigator() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginUser" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
          <Stack.Screen name="Rooms" component={RoomsScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="PaymentDetail" component={PaymentDetailScreen} />
          <Stack.Screen name="Payment" component={Payment} />

          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AdminRooms" component={AdminRoomsScreen} />
          <Stack.Screen name="AdminBookings" component={AdminBookingsScreen} />
          <Stack.Screen name="AdminPayments" component={AdminPaymentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
