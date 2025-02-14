import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/Colors';

export default function TransportScreen() {
  const { t } = useTranslation();

  const routes = [
    {
      id: '1',
      name: 'Ruta 1',
      color: Colors.primary,
      stops: ['Centro', 'Mercado', 'Hospital', 'Universidad'],
    },
    {
      id: '2',
      name: 'Ruta 2',
      color: Colors.secondary,
      stops: ['Periférico', 'Mercado', 'Zona Norte', 'Terminal'],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <Svg height="400" width="100%">
          {/* This is a simplified example. You'll need to add the actual route paths */}
          <Path
            d="M50,50 L150,50 L150,150 L250,150"
            stroke={Colors.primary}
            strokeWidth="4"
            fill="none"
          />
          <Path
            d="M50,200 L150,200 L150,300 L250,300"
            stroke={Colors.secondary}
            strokeWidth="4"
            fill="none"
          />
          {/* Add stops as circles */}
          <Circle cx="50" cy="50" r="5" fill={Colors.primary} />
          <Circle cx="150" cy="50" r="5" fill={Colors.primary} />
          <Circle cx="150" cy="150" r="5" fill={Colors.primary} />
          <Circle cx="250" cy="150" r="5" fill={Colors.primary} />
        </Svg>
      </View>

      <View style={styles.routesList}>
        {routes.map((route) => (
          <View key={route.id} style={styles.routeCard}>
            <View style={[styles.routeIndicator, { backgroundColor: route.color }]} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{route.name}</Text>
              <Text style={styles.routeStops}>
                {route.stops.join(' → ')}
              </Text>
            </View>
          </View>
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
  mapContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  routesList: {
    padding: 15,
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  routeIndicator: {
    width: 8,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  routeStops: {
    fontSize: 14,
    color: '#666',
  },
});