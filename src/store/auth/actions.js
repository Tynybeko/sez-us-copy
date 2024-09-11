import router from "../../router";
import {getUser} from "@/store/auth/state.js";
import {useToast} from "primevue/usetoast";

export default {
  async getMe({commit}){
    const user = getUser()
    if(!user){
      console.error('Get Me: user not found')
      return
    }
    try {
      let response = await fetch(`/api/users/${user.id}`);
      let profile = await response.json();
      localStorage.setItem("user",JSON.stringify(profile));
      commit("setUserData", profile);
    }catch(err){
      console.error(err);
    }
  },
  signUp({ commit }, {phone, password}) {
    try {
      fetch(
        `/api/users/signup`,
        {
          method: 'POST',
          body: JSON.stringify({
            phone,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then(async (data) => {
          if(data.error) {
            console.log('error', data.message)
          } else {
            let response = await fetch(`/api/users/${data.id}`);
            let profile = await response.json();
            localStorage.setItem("user",JSON.stringify(profile));
            commit("setUserData", profile);
            router.push('/');
          }
        });
    } catch (error) {
        console.log('error', error)
    }
  },
  logIn({ commit }, {phone, password}) {
    try {
      fetch(
        `/api/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            phone,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then(async (data) => {
          if(data.error) {
            console.log('error', data.message)
          } else {
            if(!data.satusCode) {
              let response = await fetch(`/api/users/${data.id}`);
              let profile = await response.json();
              localStorage.setItem("user",JSON.stringify(profile));
              commit("setUserData", profile);
              router.push('/');
            } else {
              commit("setUserDataError", data);
            }
          }
        });
    } catch (error) {
        console.log('error', error)
        commit("setUserDataError", error);
    }
  },
  async logOut({ commit }, id) {
    let response = await fetch(`/api/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if(response.ok) {
      let data = null;
      localStorage.removeItem("user");
      localStorage.removeItem("isFirstLogin");
      commit("setProfile", data);
      window.location.reload();
    }
  },
  
  async sendSmsCode({ commit }, { phone }) {
    try {
      const response = await fetch(`/api/auth/login-sms/send`, {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 204) {
        commit("setShowSmsCodeInput", true);
        return {
          message: 'Success',
          status: 'success'
        }
      } else {
        const data = await response.json();
        console.log("error", data.message);
        return {
          message: data.message,
          status: 'error'
        }
      }
    } catch (error) {
      console.log("error", error);
      return {
        message: 'Server error',
        status: 'error'
      }
    }
  },
  async verifySmsCode({ commit }, { phone, code }) {
    try {
      const response = await fetch(`/api/auth/login-sms/check`, {
        method: "POST",
        body: JSON.stringify({ phone, code }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        console.log("error", data.message);
        commit("setUserDataError", data.message);
        return {
          status: 'error',
          message: data.message
        }
      }
      if (!data.statusCode) {
        let response = await fetch(`/api/users/${data.id}`);
        let profile = await response.json();
        localStorage.setItem("user",JSON.stringify(profile));
        commit("setUserData", profile);
        return {
          status: 'success',
          message: ''
        }
      } else {
        commit("setUserDataError", data);
        return {
          status: 'error',
          message: data.message
        }
      }
    } catch (error) {
      console.log("error", error);
      commit("setUserDataError", error.message);
      return {
        status: 'error',
        message: error.message
      }
    }
  },
  async logInWithX({commit}, { oauthToken, oauthVerifier }) {
    try {
      const response = await fetch(`/api/auth/login-x/access-token`, {
        method: "POST",
        body: JSON.stringify({
          oauthToken,
          oauthVerifier,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        console.log("error", data.message);
        commit("setUserDataError", data.message);
        return {
          status: 'error',
          message: data.message
        }
      }
      if (!data.statusCode) {
        let response = await fetch(`/api/users/${data.id}`);
        let profile = await response.json();
        localStorage.setItem("user",JSON.stringify(profile));
        router.push('/');
        commit("setUserData", profile);
        return {
          status: 'success',
          message: ''
        }
      } else {
        commit("setUserDataError", data);
        return {
          status: 'error',
          message: data.message
        }
      }
    } catch (error) {
      console.log("error", error);
      commit("setUserDataError", error.message);
      return {
        status: 'error',
        message: error.message
      }
    }
  },
  async authWithX({commit,}) {
    try {
      const response = await fetch(`/api/auth/login-x/request-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        console.log("error", data.message);
        commit("setUserDataError", data.message);
      }
      if (!data.statusCode) {
        document.location.href = `https://api.x.com/oauth/authenticate?oauth_token=${data.oauthToken}`;
      } else {
        commit("setUserDataError", data);
      }
    } catch (error) {
      
    }
  }
};
