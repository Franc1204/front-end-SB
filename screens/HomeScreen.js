import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  RefreshControl 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import axios from 'axios';
import MenuBar from '../components/MenuBar';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../components/LoadingScreen';

const DATA = [
  { label: "New Album", title: "Short n' Sweet", artist: "Sabrina Carpenter", imageSource: require('../assets/sabrina.png') },
  { label: "Popular Album", title: "Vultures 1", artist: "Kanye West", imageSource: require('../assets/vultures.jpeg') },
  { label: "UTOPIA", title: "UTOPIA", artist: "Travis Scott", imageSource: require('../assets/travis.png') },
];

const VIDEOS_DATA = [
  { title: "Live Concert", artist: "Tame Impala", imageSource: require('../assets/joji.jpg') },
  { title: "Music Video", artist: "Drake", imageSource: require('../assets/billie.jpg') },
  { title: "Behind the Scenes", artist: "Cardi B", imageSource: require('../assets/ariana.jpg') },
];

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("News");
  const [activeIndex, setActiveIndex] = useState(0);
  const [newsData, setNewsData] = useState([]);
  const [artistsData, setArtistsData] = useState([]);
  const [videosData, setVideosData] = useState(VIDEOS_DATA); 
  const [recommendationsData, setRecommendationsData] = useState([
    { 
      id: 1,
      name: "Song 1", 
      artist: "Artist 1", 
      duration: "3:45", 
      coverImage: require('../assets/joji.jpg'), 
      liked: false
    },
    { 
      id: 2,
      name: "Song 2", 
      artist: "Artist 2", 
      duration: "4:20", 
      coverImage: require('../assets/ariana.jpg'), 
      liked: false
    },
    { 
      id: 3,
      name: "Song 3", 
      artist: "Artist 3", 
      duration: "2:50", 
      coverImage: require('../assets/billie.jpg'), 
      liked: false
    },
  ]); // Datos de canciones recomendadas, hasta ahora estaticos.
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tabData, setTabData] = useState([]);
  const carouselRef = useRef();
  const tabScrollViewRef = useRef();
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const scaleAnims = useRef(new Array(10).fill(null).map(() => new Animated.Value(1))).current;

  const nav = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = ""; 

        const [albumsResponse, artistsResponse] = await Promise.all([
          axios.get('http://192.168.1.70:5000/top_albums_global', {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          }),
          axios.get('http://192.168.1.70:5000/top_artists_global', {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          })
        ]);

        const formattedNewsData = albumsResponse.data.albums.slice(0, 10).map(album => ({
          title: album.name,
          artist: album.artist.join(', '),
          imageSource: album.cover_image ? { uri: album.cover_image } : require('../assets/joji.jpg')
        }));
        setNewsData(formattedNewsData);

        const formattedArtistsData = artistsResponse.data.artists.slice(0, 10).map(artist => ({
          name: artist.name,
          genres: artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : null, // Si no hay géneros
          imageSource: artist.image ? { uri: artist.image } : require('../assets/joji.jpg'),
        }));
        setArtistsData(formattedArtistsData);

        setTabData(formattedNewsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cambiar datos según la pestaña activa
  useEffect(() => {
    if (activeTab === "News") {
      setTabData(newsData);
    } else if (activeTab === "Videos") {
      setTabData(videosData);
    } else if (activeTab === "Artist") {
      setTabData(artistsData);
    }
  }, [activeTab, newsData, artistsData, videosData]);

  const handleTabPress = (tab, index) => {
    setActiveTab(tab);
    setActiveIndex(0);
    Animated.spring(indicatorAnim, {
      toValue: index * (screenWidth / 3),
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();

    if (tabScrollViewRef.current) {
      tabScrollViewRef.current.scrollTo({ x: 0, animated: false });
    }
  };

  const toggleLike = (songId) => {
    setRecommendationsData(prevData =>
      prevData.map(song =>
        song.id === songId ? { ...song, liked: !song.liked } : song
      )
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Carrusel de hasta arriba (Datos Estáticos) */}
        <ScrollView
          horizontal
          pagingEnabled
          ref={carouselRef}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={screenWidth - 60}
          contentContainerStyle={styles.carouselContainer}
        >
          {DATA.map((item, index) => (
            <View key={index} style={[styles.albumSection, { width: screenWidth - 60 }]}>
              <View style={styles.albumInfo}>
                <Text style={styles.albumLabel}>{item.label}</Text>
                <Text style={styles.albumTitle}>{item.title}</Text>
                <Text style={styles.albumArtist}>{item.artist}</Text>
              </View>
              <View style={styles.albumImageContainer}>
                <Image source={item.imageSource} style={styles.albumImage} />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Tabs de News, Videos y Artist */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            {["News", "Videos", "Artist"].map((tab, index) => (
              <TouchableOpacity key={tab} onPress={() => handleTabPress(tab, index)} style={styles.tabButton}>
                <Text style={[styles.tab, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: indicatorAnim }] }]} />
        </View>

        {/* Carrusel de la pestaña activa (News, Videos o Artist) */}
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.artistsContainer}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            >
            {tabData.map((item, index) => (
                <TouchableOpacity key={index} style={styles.artistCard}>
                <Image source={item.imageSource} style={styles.artistImage} />
                {/* Mostrar el título del álbum o el nombre del artista */}
                <Text style={styles.artistCardTitle}>{item.title || item.name}</Text>
                {/* Mostrar el artista si estamos en la pestaña "News" */}
                {activeTab === "News" && item.artist && (
                    <Text style={styles.artistCardName}>{item.artist}</Text>
                )}
                </TouchableOpacity>
            ))}
        </ScrollView>


        {/* Canciones Recomendadas */}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendationsData.map((song, index) => (
              <View key={index} style={styles.songCard}>
                <Image source={song.coverImage} style={styles.songImage} />
                <View style={styles.songInfoContainer}>
                  <View style={styles.songDetails}>
                    <Text style={styles.songTitle}>{song.name}</Text>
                    <Text style={styles.songArtist}>{song.artist}</Text>
                    <Text style={styles.songDuration}>{song.duration}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleLike(song.id)}>
                    <Icon 
                      name="heart" 
                      size={24} 
                      color={song.liked ? '#A071CA' : '#FFF'} 
                      style={styles.heartIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {isLoggedIn && <MenuBar activeTab={activeTab} onNavigate={handleTabPress} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#171515' 
  },
  contentContainer: { 
    paddingVertical: 10 
  },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 10,
    zIndex: 1,
  },
  logo: { 
    width: 50, 
    height: 50 
  },
  carouselContainer: { 
    alignItems: 'center'
  },
  albumSection: { 
    height: 130,  
    backgroundColor: '#A071CA', 
    borderRadius: 20, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    position: 'relative', 
    overflow: 'hidden', 
    marginHorizontal: 10,
  },
  albumInfo: { 
    flex: 1, 
    paddingRight: 80, 
    paddingLeft: 10 
  },
  albumLabel: { 
    color: '#FFF', 
    fontSize: 14, 
    opacity: 0.7, 
    textAlign: 'left' 
  },
  albumTitle: { 
    color: '#FFF', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginTop: 10 
  },
  albumArtist: { 
    color: '#FFF', 
    fontSize: 12, 
    marginTop: 5, 
    opacity: 0.6 
  },
  albumImageContainer: { 
    position: 'absolute', 
    right: -30,
    top: -10,
    overflow: 'hidden', 
    zIndex: 2
  },
  albumImage: { 
    width: 190,
    height: 200,
    zIndex: 3, 
    resizeMode: 'contain',
    borderRadius: 10 
  },
  albumImage: { 
    width: 190,
    height: 200,
    zIndex: 3, 
    resizeMode: 'contain',
    borderRadius: 10 
  },
  tabsContainer: { 
    marginTop: 20, 
    marginBottom: 10, 
    position: 'relative' 
  },
  tabsWrapper: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  tabButton: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 10 
  },
  tab: { 
    color: '#FFF', 
    fontSize: 25, 
    fontWeight: 'bold', 
    opacity: 0.9 
  },
  activeTabText: { 
    color: '#A071CA' 
  },
  tabIndicator: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    width: screenWidth / 3, 
    height: 3, 
    backgroundColor: '#A071CA', 
    borderRadius: 2 
  },
  artistsContainer: { 
    marginTop: 20, 
    marginBottom: 20 
  },
  artistCard: { 
    width: screenWidth / 3, 
    marginRight: 20 
  },
  artistImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 30 
  },
  artistCardTitle: { 
    color: '#FFF', 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 5 
  },
  artistCardName: { 
    color: '#FFF', 
    fontSize: 12, 
    opacity: 0.7 
  },
  recommendationsContainer: { 
    marginVertical: 20 
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  songCard: { 
    width: screenWidth / 1.5, 
    marginRight: 15, 
    backgroundColor: '#2A2A2A', 
    borderRadius: 15, 
    padding: 10,
    flexDirection: 'row', 
    alignItems: 'center'
  },
  songImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 10 
  },
  songInfoContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  songDetails: {
    flex: 1
  },
  songTitle: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  songArtist: { 
    color: '#FFF', 
    fontSize: 14, 
    opacity: 0.7,
    marginTop: 5 
  },
  songDuration: { 
    color: '#FFF', 
    fontSize: 12, 
    opacity: 0.7, 
    marginTop: 5 
  },
  heartIcon: {
    marginLeft: 10
  }
});
