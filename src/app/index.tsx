import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProjectScreen {
  id: string;
  title: string;
  description: string;
  route: string;
}

const SCREENS: ProjectScreen[] = [
  {
    id: '1',
    title: 'Anchor (Sea)',
    description: 'Cinematic entry with parallax background video, physical haptics, and custom portal transitions.',
    route: '/(sea)/sea',
  },
  {
    id: '2',
    title: 'Apple Invites',
    description: 'Premium card invitations interaction layout.',
    route: '/(apple)/appleInvites',
  },
];

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePress = (route: string) => {
    router.push(route as any);
  };

  const renderItem = ({ item }: { item: ProjectScreen }) => (
    <Pressable
      onPress={() => handlePress(item.route)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Animations</Text>
        <Text style={styles.subtitle}>Select an interaction prototype below</Text>
      </View>

      <FlatList
        data={SCREENS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 15,
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flex: 1,
    paddingRight: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    lineHeight: 18,
  },
  arrow: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 20,
    fontWeight: '600',
  },
});