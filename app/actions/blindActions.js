import * as types from './actionTypes';
import {
  CALL_API,
  Schemas
} from '../middleware/api'


function fetchUpBlindSwitch(component, targetState) {
  return {
    [CALL_API]: {
      types: [types.UP_BLIND_REQUEST, types.UP_BLIND_SUCCESS, types.UP_BLIND_FAILURE],
      urlPath: `/api/components/switchBlind/${component._id}`,
      uniqueKey: component._id,
      method: 'PUT',
      schema: Schemas.COMPONENTS,
      body: {
        state: targetState
      }
    }
  }
}

export function upStartBlind(component) {
  return (dispatch, getState) => {
    debugger;
    return dispatch(fetchUpBlindSwitch(component, 'upStart'))
  }
}

export function upStopBlind(component) {
  return (dispatch, getState) => {
    return dispatch(fetchUpBlindSwitch(component, 'upStop'))
  }
}

function fetchDownBlindSwitch(component, targetState) {
  return {
    [CALL_API]: {
      types: [types.DOWN_BLIND_REQUEST, types.DOWN_BLIND_SUCCESS, types.DOWN_BLIND_FAILURE],
      urlPath: `/api/components/switchBlind/${component._id}`,
      uniqueKey: component._id,
      method: 'PUT',
      schema: Schemas.COMPONENTS,
      body: {
        state: targetState
      }
    }
  }
}



export function downStartBlind(component) {
  return (dispatch, getState) => {
    debugger;
    return dispatch(fetchDownBlindSwitch(component, 'downStart'))
  }
}

export function downStopBlind(component) {
  return (dispatch, getState) => {
    return dispatch(fetchDownBlindSwitch(component, 'downStop'))
  }
}
