import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MessageCircle, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorSchema } from '@/hooks/useColorScheme';
export default function Header() {
  const { colors } = useColorSchema();
  const router = useRouter();

  const handleMessages = () => {
    router.push('/messages');
  };

  const handleNotifications = () => {
    console.log('Navigate to notifications');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: colors.text }]}>LOOKYM</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleNotifications}>
          <Bell size={24} color={colors.text} />
          <View style={[styles.badge, { backgroundColor: colors.error }]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleMessages}>
          <MessageCircle size={24} color={colors.text} />
          <View style={[styles.badge, { backgroundColor: colors.error }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 20,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 20,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});