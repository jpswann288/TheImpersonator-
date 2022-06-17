let initialState = {
  usersRepos: [],
  language: {},
  stars: [],
  repoStatus: {status: false}
}

export default function GlobalReducer(state = initialState, action) {
    switch (action.type) {
      case "GET_USERS_REPOS": {
        return Object.assign({}, state, {
          usersRepos: action.payload,
        });
      }
      case "GET_REPO_LANGUAGE": {
        return Object.assign({}, state, {
          language: action.payload,
        });
      }
      case "GET_REPO_STARS": {
        return Object.assign({}, state, {
          stars: action.payload,
        });
      }
      case "RETURN_STATUS": {
        return Object.assign({}, state, {
          repoStatus: action.payload,
        });
      }
    }
    return state;
}