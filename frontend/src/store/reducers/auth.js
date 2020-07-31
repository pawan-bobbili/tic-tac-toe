import * as actions from "../actions/actionTypes";

const initialState = {
  token: null,
  authenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.AUTH_SUCCESS:
      return { token: action.payload, authenticated: true };
    case actions.AUTH_OUT:
      return { token: null, authenticated: false };
    default:
      return state;
  }
};

export default authReducer;
