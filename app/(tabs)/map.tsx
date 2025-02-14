import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/Colors';
import Map from '@/components/Map';
import type { Place } from '@/components/Map';

export default function MapScreen() {
  const { t } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const places = [
    {
      id: '1',
      name: 'Café Bar Revolución',
      location: { latitude: 16.7370, longitude: -92.6376 },
      category: 'cafe',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Plaza de la Paz',
      location: { latitude: 16.7380, longitude: -92.6386 },
      category: 'landmark',
      rating: 4.8,
    },
  ];

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        initialRegion={{
          latitude: 16.7370,
          longitude: -92.6376,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        places={places}
        onPlaceSelect={setSelectedPlace}
      />
      
      <ScrollView style={styles.placesList}>
        {places.map((place) => (
          <TouchableOpacity
            key={place.id}
            style={[
              styles.placeCard,
              selectedPlace?.id === place.id && styles.selectedCard
            ]}
            onPress={() => setSelectedPlace(place)}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeRating}>★ {place.rating}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  placesList: {
    maxHeight: 200,
    backgroundColor: Colors.background,
  },
  placeCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#f0f0f0',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  placeRating: {
    fontSize: 14,
    color: '#666',
  },
});