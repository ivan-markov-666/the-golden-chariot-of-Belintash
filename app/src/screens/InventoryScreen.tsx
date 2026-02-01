import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Text, Button, Card } from '@/components/ui';
import { useTheme } from '@/theme/theme';

/**
 * Inventory Screen
 *
 * Displays inventory items in a grid and allows management
 * of equipment and consumables.
 */

interface Item {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  type: 'consumable' | 'equipment' | 'quest';
  slot?: 'head' | 'body' | 'weapon' | 'accessory';
  description?: string;
}

type InventoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const mockInventory: Item[] = [
  { id: '1', name: 'Зелена отвара', icon: '🧪', quantity: 3, type: 'consumable', description: 'Възстановява 20 здраве' },
  { id: '2', name: 'Железен меч', icon: '⚔️', quantity: 1, type: 'equipment', slot: 'weapon', description: 'Урон: 1d6' },
  { id: '3', name: 'Кожена броня', icon: '🛡️', quantity: 1, type: 'equipment', slot: 'body', description: 'Защита: +2' },
  { id: '4', name: 'Стар пергамент', icon: '📜', quantity: 1, type: 'quest', description: 'Карта на Белинташ' },
  { id: '5', name: 'Хляб', icon: '🥖', quantity: 5, type: 'consumable', description: 'Възстановява 5 здраве' },
  { id: '6', name: 'Златен пръстен', icon: '💍', quantity: 1, type: 'equipment', slot: 'accessory', description: '+1 късмет' },
  { id: '7', name: 'Сребърни монети', icon: '🪙', quantity: 50, type: 'consumable', description: 'Валута' },
];

export const InventoryScreen: React.FC = () => {
  const navigation = useNavigation<InventoryScreenNavigationProp>();
  const { theme } = useTheme();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [gold] = useState(125);

  const handleItemPress = (item: Item) => {
    setSelectedItem(item);
  };

  const handleUseItem = () => {
    if (selectedItem) {
      console.log('Using item:', selectedItem.name);
      setSelectedItem(null);
    }
  };

  const handleEquipItem = () => {
    if (selectedItem && selectedItem.type === 'equipment') {
      console.log('Equipping item:', selectedItem.name);
      setSelectedItem(null);
    }
  };

  const handleBack = () => {
    navigation.navigate('MainMenu');
  };

  const renderItem = (item: Item) => (
    <Pressable
      key={item.id}
      onPress={() => handleItemPress(item)}
      style={({ pressed }) => ({
        width: '30%',
        aspectRatio: 1,
        margin: '1.5%',
        backgroundColor: pressed ? theme.colors.surfaceLight : theme.colors.surface,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: selectedItem?.id === item.id ? 2 : 1,
        borderColor: selectedItem?.id === item.id ? theme.colors.primary : theme.colors.border,
      })}
    >
      <Text style={{ fontSize: 32 }}>{item.icon}</Text>
      <Text variant="caption" style={{ marginTop: 4, textAlign: 'center' }} numberOfLines={1}>
        {item.name}
      </Text>
      {item.quantity > 1 && (
        <View
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: theme.colors.primary,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
            {item.quantity}
          </Text>
        </View>
      )}
    </Pressable>
  );

  const renderItemDetails = () => {
    if (!selectedItem) return null;

    return (
      <Card variant="outlined" style={{ marginTop: 16, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 48, marginRight: 12 }}>{selectedItem.icon}</Text>
          <View>
            <Text variant="h4">{selectedItem.name}</Text>
            <Text variant="caption" color="textSecondary">
              {selectedItem.type === 'consumable' && 'Консуматив'}
              {selectedItem.type === 'equipment' && 'Екипировка'}
              {selectedItem.type === 'quest' && 'Куест'}
            </Text>
          </View>
        </View>
        
        {selectedItem.description && (
          <Text variant="body" style={{ marginBottom: 16 }}>
            {selectedItem.description}
          </Text>
        )}

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {selectedItem.type === 'consumable' && (
            <Button title="Използвай" variant="primary" onPress={handleUseItem} style={{ flex: 1 }} />
          )}
          {selectedItem.type === 'equipment' && selectedItem.slot && (
            <Button title="Екипирай" variant="primary" onPress={handleEquipItem} style={{ flex: 1 }} />
          )}
          <Button title="Затвори" variant="secondary" onPress={() => setSelectedItem(null)} style={{ flex: 1 }} />
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header with gold */}
        <Card variant="filled" style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3">Инвентар</Text>
            <Text variant="body" color="accent" bold>
              🪙 {gold} злато
            </Text>
          </View>
        </Card>

        {/* Inventory Grid */}
        <Card variant="outlined" style={{ padding: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {mockInventory.map(renderItem)}
          </View>
        </Card>

        {/* Item Details */}
        {renderItemDetails()}

        {/* Back Button */}
        <Button
          title="Назад"
          variant="secondary"
          onPress={handleBack}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});
