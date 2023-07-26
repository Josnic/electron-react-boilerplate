import AuthTypes from "./constants";

const initialState = {
    isAuthenticated: false,
    user: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case AuthTypes.LOGIN:
        return {
          ...state,
          isAuthenticated: true,
          user: action.user
        }
      case AuthTypes.LOGOUT:
        return {
          ...state,
          isAuthenticated: false,
          user: null 
        }
      default:
        return state;
    }
  }
  
  export default authReducer;