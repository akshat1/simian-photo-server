import {
  SET_FETCHING_GROUPS,
  RECEIVED_GROUPS
} from '../actions';

function groups (state = [], {type, data}, entireState) {
  return type === RECEIVED_GROUPS ? data : state;
}

function isFetchingGroups (state = false, {type, data}) {
  return type === SET_FETCHING_GROUPS ? data : state;
}

/*
Notice the lack of combine reducers. Now each reducer has access to the entire state.
*/
function rootReducer (state = {}, action) {
  return {
    groups: groups(state.groups, action, state),
    isFetchingGroups: isFetchingGroups(state.isFetchingGroups, action, state)
  }
}

export default rootReducer;
