import * as actionTypes from "../actions/actionTypes";

const initialState = {
    requests: [],
};

const requestReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_REQUEST:
            return { requests: [...state.requests, { ...action.payload }] };
        case actionTypes.REMOVE_REQUEST:
            return {
                requests: [...state.requests].filter(
                    (request) => request.from !== action.payload.name
                ),
            };
        case actionTypes.CLEAR_REQUESTS:
            return { requests: [] };
        default:
            return state;
    }
};

export default requestReducer;
