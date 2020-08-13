import * as CONSTANTS from "./Constants";

// If multiple components need access to some data, in that case we store such data in redux.
const initialState = {
  loggedInUser: null,
  someoneLoggedIn: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.SET_LOGGED_IN_USER:
      return { ...state, loggedInUser: action.payload, someoneLoggedIn: true };
    case CONSTANTS.LOGOUT:
      return { ...state, loggedInUser: null, checkedOutItems: [], someoneLoggedIn: false };
    default:
      return state;
  }
};

export default rootReducer;
