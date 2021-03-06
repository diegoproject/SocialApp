import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import * as firebase from "firebase";
require("firebase/firestore");
import Fire from "../Fire";

var db = [
  firebase
    .firestore()
    .collection("posts")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(doc => {
        db.push(doc.data());
      });
    })
];

let getDocs = () => {
  // [START get_multiple_all]
  return [
    firebase
      .firestore()
      .collection("posts")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let posts = querySnapshot.docs.map(doc => doc.data());
          console.log(posts);
          return posts;
        });
      })
  ];

  // [END get_multiple_all]
};

export default class HomeScreen extends React.Component {
  state = {
    refreshing: false,
    dataSource: db
  };

  renderPost = post => {
    if (post != null) {
      return (
        <View style={styles.feedItem}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <View>
                <Text style={styles.name}>{post.name}</Text>
                <Text style={styles.timestamp}>
                  {moment(post.timestamp).fromNow()}
                </Text>
              </View>

              <Ionicons name="ios-more" size={24} color="#73788B" />
            </View>
            <Text style={styles.post}>{post.text}</Text>
            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                name="ios-heart-empty"
                size={24}
                color="#73788B"
                style={{ marginRight: 16 }}
              />
              <Ionicons name="ios-chatboxes" size={24} color="#73788B" />
            </View>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>
        <FlatList
          style={styles.feed}
          data={db}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item, index) => String(index)}
          showsVerticalScrollIndicator={false}
          refreshControl={this._refreshControl()}
        ></FlatList>
      </View>
    );
  }
  _refreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={() => this._refreshListView()}
      />
    );
  }
  _refreshListView() {
    //Start Rendering Spinner
    this.setState({ refreshing: true });

    //Updating the dataSource with new data
    this.setState({
      dataSource: (db = [
        firebase
          .firestore()
          .collection("posts")
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(doc => {
              let posts = querySnapshot.docs.map(doc => doc.data());
              db.push(doc.data());
            });
          })
      ])
    });
    this.setState({ refreshing: false }); //Stop Rendering Spinner
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBECF4"
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500"
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65"
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899"
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16
  }
});