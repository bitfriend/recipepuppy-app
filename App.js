/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

console.disableYellowBox = true;

import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Divider, SearchBar } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import EStyleSheet from 'react-native-extended-stylesheet';
import axios from 'axios';

const { width: windowWidth } = Dimensions.get('window');

EStyleSheet.build({ $rem: windowWidth / 375 });

const limit = 20;

export default class App extends Component {
  state = {
    search: 'omelet',
    loading: false,
    records: []
  }

  componentDidMount() {
    this.doSearch(this.state.search);
  }

  doSearch(value) {
    this.setState({ loading: true });
    this.doRequest(value, 1, []);
  }

  doRequest(value, page, records) {
    axios({
      url: 'http://www.recipepuppy.com/api/',
      method: 'GET',
      params: {
        i: 'onions,garlic',
        q: value,
        p: page
      }
    }).then(res => {
      const { results } = res.data;
      if (results.length === 0) {
        this.setState({ records, loading: false });
        return;
      }
      for (let i = 0; i < results.length; i++) {
        records.push(results[i]);
        if (records.length === limit) {
          this.setState({ records, loading: false });
          return;
        }
      }
      this.doRequest(value, page + 1, records);
    }).catch(error => {
      console.log('error', error.message);
      this.setState({ loading: false });
    });
  }

  onChangeText = (value) => {
    if (!value) {
      this.setState({
        search: '',
        records: []
      });
    } else {
      this.setState({ search: value });
      this.doSearch(value);
    }
  }

  render = () => (
    <View style={styles.container}>
      <SearchBar
        value={this.state.search}
        onChangeText={this.onChangeText}
      />
      <FlatList
        data={this.state.records}
        renderItem={this.renderItem}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrapper}>
            <Text>Empty Data</Text>
          </View>
        )}
      />
      {this.state.loading && (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  )

  renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.thumbnail}>
        {!!item.thumbnail && (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        )}
      </View>
      <Text style={styles.title}>{item.title.trim()}</Text>
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(true)
  },
  spinner: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center'
  },
  item: {
    padding: '16rem',
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: '40rem',
    height: '40rem',
    borderRadius: '5rem'
  },
  title: {
    flex: 1,
    marginLeft: '16rem'
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center'
  }
});
