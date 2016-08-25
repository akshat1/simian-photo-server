'use strict';

const { combineReducers } = require('redux');
const {
  REQUEST_COLLECTIONS,
  RECEIVE_COLLECTIONS,
  REQUEST_SELECTED_COLLECTION,
  RECEIVE_SELECTED_COLLECTION,
  REQUEST_SELECTED_PICTURE,
  RECEIVE_SELECTED_PICTURE
} = require('../actions');
const initialState = require('../store/initialState.js');


function isFetchingCollections(isFetchingCollections = false, action) {
  switch (action.type) {
    case REQUEST_COLLECTIONS: {
      return true;
    }

    case RECEIVE_COLLECTIONS: {
      return false;
    }

    default: return isFetchingCollections;
  }
}


function isFetchingSelectedCollection(isFetchingSelectedCollection = false, action) {
  switch (action.type) {
    case REQUEST_SELECTED_COLLECTION: return true;
    case RECEIVE_SELECTED_COLLECTION: return false;
    default: return isFetchingSelectedCollection;
  }
}


function isFetchingSelectedPicture(isFetchingSelectedPicture = false, action) {
  switch (action.type) {
    case REQUEST_SELECTED_PICTURE: return true;
    case RECEIVE_SELECTED_PICTURE: return false;
    default: return isFetchingSelectedPicture;
  }
}


function collections(collections = [], action) {
  switch (action.type) {
    case REQUEST_COLLECTIONS: return [];
    case RECEIVE_COLLECTIONS: return action.collections;
    default: return collections;
  }
}


function selectedCollection(selectedCollection = null, action) {
  switch (action.type) {
    case REQUEST_SELECTED_COLLECTION: return null;
    case RECEIVE_SELECTED_COLLECTION: return action.selectedCollection;
    default: return selectedCollection;
  }
}


function selectedPicture(selectedPicture = null, action) {
  switch (action.type) {
    case REQUEST_SELECTED_PICTURE: return null;
    case RECEIVE_SELECTED_PICTURE: return action.selectedPicture;
    default: return selectedPicture;
  }
}


const rootReducer = combineReducers({
  isFetchingCollections,
  isFetchingSelectedCollection,
  isFetchingSelectedPicture,
  collections,
  selectedCollection,
  selectedPicture
});

module.exports = rootReducer;
