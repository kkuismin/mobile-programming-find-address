import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { API_KEY } from '@env';


export default function App() {

  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(60.170839);
  const [lng, setLng] = useState(24.941411);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLng(location.coords.longitude);
    })();
  }, []);

  const fetchAddress = async () => {

    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      setLat(json.results[0].locations[0].latLng.lat);
      setLng(json.results[0].locations[0].latLng.lng);
    } catch (error) {
      Alert.alert('Error');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView
        style={styles.map}
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
      >
        <Marker 
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}
        />
      </MapView>
      <TextInput
        style={styles.input}
        placeholder='Write an address'
        onChangeText={address => setAddress(address)}
        value={address}
      />
      <Button onPress={fetchAddress} title="Show" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: "100%",
    height: 600,
  },
  input: {
    width: "100%",
    borderColor: "lightgrey",
    borderWidth: 1,
    margin: 10,
    padding: 5,
    textAlign: "center",
  },
});
