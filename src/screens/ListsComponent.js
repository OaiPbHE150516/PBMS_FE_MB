import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const ListsComponent = () => {
  const friends = [
    { name: "friend #1", age: 20 },
    { name: "friend #2", age: 45 },
    { name: "friend #3", age: 32 },
    { name: "friend #4", age: 27 },
    { name: "friend #5", age: 53 },
    { name: "friend #6", age: 30 },
    { name: "friend #7", age: 20 },
    { name: "friend #8", age: 45 },
    { name: "friend #9", age: 32 },
    { name: "friend #10", age: 27 },
    { name: "friend #11", age: 53 },
    { name: "friend #12", age: 30 },
  ];

  const friend = friends.map((friend) => {
    return <Text>{friend.name}</Text>;
  });

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(friend) => friend.name}
        data={friends}
        renderItem={({ item }) => {
          return (
            <Text style={styles.text}>
              {item.name} - Age {item.age}
            </Text>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "green",
    marginVertical: 20,
  },
});

export default ListsComponent;
