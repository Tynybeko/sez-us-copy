export const getUser = () => {
  let user = localStorage.getItem('user');
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
  return user
}

export default () => ({
  user: getUser(),
  error: null,
  showSmsCodeInput: false,
  userPhone: '',
  firstName: '',
  lastName: '',
  birthDate: '',
});
