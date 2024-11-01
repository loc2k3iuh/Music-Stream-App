import React, { useState } from 'react';
import { View, ImageBackground, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LaunchScreen ({ navigation }) {

    const dispatch = useDispatch();

    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    {/* Các biến input */}
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');

    {/* Các biến dùng toàn cục */}
    const [user, setUser] = useState(null);
  
    const handleCreateAccountPress = () => {
      setIsRegisterModalVisible(true);
    };
  
    const handleLoginPress = () => {
      setIsLoginModalVisible(true);
    };
  
    const handleRegisterCancel = () => {
      setIsRegisterModalVisible(false);
      setUsername('');
      setPassword('');
      setPasswordConfirm('');
      setFullname('');
      setEmail('');
    };
  
    {/* Hàm xử lý đăng ký */}
    const handleRegister = async () => {
      if(username.length < 3 || username.length > 15 || !/^[a-zA-Z0-9]+$/.test(username)) {
        showAlert({ content: 'Tên đăng nhập phải từ 3-15 ký tự và không có ký tự đặc biệt.' });
        return;
      }
      if(fullname=="") {
        showAlert({ content: 'Tên hiển thị không được để trống!' });
        return;
      }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert({ content: 'Email không hợp lệ!' });
        return;
      }
      if(password.length < 6 || password.length > 20) {
        showAlert({ content: 'Mật khẩu phải từ 6-20 ký tự!' });
        return;
      }
      if(password != passwordConfirm) {
        showAlert({ content: 'Mật khẩu xác nhận không khớp!' });
        return;
      }

      try {
            const response = await register(username, password, email, fullname);
            if (response.success) {
                // Xử lý đăng ký thành công
                console.log('Đăng ký thành công:', response.data);
                showAlert({ content: 'Đăng ký thành công!' });
                setIsRegisterModalVisible(false);
                setUsername('');
                setPassword('');
                setPasswordConfirm('');
                setFullname('');
                setEmail('');
            } else {
                showAlert({ content: response.message });
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            showAlert({ content: 'Đăng ký thất bại, vui lòng thử lại!' });
        }

    };
  
    const handleLoginCancel = () => {
      setIsLoginModalVisible(false);
      setUsername('');
      setPassword('');
    };
    
    {/* Hàm xử lý đăng nhập */}
    const handleLogin = async () => {
        if(username=="") {
            showAlert({ content: 'Tên đăng nhập không được để trống!' });
            return;
        }
        if(password=="") {
            showAlert({ content: 'Mật khẩu không được để trống!' });
            return;
        }
        try {
            const response = await login(username, password);
            if (response.success) {
                
                console.log('Đăng nhập thành công:', response.data);

                await AsyncStorage.setItem('userToken', JSON.stringify(response.data));

                dispatch({ type: 'SET_LOGIN', payload: true });
                dispatch({ type: 'SET_USER_DATA', payload: response.data });

                navigation.navigate('Home');
                setIsLoginModalVisible(false);
            } else {
                showAlert({ content: response.message });
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            
        }
    };

    {/* Hàm gửi yêu cầu đăng nhập */}
    const login = async (username, password) => {
        try {
            const response = await fetch('https://fimflex.com/api/soundtech/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                return { success: false, message: data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
            }
    
            return { success: true, data }; // Trả về dữ liệu nếu đăng nhập thành công
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            throw new Error('Không thể kết nối đến server');
        }
    };

    {/* Hàm gửi yêu cầu đăng ký */}
    const register = async (username, password, email, fullname) => {
        try {
            const response = await fetch('https://fimflex.com/api/soundtech/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    fullname,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                return { success: false, message: data.message || 'Đăng ký không thành công!' };
            }
    
            return { success: true, data }; // Trả về dữ liệu người dùng
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            throw new Error('Không thể kết nối đến server');
        }
    };

    const showAlert = ({content}) => {
        Alert.alert(
          'Thông báo', 
          content, 
          [
            {
              text: 'Hủy', 
              style: 'cancel',
            }
          ],
          { cancelable: false }
        );
      };


    const backgroundSource = require('../../assets/images/background-launch.png');
    const iconSource = require('../../assets/images/sound-icon.png');

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-launch.png')}
        style={styles.background}
      >
        <View style={styles.header}>
            <Image style={styles.icon} source={require('../../assets/images/sound-icon.png')} />
        </View>
        <View style={styles.content}>
            <Text style={styles.title}>SoundTech</Text>
            <Text style={styles.subtitle}>Làm chủ bài hát</Text>
        </View>
        <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonCreate} onPress={handleCreateAccountPress}>
              <Text style={styles.buttonTextCreate}>Tạo tài khoản</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLoginPress}>
              <Text style={styles.buttonTextLogin}>Đã có tài khoản?</Text>
            </TouchableOpacity>
        </View>

        {/* Modal đăng ký */}
        <Modal 
        visible={isRegisterModalVisible}
        animationType="slide"
        transparent
        style={styles.modal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Đăng ký tài khoản</Text>
              <TextInput style={styles.modalInput} placeholder="Tên đăng nhập"
              placeholderTextColor="#e1f6ea"
              value={username}
              onChangeText={setUsername}
               />
              <TextInput style={styles.modalInput} placeholder="Tên hiển thị"
              placeholderTextColor="#e1f6ea"
              value={fullname}
              onChangeText={setFullname}
               />
                <TextInput style={styles.modalInput} placeholder="Email"
              placeholderTextColor="#e1f6ea"
              value={email}
              onChangeText={setEmail}
               />
              <TextInput style={styles.modalInput} placeholder="Mật khẩu" 
              placeholderTextColor="#e1f6ea"
              secureTextEntry 
              value={password}
              onChangeText={setPassword}/>
              <TextInput style={styles.modalInput} placeholder="Xác nhận mật khẩu" 
              placeholderTextColor="#e1f6ea"
              secureTextEntry 
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}/>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={handleRegisterCancel}>
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonSubmit} onPress={handleRegister}>
                  <Text style={styles.modalButtonText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal đăng nhập */}
        <Modal 
        visible={isLoginModalVisible}
        animationType="slide"
        transparent
        style={styles.modal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Đăng nhập</Text>
              <TextInput style={styles.modalInput} placeholder="Tên đăng nhập"
              placeholderTextColor="#e1f6ea"
              value={username}
              onChangeText={setUsername} />
              <TextInput style={styles.modalInput} placeholder="Mật khẩu"
              placeholderTextColor="#e1f6ea" secureTextEntry
              value={password}
              onChangeText={setPassword} />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={handleLoginCancel}>
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonSubmit} onPress={handleLogin}>
                  <Text style={styles.modalButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 70,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 24,
  },
  buttonCreate: {
    backgroundColor: '#171a1f',
    padding: 10,
    borderRadius: 8,
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonLogin: {
    backgroundColor: '#ecfcff',
    color: 'black',
    padding: 10,
    borderRadius: 8,
    width: '80%',
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonTextLogin: {
    fontSize: 16,
    color: 'black',
  },
  buttonTextCreate: {
    fontSize: 16,
    color: 'white',
  },
  icon: {
    marginBottom: 100,
    width: 50,
    height: 50,
  },
  modal: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    minHeight: '50%',
    left: 0,
    right: 0
  },
  modalContent: {
    backgroundColor: '#181818',
    padding: 24,
    borderRadius: 8,
    width: '100%',
    height: '100%',
    bottom: 0,
    alignContent: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    color: '#e1f6ea'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButtonCancel: {
    backgroundColor: '#e20809',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  modalButtonSubmit: {
    backgroundColor: '#6200EE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
  },
});