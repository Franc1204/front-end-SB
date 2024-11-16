import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/MenuBar'; 

export default function ProfileScreen({ navigation }) {
  const [recommendedAlbums, setRecommendedAlbums] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  const fetchRecommendedAlbums = () => {
    const albums = [
      { id: 1, title: 'After Hours', coverImage: require('../assets/after.jpeg') },
      { id: 2, title: 'Disco', coverImage: require('../assets/disco.jpeg') },
      { id: 3, title: 'Folklore', coverImage: require('../assets/folklore.jpeg') },
      { id: 4, title: 'OSCURO EXTASIS', coverImage: require('../assets/oscuro.jpeg') },
      { id: 5, title: 'Vultures 1', coverImage: require('../assets/vultures.jpeg') },
    ];

    setRecommendedAlbums(albums); 
  };

  const fetchFavoriteSongs = () => {
    const songs = [
      { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', coverImage: require('../assets/after.jpeg') },
      { id: 2, title: 'Levitating', artist: 'Dua Lipa', coverImage: require('../assets/disco.jpeg') },
      { id: 3, title: 'Cardigan', artist: 'Taylor Swift', coverImage: require('../assets/folklore.jpeg') },
      { id: 4, title: 'Circles', artist: 'Post Malone', coverImage: require('../assets/oscuro.jpeg') },
      { id: 5, title: 'Save Your Tears', artist: 'The Weeknd', coverImage: require('../assets/after.jpeg') },
      { id: 6, title: 'Don’t Start Now', artist: 'Dua Lipa', coverImage: require('../assets/disco.jpeg') },
    ];

    setFavoriteSongs(songs);
  };

  useEffect(() => {
    fetchRecommendedAlbums();
    fetchFavoriteSongs();
  }, []);

  const renderAlbumItem = ({ item }) => (
    <TouchableOpacity style={styles.carouselItem}>
      <Image source={item.coverImage} style={styles.albumImage} />
      <Text style={styles.albumTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Image source={item.coverImage} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    </View>
  );

  const ListHeader = () => (
    <>
      <View style={styles.topRectangle}>
        {/* Imagen de perfil y nombre dentro del rectángulo */}
        <View style={styles.profileInfoContainer}>
          <Image 
            source={require('../assets/naruto.png')} 
            style={styles.profileImage}
          />
          <Text style={styles.userName}>story</Text>
        </View>
      </View>

      {/* Título de Albums */}
      <Text style={styles.albumsTitle}>My Albums</Text>

      {/* Carrusel de álbumes recomendados */}
      <FlatList
        data={recommendedAlbums}
        renderItem={renderAlbumItem}
        keyExtractor={(item) => item.id.toString()}  
        horizontal={true}  
        showsHorizontalScrollIndicator={false}  
        contentContainerStyle={styles.carouselContainer}  
        snapToAlignment="center"  
        snapToInterval={180}  
        decelerationRate="fast" 
      />

      <Text style={styles.songsTitle}>My Songs</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={ListHeader}
        data={favoriteSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.menuContainer}>
        <MenuBar activeTab="ProfileScreen" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171515',
  },
  listContainer: {
    paddingBottom: 30,
  },
  topRectangle: {
    width: '100%',
    height: 228,
    backgroundColor: '#35323285', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 55, 
    zIndex: 1,  
  },
  profileInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, 
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  albumsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 15
  },
  songsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15, 
    marginLeft: 15
  },
  carouselContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  carouselItem: {
    alignItems: 'center',
    marginHorizontal: 10,  
    width: 160,
  },
  albumImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    marginBottom: -10,
  },
  albumTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 5,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,  
  },
});
