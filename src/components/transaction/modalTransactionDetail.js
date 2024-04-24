import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  ScrollView,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";
import transactionServices from "../../services/transactionServices";

// components
import AnInputInvoiceScanning from "../transaction/anInputInvoiceScanning";
import AnInputProductInIS from "../transaction/anInputProductInIS";

const ModalTransactionDetail = ({ props, callback }) => {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const account = useSelector((state) => state.authen.account);

  const category = props?.category;
  const wallet = props?.wallet;
  const invoiceResult = props?.invoice;
  return (
    <ScrollView style={styles.viewStyle}>
      <View style={styles.view_Header}>
        <Text style={styles.textStyle}>{"Chi tiết giao dịch"}</Text>
      </View>
      <View style={styles.view_Content}>
        <View style={styles.view_TransactionInfor_Row}>
          <View style={styles.view_LabelWithNumber}>
            {props?.transactionDateMinus && (
              <Text style={styles.text_Time}>
                {props?.transactionDateMinus + ", " + props?.transactionDateStr}
              </Text>
            )}
          </View>
          <View style={styles.view_RightInfor}>
            <Text
              style={[
                styles.text_Amount,
                {
                  color: category.categoryTypeID == 1 ? "green" : "#d63031"
                }
              ]}
            >
              {props?.totalAmountStr}
            </Text>
          </View>
        </View>
        <View style={styles.viewChildIS}>
          {/* <Text style={styles.textHeaderViewChildIS}>{"Giao dịch"}</Text> */}
          <AnInputInvoiceScanning
            isHasIcon={false}
            textLabelTop="Hạng mục"
            value={category?.nameVN}
            onChangeText={(text) => {
              // setInvoiceResult({ ...invoiceResult, supplierName: text });
            }}
          />
          <AnInputInvoiceScanning
            isHasIcon={false}
            textLabelTop="Ví"
            value={wallet?.name}
            onChangeText={(text) => {
              // setInvoiceResult({ ...invoiceResult, supplierName: text });
            }}
          />
          <AnInputInvoiceScanning
            isHasIcon={false}
            textLabelTop="Từ"
            value={props?.fromPerson}
            onChangeText={(text) => {
              // setInvoiceResult({ ...invoiceResult, supplierName: text });
            }}
          />
        </View>
        <View style={styles.view_Note}>
          <Text style={styles.text_Note_Label}>{"Ghi chú"}</Text>
          <TextInput
            style={styles.text_Note}
            placeholder="Ghi chú"
            editable={true}
            multiline={true}
            numberOfLines={5}
            textAlign="left"
            textAlignVertical="top"
          >
            {props?.note}
          </TextInput>
        </View>
        {invoiceResult && (
          <View>
            <View style={styles.viewChildIS}>
              <Text style={styles.textHeaderViewChildIS}>{"Hóa đơn"}</Text>
              <AnInputInvoiceScanning
                isHasIcon={false}
                textLabelTop="Tổng tiền"
                value={invoiceResult?.totalAmountStr}
                onChangeText={(text) => {
                  // setInvoiceResult({ ...invoiceResult, supplierName: text });
                }}
              />
              <AnInputInvoiceScanning
                isHasIcon={false}
                textLabelTop="Số"
                value={invoiceResult?.idOfInvoice}
                onChangeText={(text) => {
                  // setInvoiceResult({ ...invoiceResult, supplierName: text });
                }}
              />
              <AnInputInvoiceScanning
                isHasIcon={false}
                textLabelTop="Ngày"
                value={invoiceResult?.invoiceDate}
                onChangeText={(text) => {
                  // setInvoiceResult({ ...invoiceResult, supplierName: text });
                }}
              />
            </View>
            <View style={styles.viewChildIS}>
              <Text style={styles.textHeaderViewChildIS}>
                {"Đơn vị cung cấp"}
              </Text>
              <AnInputInvoiceScanning
                isHasIcon={false}
                textLabelTop="Tên"
                value={invoiceResult?.supplierName}
                onChangeText={(text) => {
                  // setInvoiceResult({ ...invoiceResult, supplierName: text });
                }}
              />
              <AnInputInvoiceScanning
                isHasIcon={false}
                textLabelTop="Địa chỉ"
                value={invoiceResult?.supplierAddress}
                onChangeText={(text) => {
                  // setInvoiceResult({ ...invoiceResult, supplierName: text });
                }}
              />
              <AnInputInvoiceScanning
                isHasIcon={false}
                textLabelTop="Số điện thoại"
                value={invoiceResult?.supplierPhone}
                onChangeText={(text) => {
                  // setInvoiceResult({ ...invoiceResult, supplierName: text });
                }}
              />
            </View>
            <View style={styles.viewChildIS}>
              <Text style={styles.textHeaderViewChildIS}>{"Sản phẩm"}</Text>
              <FlatList
                nestedScrollEnabled={true}
                scrollEnabled={false}
                data={invoiceResult?.products}
                keyExtractor={(item) => item.productID}
                renderItem={({ item }) => (
                  <AnInputProductInIS
                    editable={false}
                    name={item.productName}
                    unitprice={item.unitPrice.toString()}
                    tag={item.tag.toString()}
                    quanity={item.quanity.toString()}
                    amount={item.totalAmount.toString()}
                    onChangeTextName={(text) => {
                      let newItem = item;
                      newItem.productName = text;
                      // handleChangeProductInInvoice({ newItem });
                    }}
                    onChangeTextQuanity={(text) => {
                      let newItem = item;
                      newItem.quanity = text;
                      // handleChangeProductInInvoice({ newItem });
                    }}
                    onChangeTextUnitPrice={(text) => {
                      let newItem = item;
                      newItem.unitPrice = text;
                      // handleChangeProductInInvoice({ newItem });
                    }}
                    onChangeTextAmount={(text) => {
                      let newItem = item;
                      newItem.totalAmount = text;
                      // handleChangeProductInInvoice({ newItem });
                    }}
                  />
                )}
              />
            </View>
          </View>
        )}

        {props?.imageURL != null &&
          props?.imageURL != " " &&
          props?.imageURL != "" && (
            <View>
              <Image
                source={{ uri: props?.imageURL }}
                style={{ width: width, height: height }}
                resizeMode="contain"
              />
              <Text>{props?.imageURL}</Text>
            </View>
          )}
      </View>
      {/* <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={() => callback(false)}
      >
        <Text style={styles.textStyle}>Hide Modal</Text>
      </Pressable> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textHeaderViewChildIS: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    alignSelf: "flex-start",
    top: -10,
    backgroundColor: "white",
    paddingHorizontal: 5
  },
  viewChildIS: {
    minWidth: "100%",
    maxWidth: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 8
  },
  text_Time: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular"
  },
  view_RightInfor: {
    flex: 1,
    alignItems: "flex-end"
  },
  view_LabelWithNumber: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  text_Category_Label: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular_Italic",
    marginRight: 10
  },
  text_Category: {
    fontSize: 22,
    fontFamily: "OpenSans_500Medium"
  },
  text_Note: {
    fontSize: 20,
    fontFamily: "OpenSans_400Regular"
  },
  text_Note_Label: {
    backgroundColor: "white",
    paddingHorizontal: 5,
    borderRadius: 5,
    fontSize: 15,
    fontFamily: "OpenSans_400Regular_Italic",
    position: "absolute",
    top: -10,
    left: 10
  },
  view_Note: {
    borderWidth: 0.5,
    borderColor: "darkgray",
    width: "100%",
    height: 100,
    padding: 5,
    marginVertical: 15,
    borderRadius: 10
  },
  text_Amount: {
    fontSize: 25,
    fontFamily: "OpenSans_600SemiBold"
  },
  view_TransactionInfor_Row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  view_Content: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // borderWidth: 1,
    // borderColor: "black",
    paddingHorizontal: 10
  },
  view_Header: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 15
  },
  viewStyle: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    height: "80%",
    borderWidth: 0.5,
    borderColor: "darkgray",
    borderRadius: 20,
  },
  textStyle: {
    fontSize: 20,
    color: "black"
  }
});

export default ModalTransactionDetail;
