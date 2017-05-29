export const SET_FETCHING_GROUPS   = 'SET_FETCHING_GROUPS';
export const RECEIVED_GROUPS       = 'RECEIVED_GROUPS';
export const SET_FETCHING_PICTURES = 'SET_FETCHING_PICTURES';
export const RECEIVED_PICTURES     = 'RECEIVED_PICTURES';
export const SET_FETCHING_PICTURE  = 'SET_FETCHING_PICTURE';
export const RECEIVED_PICTURE      = 'RECEIVED_PICTURE';

function action(type, data) {
  return {
    type,
    data
  }
}

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
      .catch(function(err) {
        console.log('error:', err);
      });
  };
}

export function fetchPictures ({groupId}) {
  return function(dispatch) {
    dispatch(action(SET_FETCHING_PICTURES, true));
    const url = `/api/group-contents/${groupId}`;
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        dispatch(action(RECEIVED_PICTURES, json));
        dispatch(action(SET_FETCHING_PICTURES, false));
        return json;
      })
      .catch(function(err) {
        console.log('error:', err);
      });
  }
}

export function fetchPicture(pictureId) {
  return function(dispatch) {
    dispatch(action(SET_FETCHING_PICTURE, true));
    const url = `/api/picture/${pictureId}`;
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(picture) {
        dispatch(action(RECEIVED_PICTURE, picture));
        dispatch(action(SET_FETCHING_PICTURE, false));
        return picture;
      })
      .catch(function(err) {
        console.log('error:', err);
      });
  }
}
