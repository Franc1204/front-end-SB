import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AlbumDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [tracks, setTracks] = useState([]);  // Estado para almacenar las canciones del álbum
  const [isLoading, setIsLoading] = useState(true);

  // Recibir los datos del álbum a través de la navegación
  const { album } = route.params;

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp'
  });

  // Obtener las canciones del álbum
  useEffect(() => {
    const fetchAlbumTracks = async () => {
      try {
        const token = ''; 
        const response = await axios.get(`http://192.168.1.70:5000/album_tracks`, {
          params: {
            album_id: album.id  
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTracks(response.data.tracks);
      } catch (error) {
        console.error("Error al obtener las canciones del álbum:", error);
        alert("Hubo un problema al cargar las canciones del álbum. Por favor, intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumTracks();
  }, [album]);

  // Función para manejar el envío de un comentario
  const handleAddComment = () => {
    if (comment.trim().length > 0) {
      setComments([...comments, comment.trim()]);
      setComment('');
    }
  };

  // Función para abrir el modal de calificación
  const handleRateAlbum = () => {
    setRatingModalVisible(true);
  };

  // Función para confirmar la calificación
  const confirmRating = () => {
    setRatingModalVisible(false);
    Alert.alert("Thank you!", `You rated this album ${rating} stars.`);
  };

  // Renderizar una tarjeta de canción
  const renderSongCard = (song, index) => (
    <View key={index} style={styles.songCard}>
      <View style={styles.songHeader}>
        <Text style={styles.songTitle}>{song.name}</Text>
        <Text style={styles.songDuration}>{formatDuration(song.duration_ms)}</Text>
      </View>
      {song.preview_url && (
        <TouchableOpacity style={styles.playTrackButton} onPress={() => handlePlayTrack(song.preview_url)}>
          <Text style={styles.playTrackText}>Play Track</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayTrack = (previewUrl) => {
    Alert.alert("Playing Track", `Preview URL: ${previewUrl}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#171515' }]}>
        <ActivityIndicator size="large" color="#A071CA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Efecto de iluminación de fondo */}
      <View style={styles.backgroundGlow}>
        <Image 
          source={album.imageSource} 
          style={styles.blurredBackground}
          blurRadius={50}
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
        {/* Imagen de portada del álbum */}
        <Animated.View style={[
          styles.albumCoverContainer,
          { transform: [{ scale: imageScale }] }
        ]}>
          <Image source={album.imageSource} style={styles.albumCover} />
        </Animated.View>

        <View style={styles.contentContainer}>
          <Text style={styles.albumTitle}>{album.title}</Text>

          {/* Nombre del artista como botón */}
          <TouchableOpacity onPress={() => navigation.navigate('ArtistDetailsScreen', { artist: album.artist })}>
            <Text style={styles.artistName}>{album.artist}</Text>
          </TouchableOpacity>

          {/* Descripción */}
          <Text style={styles.albumDescription}>{album.description}</Text>

          {/* Calificar el álbum */}
          <TouchableOpacity style={styles.rateButton} onPress={handleRateAlbum}>
            <Text style={styles.rateButtonText}>Rate Album</Text>
          </TouchableOpacity>

          {/* Canciones del álbum */}
          {tracks.length > 0 && (
            <>
              <Text style={styles.songListTitle}>Songs</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.songsScrollView}
              >
                {tracks.map((song, index) => renderSongCard(song, index))}
              </ScrollView>
            </>
          )}

          {/* Comentarios */}
          <Text style={styles.commentsTitle}>Comments</Text>
          <View style={styles.commentsContainer}>
            {comments.map((item, index) => (
              <View key={index} style={styles.comment}>
                <Text style={styles.commentText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Leave a comment..."
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
              <Text style={styles.addCommentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playButtonText}>Play Album</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.favoriteButton}>
              <Text style={styles.favoriteButtonText}>♥ Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Modal para calificar el álbum */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rate this Album</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => setRating(value)}>
                  <Icon
                    name="star"
                    size={30}
                    color={value <= rating ? '#FFD700' : '#C0C0C0'}
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmRatingButton} onPress={confirmRating}>
              <Text style={styles.confirmRatingButtonText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  albumCoverContainer: {
    height: screenHeight * 0.5,
    width: '100%',
    marginTop: -50,
  },
  albumCover: {
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
  albumTitle: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artistName: {
    fontSize: 18,
    color: '#A071CA',
    marginBottom: 20,
  },
  albumDescription: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 20,
  },
  rateButton: {
    backgroundColor: '#A071CA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  rateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songListTitle: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  songsScrollView: {
    marginBottom: 30,
  },
  songCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: screenWidth * 0.75,
  },
  songHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  songDuration: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.6,
  },
  songLyrics: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 15,
  },
  playTrackButton: {
    backgroundColor: 'rgba(160, 113, 202, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  playTrackText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  commentsTitle: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentsContainer: {
    marginBottom: 20,
  },
  comment: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  commentText: {
    color: '#FFF',
    fontSize: 14,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  addCommentButton: {
    backgroundColor: '#A071CA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  addCommentButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  confirmRatingButton: {
    backgroundColor: '#A071CA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  confirmRatingButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  actionButtons: {
    marginTop: 20,
  },
  playButton: {
    backgroundColor: '#A071CA',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 20,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    paddingVertical: 15,
    backgroundColor: 'rgba(136, 136, 136, 0.5)',
    alignItems: 'center',
    borderRadius: 30,
  },
  favoriteButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AlbumDetailsScreen;
