export const SET_FETCHING_GROUPS   = 'SET_FETCHING_GROUPS';
export const RECEIVED_GROUPS       = 'RECEIVED_GROUPS';
export const SET_FETCHING_GROUP    = 'SET_FETCHING_GROUP';
export const RECEIVED_GROUP        = 'RECEIVED_GROUP';
export const SET_ACTIVE_GROUP      = 'SET_ACTIVE_GROUP';
export const SET_ACTIVE_PICTURE    = 'SET_ACTIVE_PICTURE';
export const SET_FETCHING_PICTURES = 'SET_FETCHING_PICTURES';
export const RECEIVED_PICTURES     = 'RECEIVED_PICTURES';
export const SET_FETCHING_PICTURE  = 'SET_FETCHING_PICTURE';
export const RECEIVED_PICTURE      = 'RECEIVED_PICTURE';
export const ERROR_OCCURRED        = 'ERROR_OCCURRED';

function action (type, data) {
  return {
    type,
    data
  }
}

function getJSON (response) {
  return response.json();
}

function recordError (err) {
  console.error(err);
  return dispatch(action(ERROR_OCCURRED, err));
}

// TODO: This should be called fetchGroups
export function fetchCollections (query) {
  return function(dispatch) {
    dispatch(action(SET_FETCHING_GROUPS, true));
    return fetch('/api/groups')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        const {data, pagination, sort} = json;
        dispatch(action(RECEIVED_GROUPS, json));
        dispatch(action(SET_FETCHING_GROUPS, false));
        return json;
      })
      .catch(recordError);
  };
}

export function fetchGroup ({groupId}) {
  return function(dispatch) {
    dispatch(action(SET_FETCHING_GROUP, true));
    const url = `/api/group/${groupId}`;
    return fetch(url)
      .then(getJSON)
      .then(function(group) {
        dispatch(action(RECEIVED_GROUP, group));
        dispatch(action(SET_FETCHING_GROUP, false));
        return group;
      })
      .catch(recordError);;
  }
}

export function fetchPictures ({groupId}) {
  return function(dispatch) {
    dispatch(action(SET_FETCHING_PICTURES, true));
    const url = `/api/group-contents/${groupId}`;
    return fetch(url)
      .then(getJSON)
      .then(function(json) {
        dispatch(action(RECEIVED_PICTURES, json));
        dispatch(action(SET_FETCHING_PICTURES, false));
        return json;
      })
      .catch(recordError);
  }
}

export function fetchPicture (pictureId) {
  return function(dispatch) {
    dispatch(action(SET_FETCHING_PICTURE, true));
    const url = `/api/picture/${pictureId}`;
    return fetch(url)
      .then(getJSON)
      .then(function(picture) {
        dispatch(action(RECEIVED_PICTURE, picture));
        dispatch(action(SET_FETCHING_PICTURE, false));
        return picture;
      })
      .catch(recordError);
  }
}

export function setActiveGroup (groupId) {
  return function(dispatch) {
    console.log('setActiveGroup');
    return Promise.all([
      dispatch(fetchGroup({ groupId })),
      dispatch(fetchPictures({ groupId }))
    ])
  };
}
