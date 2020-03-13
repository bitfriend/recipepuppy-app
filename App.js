/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

console.disableYellowBox = true;

import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, SearchBar } from 'react-native-elements';
import qs from 'qs';

export default class App extends Component {
  state = {
    search: 'omelet',
    json: {
      title: '',
      version: null,
      href: '',
      results: []
    }
  }

  componentDidMount() {
    this.doSearch(this.state.search);
  }

  doSearch(value) {
    const data = {
      i: 'onions,garlic',
      q: value,
      p: 3
    };
    fetch({
      url: 'http://66.246.138.180/api/?' + qs.stringify(data, { encode: false }),
      method: 'GET'
    }).then(response => {
      console.log('response', response);
      return response.json();
    }).then(json => {
      this.setState({ json });
    }).catch(error => {
      console.log('error', error.message);
    });
  }

  onChangeKeyword = (value) => {
    this.setState({ search: value });
    this.doSearch(value);
  }

  render = () => (
    <View style={styles.container}>
      <SearchBar
        value={this.state.search}
        onChange={this.onChangeKeyword}
      />
      <FlatList
        data={this.state.json.results}
        renderItem={this.renderItem}
      />
    </View>
  )

  renderItem = ({ item, index }) => (
    <Card title={item.title}>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
