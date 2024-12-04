import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

{/* Font Awesome 5 */}
import Icon from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';

const ListLibrary = ({ navigation, route }) => {
  const { name } = route.params;

  const { top, right, bottom, left } = useSafeAreaInsets();

  const [data, setData] = useState([]);

useEffect(() => {
    const fetchSuggestions = async () => {
        try {
            const response = await axios.get('https://fimflex.com/api/soundtech/suggestion');
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        };

        fetchSuggestions();
    }, []);

  const renderSongItem = ({ item }) => (
    <View style={styles.songContainer}>
      <Image source={{uri: item.thumbnail}} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: '#000' }]}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artists_info.map((artist) => artist.name).join(', ')}</Text>
        <View style={styles.songViewsDuration}>
          <Text style={styles.songViews}>{item.viewer}</Text>
          <Text style={styles.songDuration}>5:12</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Icon name="chevron-right" size={24} color={'#000'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container,{
        marginTop: top,
        marginRight: right,
        marginBottom: bottom,
        marginLeft: left
    }]}>
    <View style={[styles.container]}>
    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
      <Text style={{ fontSize: 20, color: '#000' }}>Feed</Text>
      <Icon name="tv" size={24} color="gray" />
    </View>
      <Text style={[styles.headerText, { color: '#000' }]}>{name}</Text>
      <FlatList
        data={data}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 13,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#888',
  },
  songViewsDuration: {
    flexDirection: 'row',
  },
  songViews: {
    color: '#888',
    fontSize: 12,
    marginRight: 10,
  },
  songDuration: {
    color: '#888',
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListLibrary;