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

const ArtistScreen = ({ route }) => {

    const dispatch = useDispatch();
    const currentSong = useSelector((state) => state.currentSong);
    const isPaused = useSelector((state) => state.isPaused);
    const duration = useSelector((state) => state.duration);
    const position = useSelector((state) => state.position);

    const { artistId } = route.params;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const navigation = useNavigation();
    const { top, right, bottom, left } = useSafeAreaInsets();

    useEffect(() => {

        const fetchArtistData = async () => {
            try {
                const response = await axios.get(`https://fimflex.com/api/soundtech/artist/${artistId}`);
                setData(response.data);
                console.log('Artist data:', artistId);
            } catch (error) {
                console.error('Error fetching artist data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistData();

    }, [artistId]);

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

    const SongList = () => {

        if (!data.popular || data.popular.length === 0) {   
            return <Text style={{marginTop: 20}}>Không có bài hát mới.</Text>;
        }

        return (
            <View contentContainerStyle={styles.containerCard}>
            {data.popular.map((item) => (
                <SongCard key={item.id} item={item} />
            ))}
            </View>
        );
    }

    const AlbumsCard = ({ item }) => {
        return (
            <TouchableOpacity style={styles.containerChartsCard} onPress={() => handleAlbumPress(item)}>
                <Image source={{ uri: item.thumbnail }} style={styles.imageChartsCard} />
                <Text style={styles.titleAlbumsCard}>{item.title}</Text>
                <Text style={styles.artistAlbumCard}>
                      {item.artists_info.map((artist) => artist.name).join(', ')}
                </Text>
            </TouchableOpacity>
        );
      };

      const handleAlbumPress = (album) => {
        navigation.navigate('Album', { album });
      };

    const handleSongPress = (song) => {
        navigation.navigate('Song', { song });
    };

    const handlePlayPausePress = () => {
        dispatch(setPaused(!isPaused));
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const bio = data.bio || '';
    const shortBio = bio.length > 100 ? bio.substring(0, 100) + '...' : bio;
    const fullBio = bio;

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
            </View>

            <ScrollView style={styles.insideScrollView}>

            <View style={styles.mainArtist}>
                <View style={styles.profileContainer}>
                    <Image
                    source={{ uri: data.avatar }} 
                    style={styles.profileImage}
                    />
                </View>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.followers}>65.1K Followers</Text>
                <View style={styles.buttonContainer}>
                    <View style={styles.leftContainer}>
                        <TouchableOpacity style={styles.followButton}>
                            <Text style={styles.buttonText}>Follow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton}>
                            <FontAwesomeIcon icon={faEllipsisH} size={15} color="#58606e" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightContainer}>
                        <TouchableOpacity style={styles.randomButton}>
                            <FontAwesomeIcon icon={faRandom} size={15} color="#58606e" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.playButton}>
                            <FontAwesomeIcon icon={faPlay} size={15} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

           {/* Bài hát gần đây */}
           <View style={styles.content}>
                <View style={styles.titleContent}>
                  <Text style={styles.titleHome}>Bài hát gần đây</Text>
                </View>
                <SongList/>
            </View>

            {/* Album */}
            <View style={styles.content}>
                <View style={styles.titleContent}>
                    <Text style={styles.titleHome}>Album</Text>
                </View>
                { data.album && data.album.length > 0 ? 
                <FlatList
                    data={data.album}
                    renderItem={({ item }) => <AlbumsCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
                 : <Text style={{marginTop: 20}}>Không có album nào.</Text> }
            </View>

            {/* Thông tin nghệ sĩ */}
            <View style={styles.content}>
                <View style={styles.titleContent}>
                    <Text style={styles.titleHome}>Tiểu sử</Text>
                </View>
                <Image 
                    source={{ uri: data.thumbnail ? data.thumbnail : data.avatar }}
                    style={styles.imageThumbnail}
                />
                <Text style={styles.description}>
                    {isExpanded ? fullBio : shortBio}
                </Text>
                <TouchableOpacity onPress={toggleExpand}>
                    <Text style={styles.viewMore}>{isExpanded ? 'Đóng lại' : 'Xem thêm'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}></View>

            </ScrollView>
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
        justifyContent: 'space-between',
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
        marginVertical: 5,
        height: 50
    },
    containerCard: {
        marginVertical: 10,
        paddingBottom: 20,
        flexGrow: 1,
        maxHeight: '100%'
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
        justifyContent: 'center',
        width: '70%'
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
        backgroundColor: '#222',
        height: 70,
        paddingHorizontal: 10,
        position: 'absolute', // Đặt vị trí tuyệt đối để ghim ở dưới cùng
        bottom: 0,
        left: 0,
        right: 0, // Đảm bảo chiếm toàn bộ chiều ngang
        elevation: 5, // Thêm độ bóng cho container
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
        color: '#333',
        maxWidth: '100%'
      },
      profileContainer: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 100,
        overflow: 'hidden',
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
      },
      profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
      },
      mainArtist: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
      },
      name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
      },
      followers: {
        fontSize: 12,
        color: 'gray',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
      },
      leftContainer: {
        flexDirection: 'row',
        marginRight: 'auto',
        marginLeft: 20,
      },
        rightContainer: {
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 20
        },
      followButton: {
        borderColor: '#c7cacf',
        borderWidth: 1,
        borderRadius: 30,
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginRight: 10,
        alignItems: 'center',
      },
      buttonText: {
        color: '#c7cacf',
        fontWeight: 'bold',
        fontSize: 12,
      },
      randomButton: {
        color: '#58606e',
        borderRadius: 50,
        padding: 10,
        marginRight: 10,
      },
      playButton: {
        backgroundColor: '#000',
        borderRadius: 50,
        padding: 10,
        marginRight: 10,
      },
      menuButton: {
        borderRadius: 50,
        padding: 10,
      },
      content: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 20,
      },
      titleHome: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      containerChartsCard: {
        flexDirection: 'column',
        borderRadius: 8,
        marginVertical: 8,
        marginRight: 8,
      },
      imageChartsCard: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
      },
      titleAlbumsCard: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        paddingLeft: 8,
        paddingTop: 8,
      },
      artistAlbumCard: {
        fontSize: 12,
        color: '#333',
        paddingLeft: 8,
      },
      insideScrollView: {
        paddingBottom: 70
      },
      imageThumbnail: {
        width: '100%',
        height: 130,
        borderRadius: 8,
        marginTop: 10
    },
    description: {
        flex: 1,
        fontSize: 13,
        color: '#333',
        marginTop: 10,
    },
    viewMore: {
        color: '#007BFF',
        marginTop: 10,
        fontSize: 10,
    },
    contentBio: {
        marginTop: 20,
    }
});

export default ArtistScreen;