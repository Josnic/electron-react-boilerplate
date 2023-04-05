import AuthTypes from "./constants";

const initialState = {
    isAuthenticated: false,
    token: ""
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case AuthTypes.LOGIN:
        return {
          ...state,
          isAuthenticated: true,
          token: action.token
        }
      case AuthTypes.LOGOUT:
        return {
          ...state,
          isAuthenticated: false,
          token: "" 
        }
      default:
        return state;
    }
  }
  
  export default authReducer;