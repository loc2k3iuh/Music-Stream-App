import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Thay đổi sang FontAwesome
import Choice from './Choice';

import axios from 'axios';

const MusicLibrary = ({ navigation }) => {

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadSongs = async () => {      
      try {
          const response = await axios.get(`https://fimflex.com/api/soundtech/feed`);
          setSongs(response.data);
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
    };

    loadSongs();
  }, []);

  const renderSongItem = ({ item }) => (
    <TouchableOpacity style={styles.songContainer} onPress={() => handleSongPress(item)}>
      <Image source={{uri:item.thumbnail}} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artists_info.map((artist) => artist.name).join(', ')}</Text>
        <View style={styles.songViewsDuration}>
          <Text style={styles.songViews}>{item.viewer}</Text>
          <Text style={styles.songDuration}>5:12</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Icon name="heart" size={24} color="#1DB954" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleSongPress = (song) => {
    navigation.navigate('Home', { screen: 'Song', params: { song } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Thư viện</Text>
      <Choice navigation={navigation} />
      {loading ? (
      <Text>Đang tải...</Text>  // Hiển thị khi đang tải dữ liệu
      ) : (
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 5,
  },
  songTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#888',
    fontSize: 12,
  },
  songViewsDuration: {
    flexDirection: 'row',
  },
  songViews: {
    color: '#888',
    fontSize: 10,
    marginRight: 10,
  },
  songDuration: {
    color: '#888',
    fontSize: 10,
  },
});

export default MusicLibrary;