'use strict';

import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {View, StyleSheet} from 'react-native';
import NavigationBar from 'react-native-navbar'
import ComponentList from '../components/componentList';
import * as counterActions from '../actions/counterActions';
import { connect } from 'react-redux';
//import Zeroconf from 'react-native-zeroconf'


var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

// @connect(state => ({
//   state: state.counter
// }))
class CounterApp extends Component {
  constructor(props) {
    super(props);
    /*const zeroconf = new Zeroconf()
    zeroconf.on('start', () => console.log('The scan has started.'))
    zeroconf.on('error', (error) => console.log(error))
    zeroconf.on('found', (obj) => console.log(obj))
    zeroconf.scan('http', 'tcp', 'rpi3.local')

    console.log(zeroconf.getServices());*/
  }

  render() {
    const { state, actions } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{ title: 'Componentes', tintColor: 'black', }}
          leftButton={{ title: 'Back', }}
          rightButton={{ title: 'Forward', }}
          style={{ backgroundColor: "white", }}
          statusBar={{ tintColor: "white", }}
        />
        <ComponentList
          listViewData={state.listViewData}
          loaded={state.loaded}
          isWorking={state.isWorking}
          {...actions} />
      </View>

    );
  }
}

function mapStateToProps(state) {
  return { state: state.component }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators(counterActions, dispatch)
  })
)(CounterApp);
