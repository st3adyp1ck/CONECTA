import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/Colors';

export default function ExploreScreen() {
  const { t } = useTranslation();

  const featuredEvents = [
    {
      id: '1',
      title: 'Live Music at Café Bar Revolución',
      time: '20:00',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000',
    },
    {
      id: '2',
      title: 'Artisan Market at Plaza de la Paz',
      time: '10:00 - 18:00',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('featuredNow')}</Text>
      </View>
      
      <View style={styles.eventsContainer}>
        {featuredEvents.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  eventsContainer: {
    padding: 15,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
});