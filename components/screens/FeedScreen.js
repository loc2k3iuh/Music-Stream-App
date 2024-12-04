import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

{/* Font Awesome 5 */}
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faCircle, faHeart, faRssSquare, faEllipsisH, faRandom, faPlay, faPause, faCheckCircle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartO, faComment as faCommentO } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

import { setPaused } from '../tools/actions';

const ArtistScreen = ({ route }) => {

    const dispatch = useDispatch();
    const currentSong = useSelector((state) => state.currentSong);
    const isPaused = useSelector((state) => state.isPaused);
    const duration = useSelector((state) => state.duration);
    const position = useSelector((state) => state.position);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const navigation = useNavigation();
    const { top, right, bottom, left } = useSafeAreaInsets();

    const loadData = async () => {
      if (loading) return;
      setLoading(true);
      
      try {
          const response = await axios.get(`https://fimflex.com/api/soundtech/feed?page=${page}`);
          setData(prevData => [...prevData, ...response.data]);
          setPage(prevPage => prevPage + 1);
      } catch (error) {
          
      } finally {
          setLoading(false);
      }
    };


    useEffect(() => {
      loadData();
    }, []);

    const renderFeedItem = ({ item }) => (
      <View style={{ marginVertical: 10, marginHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            
              <Image source={{ uri: item.artists_info[0].avatar }} style={{height:30,width:30,marginRight:10,borderRadius: 25}} />
                <View>
                    <Text style={{ fontWeight: 'bold', color: '#000' }} >
                        {item && item.artists_info.length > 0 ? item.artists_info[0].name : 'Unknown Artist'} <FontAwesomeIcon icon={faCheckCircle} size={10} color="blue" />
                    </Text>
                    <Text style={{ color: 'gray', fontSize: 10 }}>
                        Đã đăng bài hát mới  {}
                    </Text>
                </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Song', params: { song: item } })}>
                <ImageBackground source={{uri: item.thumbnail}}
                          style={{
                              width: '100%',
                              height: 350,
                              marginTop: 15,
                              borderRadius: 10
                          }}
                      >
                          <View style={{
                              padding: 15,
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              left: 0,
                          }}>
                              <Text style={{
                                  color: 'white',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                              }}>{item.title}</Text>
                              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5,}}>
                                  <Text style={{
                                      color: 'white',
                                      flex: 1,
                                      marginRight: 10,
                                  }}>
                                      {item.artists_info.map((artist) => artist.name).join(', ')}
                                  </Text>
                                  <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{ fontSize: 10, color: 'white', marginRight: 10 }}>
                                        <FontAwesomeIcon icon={faPlay} size={10} color="white" /> {item.viewer}
                                    </Text>
                                    <Text style={{ fontSize: 10, color: 'white', flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesomeIcon icon={faCircle} size={5} color="white" />
                                        <Text style={{ marginLeft: 5 }}> 5:12</Text>
                                    </Text>
                                </View>
                              </View>
                          </View>
                </ImageBackground>
                </TouchableOpacity>
        <View style={{marginTop:10,flexDirection:'row',justifyContent:'flex-start', gap: 15}}>
          <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', gap: 5}}>
            <FontAwesomeIcon icon={faHeartO} size={13} color="#333" />
            <Text style={{fontSize:13}}>20</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', gap: 5}}>
            <FontAwesomeIcon icon={faCommentO} size={13} color="#333" />
            <Text style={{fontSize:13}}>19</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', gap: 5}}>
            <FontAwesomeIcon icon={faRefresh} size={13} color="#333" />
            <Text style={{fontSize:13}}>1</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    const handleSongPress = (song) => {
        navigation.navigate('Home', { screen: 'Song', params: { song } });
    };

    const handlePlayPausePress = () => {
        dispatch(setPaused(!isPaused));
    };

    const memoizedData = useMemo(() => data, [data]);

    if(loading) {
      return <Text>Đang tải</Text>
    }

    return (
        <SafeAreaView style={[styles.container,{
            marginTop: top,
            marginRight: right,
            marginBottom: bottom,
            marginLeft: left
        }]}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.headerTitle}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <FontAwesomeIcon icon={faRssSquare} size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {data.length > 0 ?

            <FlatList
              showsVerticalScrollIndicator={false}
              data={data && data.length > 0 ? memoizedData : []}
              renderItem={({ item }) => {
                return renderFeedItem({ item });  
              }}
              keyExtractor={item => item.id.toString()}
              onEndReached={loadData}
              onEndReachedThreshold={0.5}
            />

          : <Text>Không có dữ liệu</Text>
          }


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
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 10,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
},
headerTitle: {
  fontSize:18,
  fontWeight: 'bold',
}
});

export default ArtistScreen;