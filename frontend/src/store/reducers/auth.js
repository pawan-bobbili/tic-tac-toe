import * as actions from "../actions/actionTypes";

const initialState = {
  token: null,
  authenticated: false,
  socket: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.AUTH_SUCCESS:
      return {
        token: action.payload.token,
        authenticated: true,
        socket: action.payload.socket,
      };
    case actions.AUTH_OUT:
      return { token: null, authenticated: false, socket: null };
    default:
      return state;
  }
};

export default authReducer;
