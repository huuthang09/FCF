import React from "react";
import {
  View,
  Button,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

export default function App() {
  const firebaseConfig = {
	  apiKey: "AIzaSyDtONWGBmy7cuH7Y1t2y3yADa_R_5yCtkU",
    authDomain: "reactnative-275502.firebaseapp.com",
    databaseURL: "https://reactnative-275502.firebaseio.com/",
    projectId: "reactnative-275502",
    storageBucket: "reactnative-275502.appspot.com",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  React.useEffect(() => {
    loadData();
  }, []);

  const [list, setList] = React.useState({
    value: "",
    id: null,
    newList: [],
    deleteId: null,
    updateValue: "",
  });

  async function sendData() {
    if (list.value != "") {
      const dbh = firebase.firestore();
      dbh
        .collection("Users")
        .doc(list.newList.length.toString())
        .set({
          id: list.newList.length,
          user: list.value,
        })
        .then(loadData);
    } else {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
    }
  }

  async function loadData() {
    console.disableYellowBox = true;
    const dbh = firebase.firestore();
    dbh.collection("Users").onSnapshot((querySnapshot) => {
      const users = [];

      querySnapshot.forEach((documentSnapshot) => {
        users.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setList({
        newList: users,
      });
    });
  }

  async function updateData() {
    if (list.id != null && list.updateValue != "") {
      const dbh = firebase.firestore();
      dbh
        .collection("Users")
        .doc(list.id.toString())
        .update({
          user: list.updateValue,
        })
        .then(loadData);
    } else {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
    }
  }

  async function deleteData() {
    if (list.deleteId != null) {
      const dbh = firebase.firestore();
      dbh.collection("Users").doc(list.deleteId.toString()).delete().then(loadData);
    } else {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.txtTitle}>DEMO CLOUD FIRESTORE</Text>
        {/* Phần Thêm Data */}
        <TextInput
          style={styles.input}
          placeholder="Nhập User mới..."
          onChangeText={(text) => (list.value = text)}
          underlineColorAndroid="#F00"
        />

        <Button title="Gửi dữ liệu" onPress={sendData} />

        {/* Phần Update Data */}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Nhập id..."
          onChangeText={(text) => (list.id = Number(text))}
          underlineColorAndroid="#F00"
        />

        <TextInput
          style={styles.input}
          placeholder="Nhập Note muốn chỉnh sửa..."
          onChangeText={(text) => (list.updateValue = text)}
          underlineColorAndroid="#F00"
        />

        <Button title="Chỉnh sửa Note" onPress={updateData} />

        {/* Phần Xóa Data */}
        <TextInput
          style={styles.input}
          placeholder="Nhập id..."
          onChangeText={(text) => (list.deleteId = Number(text))}
          underlineColorAndroid="#F00"
        />

        <Button title="Xóa Note" onPress={deleteData} />

        <FlatList
          data={list.newList}
          renderItem={({ item }) => (
            <Text>
              id: {item.id} User: {item.user}
            </Text>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50,
  },
  input: {
    fontSize: 18,
    marginVertical: 10,
  },
  txtTitle: {
    fontSize: 18,
    color: "#F00",
  },
});
