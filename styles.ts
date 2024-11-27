// styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center', // Center the content vertically
  },
  searchContainer: {
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    justifyContent: 'center', // Center the search bar horizontally
  },
  input: {
    color: '#ffffff',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    fontFamily: 'monospace',
    maxWidth: 200, // Adjust input size
    marginRight: 10,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  suggestionText: {
    padding: 5,
    fontSize: 16,
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  currentInfoContainer: {
    color: '#ffffff',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentDay: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  currentTime: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'monospace',
  },
  weatherContainer: {
    color: '#ffffff',
    alignItems: 'center',
    marginTop: 20,
  },
  cityName: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#37718e',
  },
  weatherType: {
    fontSize: 20,
    color: '#ffffff',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  extraInfo: {
    marginTop: 10,
    color: '#ffffff',
  },
  infoText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});

export default styles;
