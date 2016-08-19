'use strict';

const { combineReducers } = require('redux');
const {
  REQUEST_COLLECTIONS,
  RECEIVE_COLLECTIONS,
  REQUEST_SELECTED_COLLECTION,
  RECEIVE_SELECTED_COLLECTION
} = require('../actions');
const initialState = require('../store/initialState.js');
console.log(initialState);


function isFetchingCollections(isFetchingCollections = false, action) {
  //console.log(arguments);
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


function collections(collections = [], action) {
  switch (action.type) {
    case RECEIVE_COLLECTIONS: return action.collections;
    default: return collections;
  }
}


function selectedCollection(selectedCollection = null, action) {
  switch (action.type) {
    // invalidate previous collection
    case REQUEST_SELECTED_COLLECTION: return null;
    case RECEIVE_SELECTED_COLLECTION: return action.selectedCollection;
    default: return selectedCollection;
  }
}


const rootReducer = combineReducers({
  isFetchingCollections,
  isFetchingSelectedCollection,
  collections,
  selectedCollection
});

module.exports = rootReducer;
