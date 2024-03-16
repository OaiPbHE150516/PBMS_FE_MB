import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useSelector, useDispatch } from "react-redux";
import {
  setCategoryToAddTransaction,
  setModalCategoryVisible
} from "../../redux/categorySlice";

import { setModalAddTransactionVisible } from "../../redux/modalSlice";

const CategoryItem = ({ category, depth = 0 }) => {
  const categoryToAddTransaction = useSelector(
    (state) => state.category.categoryToAddTransaction
  );
  const modalCategoryVisible = useSelector(
    (state) => state.category.modalCategoryVisible
  );
  const dispatch = useDispatch();
  const handleTouchCateItem = (category) => {
    return () => {
      console.log("category", category);
      dispatch(setCategoryToAddTransaction(category));
      dispatch(setModalCategoryVisible(false));
      dispatch(setModalAddTransactionVisible(false));
    };
  };
  return (
    <View style={styles.viewCateItem}>
      <TouchableOpacity
        style={[
          styles.touchableCateItem,
          {
            marginLeft: 20 * depth,
            width: Dimensions.get("window").width * 0.75 - 20 * depth
          }
        ]}
        onPress={handleTouchCateItem(category)}
      >
        <Icon
          style={styles.iconCateItem}
          name="angle-right"
          size={15}
          color="black"
        />
        <Text style={styles.textItem}>{category.nameVN}</Text>
        {category?.categoryID === categoryToAddTransaction?.categoryID ? (
          <Icon
            style={styles.iconCateItemSelected}
            name="check"
            size={15}
            color="black"
          />
        ) : null}
      </TouchableOpacity>
      {category.children &&
        category.children.map((child) => (
          <CategoryItem
            key={child.categoryID}
            category={child}
            depth={depth + 1}
          />
        ))}
    </View>
  );
};

const TabCategoryInModalComponent = ({ props }) => {
  return (
    <View style={styles.viewStyle}>
      {/* <Text style={styles.textName}>{props.category.nameVN}</Text> */}
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        data={props.category.children}
        keyExtractor={(item) => item.categoryID}
        renderItem={({ item }) => <CategoryItem category={item} />}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  viewCateItem: {
    marginHorizontal: 10,
    marginVertical: 5
  },
  touchableCateItem: {
    marginVertical: 3,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "darkgray",
    borderLeftColor: "darkgray",
    borderLeftWidth: 1,
    borderRadius: 5,
    width: "100%",
    height: 30,
    flexDirection: "row"
  },
  iconCateItem: {
    marginHorizontal: 10,
    marginRight: 20
  },
  iconCateItemSelected: {
    marginHorizontal: 10,
    marginRight: 20,
    right: -50
  },
  textName: {
    fontSize: 20,
    color: "black"
  },
  viewStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    marginVertical: 10,
    flexDirection: "column",
    // borderWidth: 1,
    // borderColor: "blue",
    width: "100%"
  },
  textItem: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
  }
});

export default TabCategoryInModalComponent;
