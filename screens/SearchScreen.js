import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  ScrollView 
} from 'react-native';
import SearchBar from '../components/SearchBar';
import MenuBar from '../components/MenuBar';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Albums');

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const categories = ['Albums', 'Songs', 'Profiles', 'Artists', 'Playlists'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Contenido Principal */}
        <View style={styles.mainContent}>
          <View style={styles.centerContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/Logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.searchContainer}>
              <SearchBar 
                searchQuery={searchQuery} 
                handleSearchChange={handleSearchChange} 
              />
            </View>

            <View style={styles.categoriesWrapper}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesRow}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    style={styles.categoryItem}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category && styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {searchQuery.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.result}>Buscando: {searchQuery}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MenuBar Fijo al fondo */}
      <MenuBar activeTab="SearchScreen" />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#171515',
  },
  container: {
    flex: 1,
    backgroundColor: '#171515',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: 80, 
  },
  centerContent: {
    width: '100%', 
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 20,
  },
  categoriesWrapper: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    minWidth: '100%',
  },
  categoryItem: {
    width: 75,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#A071CA',
    fontWeight: 'bold',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  result: {
    color: '#fff',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: '#A071CA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 30,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuBarContainer: {
    height: 60,
    backgroundColor: '#171515',
  },
});
