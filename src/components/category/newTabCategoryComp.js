import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Image,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

const NewTabCategoryComponent = ({
  props,
  callback,
  callbackLongPress,
  selected,
  isHasFooter
}) => {

  const ACategoryItem = ({ category, depth = 0 }) => {
    return (
      <View style={styles.viewCateItem}>
        <Pressable
          style={({ pressed }) => [
            styles.touchableCateItem,
            {
              marginLeft: 20 * depth,
              width: Dimensions.get("window").width * 0.8 - 30 * depth,
              height: 40,
              backgroundColor: pressed ? "lightgray" : null
            }
          ]}
          onPress={() => {
            callback(category);
          }}
          onLongPress={() => {
            // only call callback if it valid
            if (callbackLongPress) {
              callbackLongPress(category);
            }
          }}
        >
          <Icon
            style={styles.iconCateItem}
            name="angle-right"
            size={15}
            color="black"
          />
          <Text style={styles.textItem}>{category.nameVN}</Text>
          {selected?.categoryID === category?.categoryID && (
            <Icon
              style={styles.iconCateItemSelected}
              name="check"
              size={15}
              color="black"
            />
          )}
        </Pressable>
        {category.children &&
          category.children.map((child) => (
            <ACategoryItem
              key={child.categoryID}
              category={child}
              depth={depth + 1}
            />
          ))}
      </View>
    );
  };
  // return hello world
  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
        indicatorStyle="black"
        data={props?.category?.children}
        renderItem={({ item }) => (
          <ACategoryItem category={item} depth={0} action={true} />
        )}
        keyExtractor={(item) => item.categoryID}
        // add footer
        ListFooterComponent={
          <View
            style={{
              height: isHasFooter ? 150 : 10,
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            {/* a divider horizontal view */}
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "darkgray",
                marginVertical: 10
              }}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconCateItemSelected: {
    marginHorizontal: 10,
    marginRight: 20,
    right: -50
  },
  viewCateItem: {
    marginHorizontal: 10,
    marginVertical: 5
  },
  textItem: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
  },
  iconCateItem: {
    marginHorizontal: 10,
    marginRight: 20
  },
  touchableCateItem: {
    marginVertical: 3,
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#b2bec3",
    borderLeftColor: "#b2bec3",
    borderLeftWidth: 0.5,
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  }
});

export default NewTabCategoryComponent;
