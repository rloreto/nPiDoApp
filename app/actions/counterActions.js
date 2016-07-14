import * as types from './actionTypes';
import {
  CALL_API,
  Schemas
} from '../middleware/api'



function fetchComponents() {

  return {
    [CALL_API]: {
      types: [types.COMPONENTS_REQUEST, types.COMPONENTS_SUCCESS, types.COMPONENTS_FAILURE],
      urlPath: `/api/components/`,
      method: 'GET',
      schema: Schemas.COMPONENTS
    }
  }
}


export function loadComponents() {
  return (dispatch, getState) => {
    return dispatch(fetchComponents())
  }
}

function fetchChangeAudioSwitch(component) {
  return {
    [CALL_API]: {
      types: [types.CHANGE_AUDIO_SWITCH_REQUEST, types.CHANGE_AUDIO_SWITCH_SUCCESS, types.CHANGE_AUDIO_SWITCH_FAILURE],
      urlPath: `/api/components/switchAudio/${component._id}`,
      uniqueKey: component._id,
      method: 'PUT',
      schema: Schemas.COMPONENTS,
      body: {
        type:"low",
        state: (component.value === 1)?'off':'on'
      }
    }
  }
}


export function changeAudioSwitch(component) {
  return (dispatch, getState) => {
    return dispatch(fetchChangeAudioSwitch(component))
  }
}
