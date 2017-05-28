export const SET_FETCHING_GROUPS = 'SET_FETCHING_GROUPS';
export const RECEIVED_GROUPS     = 'RECEIVED_GROUPS';

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
        console.log('json ->', json);
        const {data, pagination, sort} = json;
        dispatch(action(RECEIVED_GROUPS, json));
        dispatch(action(SET_FETCHING_GROUPS, false));
        return json;
      })
      .catch(function(err) {
        console.log('error: ', err);
      });
  };
}
