import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapComponent = Platform.select({
  web: () => require('./WebMap').default,
  default: () => MapView,
})();

export type Place = {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type MapProps = {
  children?: React.ReactNode;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
  places?: Place[];
  onPlaceSelect?: (place: Place) => void;
};

export default function Map({ children, initialRegion, style, places, onPlaceSelect }: MapProps) {
  if (Platform.OS === 'web') {
    return (
      <MapComponent
        style={[styles.map, style]}
        initialRegion={initialRegion}
        places={places}
        onPlaceSelect={onPlaceSelect}
      />
    );
  }

  return (
    <MapComponent
      style={[styles.map, style]}
      initialRegion={initialRegion}
    >
      {places?.map((place) => (
        <Marker
          key={place.id}
          coordinate={place.location}
          title={place.name}
          onPress={() => onPlaceSelect?.(place)}
        />
      ))}
      {children}
    </MapComponent>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});