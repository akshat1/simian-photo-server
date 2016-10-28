'use strict';

const fetch = require('isomorphic-fetch');
const { browserHistory } = require('react-router');

/*
todo
- refer to actions/index.js in async redux example open in sublime
- use isomorphic-fetch (already installed)
- implement the requestPosts, fetchPosts and receivePosts actions
- implement corresponding reducers
- get collections to show up in collections panel
*/

//const fetch = require('isomorphic-fetch');

const REQUEST_COLLECTIONS = 'REQUEST_COLLECTIONS';
const RECEIVE_COLLECTIONS = 'RECEIVE_COLLECTIONS';
const REQUEST_SELECTED_COLLECTION = 'REQUEST_SELECTED_COLLECTION';
const RECEIVE_SELECTED_COLLECTION = 'RECEIVE_SELECTED_COLLECTION';
const REQUEST_SELECTED_PICTURE = 'REQUEST_SELECTED_PICTURE';
const RECEIVE_SELECTED_PICTURE = 'RECEIVE_SELECTED_PICTURE';


function responseToJSON(response) {
  return response.json();
}


function requestCollections() {
  return {
    type: REQUEST_COLLECTIONS
  };
}


function receiveCollections(json) {
  return {
    type: RECEIVE_COLLECTIONS,
    collections: json
  };
}


function requestSelectedCollection() {
  return {
    type: REQUEST_SELECTED_COLLECTION
  };
}


function receiveSelectedCollection(json) {
  return {
    type: RECEIVE_SELECTED_COLLECTION,
    selectedCollection: json
  };
}


function requestSelectedPicture() {
  return {
    type: REQUEST_SELECTED_PICTURE
  };
}


function receiveSelectedPicture(json) {
  return {
    type: RECEIVE_SELECTED_PICTURE,
    selectedPicture: json
  };
}


function fetchCollections() {
  return function (dispatch) {
    dispatch(requestCollections());
    return fetch('/api/collections')
      .then(responseToJSON)
      .then(function (json) {
        dispatch(receiveCollections(json));
        return json;
      })
      .then(function (collections) {
        if (collections && collections[0])
          dispatch(selectCollection(collections[0].id));
      });
  };
}


function selectCollection(collectionId) {
  return function (dispatch) {
    dispatch(requestSelectedCollection());
    return fetch(`/api/collections/${collectionId}`)
      .then(responseToJSON)
      .then(function (json) {
        dispatch(receiveSelectedCollection(json));
        return json;
      });
  };
}


function selectPicture(pictureId) {
  return function (dispatch) {
    dispatch(requestSelectedPicture());
    return fetch(`/api/pictures/${pictureId}`)
      .then(responseToJSON)
      .then(function (json) {
        dispatch(receiveSelectedPicture(json));
      });
  };
}


function navigateToCollection(collectionId) {
  browserHistory.push(`/collection/${collectionId}`);
}


module.exports = {
  REQUEST_COLLECTIONS,
  RECEIVE_COLLECTIONS,
  REQUEST_SELECTED_COLLECTION,
  RECEIVE_SELECTED_COLLECTION,
  REQUEST_SELECTED_PICTURE,
  RECEIVE_SELECTED_PICTURE,
  requestCollections,
  receiveCollections,
  requestSelectedCollection,
  receiveSelectedCollection,
  selectCollection,
  selectPicture,
  fetchCollections,
  navigateToCollection
};
