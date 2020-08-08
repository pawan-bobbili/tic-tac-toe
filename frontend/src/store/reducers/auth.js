import * as actions from "../actions/actionTypes";

const initialState = {
    token: null,
    authenticated: false,
    name: null,
    socket: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.AUTH_SUCCESS:
            return {
                token: action.payload.token,
                authenticated: true,
                socket: action.payload.socket,
                name: action.payload.name,
            };
        case actions.AUTH_OUT:
            return {
                token: null,
                authenticated: false,
                socket: null,
                name: null,
            };
        default:
            return state;
    }
};

export default authReducer;
