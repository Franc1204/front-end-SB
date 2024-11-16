import React from 'react';
import { TextInput, StyleSheet } from 'react-native';


const SearchBar = ({ searchQuery, handleSearchChange }) => {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder="What are you looking for?"
      placeholderTextColor="#B0B0B0" 
      value={searchQuery}
      onChangeText={handleSearchChange}
      keyboardAppearance='dark'
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 15,
  },
});

export default SearchBar;
