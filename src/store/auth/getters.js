import state from "./state";

export default {
  getAuthUser: (state) => state.user,
  getUser: (state) => {
    let user = state.user;
    if(!user){
      return null
    }
    if(typeof user === 'string'){
      try {
        user = user ? JSON.parse(user) : null;
      } catch (error) {
        user = null;
      }
    }

    console.log('getUSER', user)
    return user
  },
  getAuthError: (state) => state.error,
  getShowSmsCodeInput: (state) => state.showSmsCodeInput,
  getUserPhone: (state) => state.userPhone,
  getFirstName: (state) => state.firstName,
  getLastName: (state) => state.lastName,
  getBirthDate: (state) => state.birthDate
};
