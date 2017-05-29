import {
  SET_FETCHING_GROUPS,
  RECEIVED_GROUPS,
  SET_FETCHING_PICTURES,
  RECEIVED_PICTURES,
  SET_FETCHING_PICTURE,
  RECEIVED_PICTURE
} from '../actions';

/**
 * A utility to make simple reducers.
 */
function makeReducer (type, defaultState) {
  return function (state, action) {
    return action.type === type ? action.data : (state || defaultState);
  }
}

const groups             = makeReducer(RECEIVED_GROUPS, {});
const isFetchingGroups   = makeReducer(SET_FETCHING_GROUPS, false);
const pictures           = makeReducer(RECEIVED_PICTURES, []);
const isFetchingPictures = makeReducer(SET_FETCHING_PICTURES, false);
const picture            = makeReducer(RECEIVED_PICTURE, []);
const isFetchingPicture  = makeReducer(SET_FETCHING_PICTURE, false);

function rootReducer (state = {}, action) {
  return {
    groups:             groups(state.groups, action),
    isFetchingGroups:   isFetchingGroups(state.isFetchingGroups, action),
    pictures:           pictures(state.pictures, action),
    isFetchingPictures: isFetchingPictures(state.isFetchingPictures, action),
    picture:            picture(state.picture, action),
    isFetchingPicture:  isFetchingPicture(state.isFetchingPicture, action)
  }
}

export default rootReducer;
