import {
  Schema,
  arrayOf,
  normalize
} from 'normalizr'
import {
  camelizeKeys
} from 'humps'

async function ping() {

  try {
    let response = await fetch('http://ij7376.myfoscam.org/api/app/ping');

    if(response.status===200){
      return "http://ij7376.myfoscam.org";
    }
    response = await fetch('http://10.0.2.21/api/app/ping');

    if(response.status===200){
      return "http://10.0.2.21";
    }
    return "";
  } catch(e) {
    console.log(e);
  }
}

async function callApi(urlPath, schema, method, body) {

  let domain = await ping();

  var fetchObject = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    method: method
  };

  if (method !== 'GET') {
    fetchObject.body = JSON.stringify( body )
  }
  let response = await fetch(domain + urlPath, fetchObject);

  let json = await response.json();

  var normalieObject ={};
  if(json instanceof Array){
    normalieObject = normalize(json, arrayOf(schema));
  } else {
    normalieObject = normalize(json, schema);
  }
  return Object.assign({},normalieObject, {});

}


const componentSchema = new Schema('component',{ idAttribute: '_id' })
const gpioSchema = new Schema('gpio', { idAttribute: '_id' })
componentSchema.define({
  gpios: arrayOf(gpioSchema)
})

// Schemas for Github API responses.
export const Schemas = {
  COMPONENTS: componentSchema
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default  store => next => action => {

  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let {
    urlPath
  } = callAPI
  const {
    schema,
    types,
    method,
    body,
    uniqueKey
  } = callAPI


  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof urlPath !== 'string') {
    throw new Error('Specify a string endpoint path URL.')
  }

  if (typeof method !== 'string') {
    throw new Error('Specify a string method')
  }
  if (method !== 'GET' && method !== 'POST' && method !== 'PUT' && method !== 'DELETE') {
    throw new Error('Specify a method value: GET|POST|PUT|DELETE')
  }

  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }


  function  actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types

  next(actionWith({
    type: requestType,
    body: body,
    uniqueKey: uniqueKey
  }))

  return callApi(urlPath, schema, method, body).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
