import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../components/LoadingScreen';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ArtistDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  // Obtener el nombre del artista de la ruta
  const { artist } = route.params;

  // Estado para guardar la data del artista
  const [artistData, setArtistData] = useState(null);
  
  // Estado para el control de la carga de imágenes
  const [loadingArtistImage, setLoadingArtistImage] = useState(true);
  const [loadingAlbumImages, setLoadingAlbumImages] = useState([]);

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp'
  });

  const renderAlbumCard = (album, index) => (
    <View key={index} style={styles.albumCard}>
      {loadingAlbumImages[index] && (
        <ActivityIndicator size="small" color="#A071CA" style={styles.albumImageLoader} />
      )}
      <Image 
        source={{ uri: album.image || 'https://via.placeholder.com/150' }}  // Imagen predeterminada
        style={styles.albumImage}
        onLoadStart={() => {
          let newLoadingState = [...loadingAlbumImages];
          newLoadingState[index] = true;
          setLoadingAlbumImages(newLoadingState);
        }}
        onLoadEnd={() => {
          let newLoadingState = [...loadingAlbumImages];
          newLoadingState[index] = false;
          setLoadingAlbumImages(newLoadingState);
        }}
      />
      <Text style={styles.albumTitle}>{album.title}</Text>
      <Text style={styles.albumReleaseDate}>{album.release_date}</Text>
    </View>
  );

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const token = ''; 

        const response = await axios.get(`http://192.168.1.70:5000/artist_details`, {
          params: {
            name: artist,  
            cacheBust: new Date().getTime()  
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Respuesta del backend:', response.data); 

    
        setArtistData(response.data);

        // Inicializa los estados de carga de las imágenes de los álbumes
        setLoadingAlbumImages(new Array(response.data.albums.length).fill(true));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        alert("Hubo un problema al cargar los datos del artista. Por favor, intenta nuevamente.");
      }
    };

    fetchArtistData();
  }, [artist]);

  if (!artistData) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Mostrar solo si artistData está disponible */}
      <>
        {/* Efecto de iluminación de fondo */}
        <View style={styles.backgroundGlow}>
          {loadingArtistImage && (
            <ActivityIndicator size="large" color="#A071CA" style={styles.artistImageLoader} />
          )}
          <Image 
            source={{ uri: artistData.artist.image || 'https://via.placeholder.com/500' }}  
            style={styles.blurredBackground}
            blurRadius={50}
            onLoadStart={() => setLoadingArtistImage(true)}
            onLoadEnd={() => setLoadingArtistImage(false)}
          />
        </View>

        
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="times" size={30} color="#FFF" />
        </TouchableOpacity>

        <Animated.ScrollView 
          style={styles.scrollContainer}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          {/* Imagen del artista */}
          <Animated.View style={[
            styles.artistImageContainer,
            { transform: [{ scale: imageScale }] }
          ]}>
            {loadingArtistImage && (
              <ActivityIndicator size="large" color="#A071CA" style={styles.artistImageLoader} />
            )}
            <Image 
              source={{ uri: artistData.artist.image || 'https://via.placeholder.com/500' }}  
              style={styles.artistImage}
              onLoadStart={() => setLoadingArtistImage(true)}
              onLoadEnd={() => setLoadingArtistImage(false)}
            />
          </Animated.View>

          <View style={styles.contentContainer}>
            {/* Nombre del artista */}
            <Text style={styles.artistName}>{artistData.artist.name}</Text>

            {/* Biografía */}
            <Text style={styles.biography}>
              {artistData.artist.biography || 'Biografía no disponible'}
            </Text>

            {/* Álbumes en scroll horizontal */}
            <Text style={styles.albumsListTitle}>Albums</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.albumsScrollView}
            >
              {artistData.albums?.map((album, index) => renderAlbumCard(album, index))}
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow Artist</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  blurredBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  artistImageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  artistImageContainer: {
    height: screenHeight * 0.5,
    width: '100%',
    marginTop: -50,
  },
  artistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'rgba(23, 21, 21, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  artistName: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  biography: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 20,
  },
  albumsListTitle: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  albumsScrollView: {
    marginBottom: 30,
  },
  albumCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    width: screenWidth * 0.5,
    alignItems: 'center',
  },
  albumImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  albumImageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
    zIndex: 2,
  },
  albumTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  albumReleaseDate: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.6,
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  followButton: {
    backgroundColor: '#A071CA',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 30,
    width: '45%',
  },
  followButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: 'rgba(136, 136, 136, 0.5)',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 30,
    width: '45%',
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArtistDetailsScreen;
