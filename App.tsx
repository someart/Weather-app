import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Animated } from 'react-native';
import axios from 'axios';

// Define the WeatherResponse interface for TypeScript
interface WeatherResponse {
  main?: {
    temp?: number; // Temperature in Celsius
  };
  name: string; // City name
  weather: Array<{ description: string }>; // Weather description (e.g., "clear sky")
}
const App = () => {
  const [city, setCity] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation state for fading elements
  const [slideAnim] = useState(new Animated.Value(-200)); // Animation state for sliding suggestions
  const [pulseAnim] = useState(new Animated.Value(1)); // Animation state for pulsing button

  const openCageApiKey = '3b92ecf1996049f3966ddd08d1903f17'; // Your OpenCage API Key
  const openWeatherMapApiKey = '6a256601c607904a537f72b8e8b7a1f5'; // Your OpenWeatherMap API Key

  const openWeatherMapUrl = latitude && longitude 
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=metric` 
    : ''; // Only set URL if coordinates are available

  // Fetch Weather Data from OpenWeatherMap
  const fetchWeather = async () => {
    if (!latitude || !longitude) {
      setError('Please select a city first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(openWeatherMapUrl);

      if (response.data && response.data.main && response.data.weather) {
        setWeather(response.data);
      } else {
        setError('Weather data is unavailable. Please try again.');
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    }

    setLoading(false);

    // Fade in the weather data when it's available
    Animated.timing(fadeAnim, {
      toValue: 1,  // Target value for the opacity
      duration: 500,  // Animation duration (milliseconds)
      useNativeDriver: true,
    }).start();
  };

  // Fetch City Suggestions based on user input
  const fetchCitySuggestions = async (input: string) => {
    if (input.length < 3) return;

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${openCageApiKey}&no_annotations=1`);
      const suggestions = response.data.results.map((item: { formatted: string }) => item.formatted);
      setCitySuggestions(suggestions);

      // Slide in city suggestions when data is available
      Animated.timing(slideAnim, {
        toValue: 0,  // Target value for sliding to 0
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setCitySuggestions([]);
    }
  };

  // Handle city selection from suggestions
  const handleCitySelection = (selectedCity: string) => {
    setCity(selectedCity);
    setCitySuggestions([]);
    fetchCoordinates(selectedCity);
  };

  // Fetch coordinates (latitude and longitude) for the selected city
  const fetchCoordinates = async (selectedCity: string) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${selectedCity}&key=${openCageApiKey}`);
      const { lat, lng } = response.data.results[0]?.geometry ?? {};
      if (lat && lng) {
        setLatitude(lat);
        setLongitude(lng);
      } else {
        setError('Coordinates for the selected city are unavailable.');
      }
    } catch (err) {
      setError('Failed to fetch coordinates. Please try again.');
    }
  };

  // Pulsing animation for the "Get Weather" button
  const handleButtonPressIn = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1, // Slightly increase the size
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1, // Return to normal size
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (weather) {
      Animated.timing(fadeAnim, {
        toValue: 1,  // Make it fully visible
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [weather]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={(text) => {
          setCity(text);
          fetchCitySuggestions(text);
        }}
      />
      
      {citySuggestions.length > 0 && (
        <Animated.View style={[styles.suggestionsContainer, { transform: [{ translateY: slideAnim }] }]}>
          <FlatList
            data={citySuggestions}
            renderItem={({ item }: { item: string }) => (
              <View style={styles.suggestionItem}>
                <Text style={styles.suggestionText} onPress={() => handleCitySelection(item)}>
                  {item}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </Animated.View>
      )}
      
      <Animated.View>
        <Button 
          title="Get Weather" 
          onPress={fetchWeather} 
        />
      </Animated.View>

      {loading && <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>Loading...</Animated.Text>}
      {error && <Animated.Text style={[styles.error, { opacity: fadeAnim }]}>{error}</Animated.Text>}

      {weather && (
        <Animated.View style={[styles.weatherInfo, { opacity: fadeAnim }]}>
          <Text style={styles.weatherText}>Current temperature in {city}:</Text>
          <Text style={styles.weatherText}>
            {weather.main?.temp !== undefined ? weather.main.temp : 'N/A'}°C
          </Text>
          <Text style={styles.weatherText}>Weather: {weather.weather[0]?.description || 'N/A'}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    margin: 10,
    width: 200,
  },
  suggestionsContainer: {
    maxHeight: 200, // Ensure the suggestion list is scrollable
    width: 200,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#f1f1f1',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
  },
  weatherInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  error: {
    color: 'red',
  },
});

export default App;
