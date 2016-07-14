import * as types from '../actions/actionTypes';
import {merge, union, forEach} from 'lodash';

const initialState = {
  listViewData:{
    dataBlob: {},
    sectionIdentities: [],
    rowIdentities: []
  },
  loaded: false
};

export default function component(state = initialState, action = {}) {
  const { uniqueKey, body } = action;
  switch (action.type) {
    case types.COMPONENTS_REQUEST:
      return merge( {}, state, {
        isWorking: false,
        loaded: !state.loaded? false: true
      });
    case types.COMPONENTS_SUCCESS:

      const componentIds= action.response.result
      const components= action.response.entities.component
      const sectionIdentities = componentIds.map((id)=> components[id].group);
      sectionIdentities  = sectionIdentities.filter(function(v,i) { return sectionIdentities.indexOf(v) == i; });
      const rowIdentities =[]
      const dataBlob = {};
      sectionIdentities.forEach((section, i)=>{
        const sectionItemIds = componentIds.filter((id)=> components[id].group === section)
                                           .sort((id1, id2)=> components[id1].order > components[id2].order);
        rowIdentities.push(sectionItemIds);
        sectionItemIds.forEach((id)=>{
          const data =components[id];
            const sectionBlob = dataBlob[section] || {}
            dataBlob[section] = dataBlob[section] || {};
            dataBlob[section][id] = data;
        });
      });
      return merge( {}, state, {
        isWorking: false,
        loaded: true,
        listViewData:{
          dataBlob: dataBlob,
          sectionIdentities: sectionIdentities,
          rowIdentities: rowIdentities
        }
      });
    case types.CHANGE_AUDIO_SWITCH_REQUEST:

      if(state.components){
        state.components[uniqueKey].value = body.state==='on'?1:0;
      }
      return merge({}, state, { isWorking: true });
    case types.CHANGE_AUDIO_SWITCH_SUCCESS:
      if(action.response.entities.component){
        console.log(action.response.entities.component);
        state.components[action.response.result].value= action.response.entities.component[action.response.result].value
      }
      return merge({}, state, {isWorking: false});
    default:
      return state;
  }
}
