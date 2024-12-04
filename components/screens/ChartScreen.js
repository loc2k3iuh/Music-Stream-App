import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

{/* Font Awesome 5 */}
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faCircle, faHeart, faRssSquare, faEllipsisH, faRandom, faPlay, faHome, faSearch, faUserCircle, faBookOpen, faPause } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartO } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

import { setPaused } from '../tools/actions';

const AlbumScreen = ({ route }) => {

    const dispatch = useDispatch();
    const currentSong = useSelector((state) => state.currentSong);
    const isPaused = useSelector((state) => state.isPaused);
    const duration = useSelector((state) => state.duration);
    const position = useSelector((state) => state.position);

    const { chart } = route.params;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const { top, right, bottom, left } = useSafeAreaInsets();

    useEffect(() => {

        fetchAlbumData = async () => {
            try {
                const response = await axios.get(`https://fimflex.com/api/soundtech/chart/${chart.id}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching album data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumData();

    }, []);

    const SongCard = ({ item }) => {
        return (
            <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(item)}>
                <View style={styles.leftItem}>
                    <Image source={{ uri: item.thumbnail }} style={styles.imageSong} />
                    <View style={styles.infomationItem}>
                        <Text style={styles.titleItem}>{item.title}</Text>
                        <Text style={styles.artistItem}>
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

    const handleSongPress = (song) => {
        navigation.navigate('Song', { song });
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faAngleLeft} size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesomeIcon icon={faRssSquare} size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.containerAlbum}>
                <View style={styles.albumLeft}>
                    <Image source={{ uri: chart.thumbnail }} style={styles.image} />
                </View>
                <View style={styles.albumRight}>
                    <Text style={styles.title}>{chart.title}</Text>
                    <View style={styles.infomation}>
                        <Text style={styles.heartAlbum}>
                            435
                        </Text>
                        <FontAwesomeIcon icon={faCircle} size={5} color="#333" />
                        <Text style={styles.durationTotal}>
                            2:00:00
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.toolAlbum}>
                <View style={styles.leftTool}>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faHeartO} size={14} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faEllipsisH} size={14} color="#333" />
                    </TouchableOpacity>
                </View>
                <View style={styles.rightTool}>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faRandom} size={14} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faPlay} size={14} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

        <FlatList
            data={data.song_info}
            renderItem={SongCard}
            contentContainerStyle={styles.containerCard}
            horizontal={false}
            showsVerticalScrollIndicator={false}
        />

{ currentSong!=null ? (
          <>
          
          <View style={styles.songContainer}>
            <View style={styles.songLeft}>
              <Image source={{uri: currentSong.thumbnail}} style={styles.thumbnailSong} />
              <View style={styles.songInfomation}>
                <Text style={styles.songTitle} onPress={() => handleSongPress(currentSong)}>{currentSong.title}</Text>
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
<<<<<<< HEAD

        <View style={styles.footer}>
            <View style={styles.footerItem}>
                <FontAwesomeIcon icon={faHome} style={[styles.footerIcon, styles.footerIconActive]} />
                <Text style={[styles.footerText,styles.footerIconActive]}>Trang chủ</Text>
            </View>
            <View style={styles.footerItem}>
                <FontAwesomeIcon icon={faSearch} style={styles.footerIcon} />
                <Text style={styles.footerText}>Tìm kiếm</Text>
            </View>
            <View style={styles.footerItem}>
                <FontAwesomeIcon icon={faUserCircle} style={styles.footerIcon} />
                <Text style={styles.footerText}>Feed</Text>
            </View>
            <View style={styles.footerItem}>
                <FontAwesomeIcon icon={faBookOpen} style={styles.footerIcon} />
                <Text style={styles.footerText}>Thư viện</Text>
            </View>
        </View>
=======
>>>>>>> origin/khang
            
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
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
    containerAlbum: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 10
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5
    }, 
    albumRight: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    infomation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    durationTotal: {
        fontSize: 12,
    },
    heartAlbum: {
        fontSize: 12,
    },
    artist: {
        marginTop: 5,
        fontSize: 14,
    },
    toolAlbum: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20
    },
    leftTool: {
        flexDirection: 'row',
        gap: 20
    },
    rightTool: {
        flexDirection: 'row',
        gap: 20
    },
    imageSong: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 3
    },
    songItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
        height: 50
    },
    containerCard: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingBottom: 20,
        flexGrow: 1
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f2f2f2'
    },
    footerItem: {
        alignItems: 'center',
    },
    footerIcon: {
        width: 24,
        height: 24,
        marginBottom: 4,
    },
    footerIconActive: {
        color: '#19b3c2',
    },
    footerText: {
        fontSize: 12,
    },
    leftItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    infomationItem: {
        justifyContent: 'center'
    },
    titleItem: {
        fontSize: 14,
        color: '#000',
        marginBottom: 5
    },
    songContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
<<<<<<< HEAD
        display: 'flex',
        backgroundColor: '#222',
        height: 70
=======
        backgroundColor: '#222',
        height: 70,
        paddingHorizontal: 10,
        position: 'absolute', // Đặt vị trí tuyệt đối để ghim ở dưới cùng
        bottom: 0,
        left: 0,
        right: 0, // Đảm bảo chiếm toàn bộ chiều ngang
        elevation: 5, // Thêm độ bóng cho container
>>>>>>> origin/khang
    },
    thumbnailSong: {
        height: 50,
        width: 50,
        borderRadius: 10,
<<<<<<< HEAD
        marginHorizontal: 16,
      },
=======
        marginRight: 16,
    },
>>>>>>> origin/khang
      songLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        display: 'flex',
      },
      songRight: {
        flexDirection: 'row',
        marginLeft: 'auto',
        alignContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginRight: 16,
      },
      songInfomation: {
        display: 'flex',
        flexDirection: 'column',
      },
      songTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      songArtist: {
        fontSize: 12,
        color: '#ccc',
      },
      controlIcon: {
        color: '#fff',
      },
      artistItem: {
        fontSize: 12,
        color: '#333'
      }
});

export default AlbumScreen;