
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.text}>Activity</Text>
      <Text style={styles.subtext}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.border,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});