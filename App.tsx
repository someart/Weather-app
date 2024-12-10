import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import styles from './styles'; 

// time and day
const formatTime = (date: Date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) hours = `0${hours}` as any as number;
  if (minutes < 10) minutes = `0${minutes}` as any as number;
  return `${hours}:${minutes}`;
};

const formatDay = (date: Date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

// App Component
const App = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]); // New state for suggestions

  // Current time and day
  const [currentTime, setCurrentTime] = useState<string>(formatTime(new Date()));
  const [currentDay, setCurrentDay] = useState<string>(formatDay(new Date()));

  useEffect(() => {
    //time update  minute
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDay(formatDay(now));
    }, 60000);

    return () => clearInterval(interval); 
  }, []);

  //OpenCage API lel geocoding and OpenWeatherMap API for weather
  const fetchWeather = async (cityName: string) => {
    const openCageApiKey = '3b92ecf1996049f3966ddd08d1903f17'; // Your OpenCage API Key
    const openWeatherMapApiKey = '6a256601c607904a537f72b8e8b7a1f5'; // Your OpenWeatherMap API Key

    setLoading(true);
    setError(null);

    try {
      const geocodeResponse = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityName)}&key=${openCageApiKey}`
      );

      if (geocodeResponse.data.results.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lng } = geocodeResponse.data.results[0].geometry;

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${openWeatherMapApiKey}`
      );

      setWeather(weatherResponse.data);
    } catch (err) {
      setError('Unable to fetch weather for the entered city. Please try again.');
      setWeather(null);
    }
    setLoading(false);
  };

  //  city suggestions 
  const fetchSuggestions = async (input: string) => {
    const openCageApiKey = '3b92ecf1996049f3966ddd08d1903f17'; // Your OpenCage API Key

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(input)}&key=${openCageApiKey}`
      );
      setSuggestions(response.data.results);
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleCityChange = (text: string) => {
    setCity(text);
    if (text.length > 2) { //  suggestions after 2 or more characters
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  // city suggestion click
  const handleSuggestionSelect = (city: string) => {
    setCity(city);
    fetchWeather(city); 
    setSuggestions([]); 
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city.trim());
    } else {
      setError('Please enter a city name.');
    }
  };

  return (
    <ImageBackground 
      source={require('./assets/images/ll.gif')}
      style={styles.container}
    >

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          value={city}
          onChangeText={handleCityChange}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      {/* Display Error */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Display Suggestions */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionSelect(item.formatted)}>
              <Text style={styles.suggestionText}>{item.formatted}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Display Current Time and Day */}
      <View style={styles.currentInfoContainer}>
        <Text style={styles.currentDay}>{currentDay}</Text>
        <Text style={styles.currentTime}>{currentTime}</Text>
      </View>

      {/* Display Weather Info */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        weather && (
          <View style={styles.weatherContainer}>
            <Text style={styles.cityName}>{weather.name}</Text>
            <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
            <Text style={styles.weatherType}>{weather.weather[0].main}</Text>
            <View style={styles.extraInfo}>
              <Text style={styles.infoText}>Humidity: {weather.main.humidity}%</Text>
              <Text style={styles.infoText}>Wind: {Math.round(weather.wind.speed)} km/h</Text>
            </View>
          </View>
        )
      )}
    </ImageBackground>
  );
};

export default App;
