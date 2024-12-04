import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useContext } from 'react';

export default function Choice({ navigation }) {

  const [choice, setChoice] = useState([
    { id: 1, name: "Danh sách phát" },
    { id: 2, name: "Nghệ sĩ" },
    { id: 3, name: "Bài hát" },
    { id: 4, name: "Album" },
    { id: 5, name: "Bảng xếp hạng" }
  ]);

  return (
    <View style={{ marginHorizontal: 10 }}>
      <FlatList
        data={choice}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ListLibrary',{name: item.name})}
            style={{
              marginRight: 5,
              alignItems: 'center',
              padding: 10,
              borderRadius: 20
            }}>
            <Text style={{ color: '#000', fontSize: 12 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}