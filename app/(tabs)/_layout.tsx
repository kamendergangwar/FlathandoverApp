import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Search, Chrome as Home, User, FileText } from 'lucide-react-native';
import LoginIcon from '../components/LoginIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <LoginIcon width={focused ? 28 : 24} height={focused ? 14 : 12} fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <LoginIcon width={focused ? 28 : 24} height={focused ? 14 : 12} fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <LoginIcon width={focused ? 28 : 24} height={focused ? 14 : 12} fill={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <LoginIcon width={focused ? 28 : 24} height={focused ? 14 : 12} fill={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}