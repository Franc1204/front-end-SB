import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native'; 

const MenuBar = () => {
  const navigation = useNavigation();
  const route = useRoute(); 

  // Función para determinar si un tab está activo
  const getIconColor = (tab) => (route.name === tab ? '#A071CA' : '#fff'); 

  return (
    <View style={styles.menuBar}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('HomeScreen')} 
      >
        <Icon
          name="home"
          size={24}
          color={getIconColor('HomeScreen')}
        />
        <Text style={[styles.menuText, { color: getIconColor('HomeScreen') }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Icon
          name="search"
          size={24}
          color={getIconColor('SearchScreen')}
        />
        <Text style={[styles.menuText, { color: getIconColor('SearchScreen') }]}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('ProfileScreen')} 
      >
        <Icon
          name="user"
          size={24}
          color={getIconColor('ProfileScreen')}
        />
        <Text style={[styles.menuText, { color: getIconColor('ProfileScreen') }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#353232', 
    height: 60,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    borderTopWidth: 0,
    zIndex: 999, 
  },
  menuItem: {
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default MenuBar;
