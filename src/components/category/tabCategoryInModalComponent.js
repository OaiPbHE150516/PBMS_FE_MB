import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Pressable
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useSelector, useDispatch } from "react-redux";
import {
  setCategoryToAddTransaction,
  setModalCategoryVisible
} from "../../redux/categorySlice";
import categoryServices from "../../services/categoryServices";

// import pbms from "../../api/pbms";
// import { API } from "../../constants/api.constant";

import { getCategories } from "../../redux/categorySlice";

import { setModalAddTransactionVisible } from "../../redux/modalSlice";

const TabCategoryInModalComponent = ({ props, callback }) => {
  const account = useSelector((state) => state.authen.account);
  const [isShouldSelectToAddTransaction, setIsShouldSelectToAddTransaction] =
    useState(props?.action);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();

  const fetchCategoryData = async () => {
    try {
      dispatch(getCategories(account?.accountID));
      // const response = await pbms.get(API.CATEGORY.GET_CATEGORY_BY_USER + account.accountID);
      // setCategories(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCategoryData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    setIsShouldSelectToAddTransaction(props?.action);
  }, [props?.action]);

  const CategoryItem = ({ category, depth = 0, action }) => {
    const categoryToAddTransaction = useSelector(
      (state) => state.category?.categoryToAddTransaction
    );
    const dispatch = useDispatch();

    const handleTouchCateItem = (category) => {
      if (action === true || action === null || action === undefined) {
        dispatch(setCategoryToAddTransaction(category));
        dispatch(setModalCategoryVisible(false));
        dispatch(setModalAddTransactionVisible(false));
        callback(category);
      } else if (action === false) {
        console.log("action", action);
        console.log("category", category);
      }
    };
    return (
      <View style={styles.viewCateItem}>
        <Pressable
          style={({ pressed }) => [
            styles.touchableCateItem,
            {
              marginLeft: 20 * depth,
              width: Dimensions.get("window").width * 0.75 - 30 * depth,
              height: 30,
              backgroundColor: pressed ? "lightgray" : null
            }
          ]}
          onPress={() => {
            handleTouchCateItem(category);
          }}
        >
          <Icon
            style={styles.iconCateItem}
            name="angle-right"
            size={15}
            color="black"
          />
          <Text style={styles.textItem}>{category.nameVN}</Text>
          {/* <TickSelected category={category} /> */}
          {(isShouldSelectToAddTransaction === true ||
            isShouldSelectToAddTransaction === null ||
            isShouldSelectToAddTransaction === undefined) &&
          category?.categoryID === categoryToAddTransaction?.categoryID ? (
            <Icon
              style={styles.iconCateItemSelected}
              name="check"
              size={15}
              color="black"
            />
          ) : null}
        </Pressable>
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

  // console.log("action: ", props.action);
  return (
    <View style={styles.viewStyle}>
      {/* <Text style={styles.textName}>{props.category.nameVN}</Text> */}
      {props?.category?.children && props?.category?.children.length > 0 ? (
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          data={props?.category?.children}
          keyExtractor={(item) => item?.categoryID}
          renderItem={({ item }) => (
            <CategoryItem category={item} action={props?.action} />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text>{"Loading..."}</Text>
      )}
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
    // borderWidth: 10,
    // borderColor: "blue",
    width: "100%"
    // height: "50%"
  },
  textItem: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
  }
});

export default TabCategoryInModalComponent;
