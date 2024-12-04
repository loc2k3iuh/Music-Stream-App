import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

{/* Font Awesome 5 */}
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faCircle, faHeart, faRssSquare, faEllipsisH, faRandom, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartO } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

import { setPaused } from '../tools/actions';

const SearchScreen = ({ route }) => {

    const dispatch = useDispatch();
    const currentSong = useSelector((state) => state.currentSong);
    const isPaused = useSelector((state) => state.isPaused);
    const duration = useSelector((state) => state.duration);
    const position = useSelector((state) => state.position);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const navigation = useNavigation();
    const { top, right, bottom, left } = useSafeAreaInsets();

    const filterOptions = {
      'Tất cả': 'all',
      'Bài hát': 'songs',
      'Album': 'albums',
      'Nghệ sĩ': 'artists',
    };

    useEffect(() => {



    }, []);

    const fetchSuggestions = (text) => {
        if (text.length === 0) {
            setSuggestions([]);
            return;
        }

        axios.get(`https://fimflex.com/api/soundtech/search?query=${text}`).then((response) => {
            setSuggestions(response.data);
        }).catch((error) => {
            console.error('Error fetching suggestions:', error);
        });
    }

    const SongCard = ({ item }) => {
      return (
          <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(item)}>
              <View style={styles.leftItem}>
                  <Image source={{ uri: item.thumbnail }} style={styles.imageSong} />
                  <View style={styles.infomationItem}>
                      <Text style={styles.titleItem}>{item.title}</Text>
                      <Text style={styles.artistItem} numberOfLines={1} ellipsizeMode="tail">
                    {item.artists_info.map((artist) => artist.name).join(', ')}
                      </Text>
                  </View>
              </View>
              <View style={styles.rightItem}>
                  <FontAwesomeIcon icon={faEllipsisH} size={14} color="#333" />
              </View>
          </TouchableOpacity>
      );
  };

  const ArtistCard = ({ item }) => {
    return (
        <TouchableOpacity style={styles.songItem} onPress={() => handleArtistPress(item.id)}>
            <View style={[styles.leftItem,{width:'78%'}]}>
                <Image source={{ uri: item.avatar }} style={styles.imageArtist} />
                <View style={styles.infomationItem}>
                    <Text style={styles.titleItem}>{item.name}</Text>
                    <Text style={styles.artistItem} numberOfLines={1} ellipsizeMode="tail">1.23K Followers</Text>
                </View>
            </View>
            <View style={{marginRight: 20}}>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.buttonText}>Follow</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

    const AlbumsCard = ({ item }) => {
      return (
          <TouchableOpacity style={styles.songItem} onPress={() => handleAlbumPress(item)}>
              <View style={styles.leftItem}>
                  <Image source={{ uri: item.thumbnail }} style={styles.imageSong} />
                  <View style={styles.infomationItem}>
                      <Text style={styles.titleItem}>{item.title}</Text>
                      <Text style={styles.artistItem} numberOfLines={1} ellipsizeMode="tail">
                    {item.artists_info.map((artist) => artist.name).join(', ')}
                      </Text>
                  </View>
              </View>
              <View style={styles.rightItem}>
                  <FontAwesomeIcon icon={faEllipsisH} size={14} color="#333" />
              </View>
          </TouchableOpacity>
      );
  };

      const handleSearchChange = (text) => {
        setQuery(text);
        fetchSuggestions(text);
        setShowSuggestions(text.length > 0);
      };

      const handleSearch = () => {
        axios.get(`https://fimflex.com/api/soundtech/search?query=${query}`).then((response) => {
          setResults(response.data.data);
        }).catch((error) => {
          console.error('Error fetching search results:', error);
        });

        setShowSuggestions(false);
      };

      const filteredResults = filter === 'all' ? results : results.filter(item => item.type === filter);

      const handleAlbumPress = (album) => {
        navigation.navigate('Home', { screen: 'Album', params: { album } });
        setQuery('');
        setResults([]);
      };

      const handleArtistPress = (artistId) => {
        navigation.navigate('Home', { screen: 'Artist', params: { artistId } });
        setQuery('');
        setResults([]);
      };

    const handleSongPress = (song) => {
        navigation.navigate('Home', { screen: 'Song', params: { song } });
        setQuery('');
        setResults([]);
    };

    const handlePlayPausePress = () => {
        dispatch(setPaused(!isPaused));
    };

    return (
        <SafeAreaView style={[styles.container,{
            marginTop: top,
            marginRight: right,
            marginBottom: bottom,
            marginLeft: left
        }]}>

          <View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={query}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSearch}
            />
            {showSuggestions && query.length > 0 && (
                <FlatList 
                    data={suggestions.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                          setQuery(item.name ? item.name : item.title);
                          handleSearch();
                      }}>
                            <Text style={styles.suggestion}>{item.name?item.name:item.title}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{minHeight: '100%'}}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
            <View style={styles.filterContainer}>
              {Object.entries(filterOptions).map(([displayName, value]) => (
                  <TouchableOpacity key={value} onPress={() => setFilter(value)}>
                      <Text style={[styles.filter, filter === value && styles.activeFilter]}>
                          {displayName}
                      </Text>
                  </TouchableOpacity>
              ))}
            </View>
            {filteredResults.length > 0 ? (
            <FlatList
                data={filteredResults}
                contentContainerStyle={styles.containerCard}
                renderItem={({ item }) => (
                  <>
                    {item.type === 'songs' && <SongCard key={item.id} item={item} />}
                    {item.type === 'artists' && <ArtistCard key={item.id} item={item} />}
                    {item.type === 'albums' && <AlbumsCard key={item.id} item={item} />}
                    </>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            ) : (
            <Text style={{marginVertical:10,marginHorizontal:20}}>{query.length>0?'Không có kết quả tìm kiếm phù hợp':'Bạn chưa nhập tìm kiếm.'}</Text>
            )}

            </View>


{ currentSong!=null ? (
          <>
          
          <View style={styles.songContainer}>
            <View style={styles.songLeft}>
              <Image source={{uri: currentSong.thumbnail}} style={styles.thumbnailSong} />
              <View style={styles.songInfomation}>
                <Text style={styles.songTitle} onPress={() => handleSongPress(currentSong)} numberOfLines={1} ellipsizeMode="tail">{currentSong.title}</Text>
                <Text style={styles.songArtist}>{currentSong.artists_info.map((artist) => artist.name).join(', ')}</Text>
              </View>
            </View>
            <View style={styles.songRight}>
              <TouchableOpacity
                  style={styles.controlButton}
              >
                  <FontAwesomeIcon icon={faHeart} style={styles.controlIcon} size={15} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButtonMain} onPress={handlePlayPausePress}>
                  {isPaused ? (
                      <FontAwesomeIcon icon={faPlay} style={styles.controlIcon} size={23} />
                  ):(
                      <FontAwesomeIcon icon={faPause} style={styles.controlIcon} size={23} />
                  )}
              </TouchableOpacity>
            </View>
          </View>
          </>
        ):(
          <>
          </>
        ) }

        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
  searchInput: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginHorizontal: 20,
  },
  suggestion: {
      padding: 10,
      borderBottomColor: '#eee',
      borderBottomWidth: 1,
      marginHorizontal: 20,
  },
  filterContainer: {
      flexDirection: 'row',
      marginVertical: 10,
      marginHorizontal: 20,
  },
  filter: {
      marginRight: 10,
      fontWeight: 'bold',
  },
  activeFilter: {
      color: 'blue',
  },
  resultItem: {
      padding: 15,
      borderBottomColor: '#eee',
      borderBottomWidth: 1,
  },
  resultName: {
      fontSize: 18,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    height: 50,
},
leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
},
imageSong: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 3,
},
infomationItem: {
    justifyContent: 'center',
    width: '70%',
},
titleItem: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
},
artistItem: {
    fontSize: 12,
    color: '#333',
    maxWidth: '100%',
},
rightItem: {
    justifyContent: 'center',
},
containerCard: {
  marginHorizontal: 20,
  flexGrow: 1
},
imageArtist: {
  width: 50,
  height: 50,
  borderRadius: 25,
},
artistFollow: {
  borderWidth: 1,
  borderColor: '#333',
  padding: 5,
  fontSize: 12,
  marginRight: 20,
},
followButton: {
  borderColor: '#c7cacf',
  borderWidth: 1,
  borderRadius: 30,
  paddingVertical: 5,
  paddingHorizontal: 20,
  alignItems: 'center',
},
buttonText: {
  color: '#c7cacf',
  fontWeight: 'bold',
  fontSize: 12,
},
songContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#222',
  height: 70,
  paddingHorizontal: 10,
  position: 'absolute', 
  bottom: 0, 
  left: 0,
  right: 0, 
  elevation: 5,
},
thumbnailSong: {
  height: 50,
  width: 50,
  borderRadius: 10,
  marginRight: 16,
},
songLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
songInfomation: {
  flexDirection: 'column',
  justifyContent: 'center'
},
songTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#fff',
  width: '80%',
},
songArtist: {
  fontSize: 12,
  color: '#ccc',
},
songRight: {
  flexDirection: 'row',
  marginLeft: 'auto',
  alignContent: 'center',
  alignItems: 'center',
  gap: 15,
  marginRight: 16,
},
controlIcon: {
  color: '#fff',
},
container: {
  flex: 1,
  backgroundColor: '#fff'
},
});

export default SearchScreen;