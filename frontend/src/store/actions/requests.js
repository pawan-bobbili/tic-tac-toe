import * as actionTypes from "./actionTypes";

export const addRequest = (data) => {
    return {
        type: actionTypes.ADD_REQUEST,
        payload: { ...data },
    };
};

export const removeRequest = (data) => {
    return {
        type: actionTypes.REMOVE_REQUEST,
        payload: { ...data },
    };
};

export const clearRequests = () => {
    return {
        type: actionTypes.CLEAR_REQUESTS,
    };
};
