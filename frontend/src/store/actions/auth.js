import axios from "axios";

import * as actionTypes from "./actionTypes";

import io from "socket.io-client";

let socket;

export const signin = (email, password) => {
  return (dispatch) => {
    axios
      .post(
        "http://localhost:8080/auth/signin",
        JSON.stringify({ email, password }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => dispatch(signinSucces(response.data.token, email)))
      .catch((err) => console.log(err));
  };
};

const signinSucces = (token, email) => {
  socket = io.connect("http://localhost:8080", { query: { email: email } }); //Same as io("URI");
  socket.connect();
  //console.log(socket.id);    socket.id is always undefined on client side
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: { token, socket },
  };
};

export const signout = () => {
  socket.disconnect();
  socket = null;
  return {
    type: actionTypes.AUTH_OUT,
  };
};
