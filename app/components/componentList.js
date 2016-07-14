import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableOpacity,
  Switch,
  AlertIOS,
  ActivityIndicator,
  AppState
} from 'react-native';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import SwitchBlind from './switchBlind';
import SwitchAudio from './switchAudio';
import * as blindActions from '../actions/blindActions';



var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        flexDirection: 'column',
        paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    text: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    rowStyle: {
        paddingVertical: 20,
        paddingLeft: 16,
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: '#E0E0E0',
        borderWidth: 1
    },
    rowText: {
        color: '#212121',
        fontSize: 16
    },
    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#2196F3'
    }
});



class Counter extends Component {
  constructor(props) {
    super(props);
    this.onPressRow = this.onPressRow.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);

    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.state = {
        dataSource: ds.cloneWithRowsAndSections({}),
        scrollEnabled: true
    };

  }

  componentDidMount() {
    const { loadComponents } = this.props;
    AppState.addEventListener('change', this.handleAppStateChange);
    loadComponents();
    this.startTimer();
  }

  componentWillMount() {
    this.setState({appState: AppState.currentState})
  }

  handleAppStateChange(appState) {
    this.setState({appState: appState})

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isWorking!==this.props.isWorking){
      this.setState({
        isWorking:nextProps.isWorking
      })
    }
    if(nextProps.loaded!==this.props.loaded){
      this.setState({
        loaded: nextProps.loaded
      })
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.props.listViewData.dataBlob || {}, this.props.listViewData.sectionIdentities || [], this.props.listViewData.rowIdentities || [])
    })
  }

   startTimer(){
    if(!this.state.timerId){
      let timerId = this.setInterval(
           async () => {
            if(!this.state.isWorking && (this.state.appState==='active' || this.state.appState==='background')){
              console.log('reload componets');
              const { loadComponents } = this.props;
              loadComponents();
            }
          },
          5000
        );
        this.setState({
          timerId: timerId
        })
    }
  }

  stopTimer(){
    if(this.state.timerId){
      this.clearTimeout(this.state.timerId);
      this.setState({
        timerId: undefined
      })
    }
  }

  onPressRow (rowData, sectionID) {
    var buttons = [
       {
           text : 'Cancel'
       },
       {
           text    : 'OK'
       }
    ]
    AlertIOS.alert('User\'s Email is ' + rowData.name, null, null);
  }
  renderLoadingView() {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                animating={!this.state.loaded}
                style={[styles.activityIndicator, {height: 80}]}
                size="large"
            />
        </View>
      );
  }

  renderRow (rowData, sectionID, rowID) {

      const { changeAudioSwitch, components, actions} = this.props;
      if(rowData.type ==='switchBlind'){
        return (<SwitchBlind rowData={rowData}  {...actions} ></SwitchBlind>);
      }

      if(rowData.type ==='switchAudio'){
        return (<SwitchAudio rowData={rowData} changeAudioSwitch={changeAudioSwitch}></SwitchAudio>);
      }
      return (<Text>Emptycomponent</Text>);

  }
  renderSectionHeader(sectionData, sectionID) {
       return (
           <View style={styles.section}>
               <Text style={styles.text}>{sectionID}</Text>
           </View>
       );
   }

  renderListView () {
     const { changeAudioSwitch, components } = this.props;
      return (

        <View style={styles.container}>

             <ListView
                  enableEmptySections={true}
                  style = {styles.listview}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow}
                  renderSectionHeader = {this.renderSectionHeader}
             />
         </View>
      );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return this.renderListView();

  }
}

reactMixin(Counter.prototype, TimerMixin);


function mapStateToProps(state) {
  return { }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators(blindActions, dispatch)
  })
)(Counter);
