import axios from "axios";

import * as actionTypes from "./actionTypes";

export const signin = (email, password) => {
  return (dispatch) => {
    axios
      .post(
        "http://localhost:8080/auth/signin",
        JSON.stringify({ email, password }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => dispatch(signinSucces(response.data.token)))
      .catch((err) => console.log(err));
  };
};

const signinSucces = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: token,
  };
};
