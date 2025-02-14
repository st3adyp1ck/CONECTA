import React from 'react';
import { View, StyleSheet } from 'react-native';
import GoogleMapReact from 'google-map-react';
import Colors from '@/constants/Colors';
import type { MapProps } from './Map';

type MarkerProps = {
  lat: number;
  lng: number;
  text: string;
};

const Marker = ({ text }: { text: string }) => (
  <div style={{
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    color: Colors.primary,
    background: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }}>
    {text}
  </div>
);

export default function WebMap({ style, places, initialRegion, onPlaceSelect }: MapProps) {
  const defaultProps = {
    center: {
      lat: initialRegion?.latitude || 16.7370,
      lng: initialRegion?.longitude || -92.6376
    },
    zoom: 14
  };

  return (
    <View style={[styles.container, style]}>
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }} // Add your Google Maps API key here
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'all',
                stylers: [
                  { saturation: -100 },
                  { lightness: 50 }
                ]
              }
            ]
          }}
        >
          {places?.map((place) => (
            <Marker
              key={place.id}
              lat={place.location.latitude}
              lng={place.location.longitude}
              text={place.name}
            />
          ))}
        </GoogleMapReact>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 8,
  },
});