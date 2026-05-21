import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#008080', // DropRoom Teal
        tabBarInactiveTintColor: '#9CA3AF',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { color: '#111827', fontWeight: 'bold' },
        headerShadowVisible: false, // Keeps it clean and flat
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'DropZone',
          tabBarIcon: ({ color }) => <FontAwesome name="comments" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}