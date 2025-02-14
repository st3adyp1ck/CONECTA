import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/Colors';

export default function CalendarScreen() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState('');

  const events = {
    '2024-01-20': [
      { id: '1', title: 'Live Music Night', time: '20:00', venue: 'Café Bar Revolución' },
    ],
    '2024-01-21': [
      { id: '2', title: 'Artisan Market', time: '10:00', venue: 'Plaza de la Paz' },
      { id: '3', title: 'Dance Workshop', time: '18:00', venue: 'Cultural Center' },
    ],
  };

  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: Colors.primary };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <RNCalendar
        style={styles.calendar}
        theme={{
          selectedDayBackgroundColor: Colors.primary,
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
        }}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
          },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      <ScrollView style={styles.eventsList}>
        {selectedDate && events[selectedDate]?.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventTime}>
              <Text style={styles.timeText}>{event.time}</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventVenue}>{event.venue}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // TODO: Implement add to calendar functionality
              }}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  calendar: {
    marginBottom: 10,
  },
  eventsList: {
    padding: 15,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  eventTime: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  timeText: {
    color: '#fff',
    fontWeight: '600',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventVenue: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});