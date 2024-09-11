export default {
  showModal({ commit }, value) {
    commit("setShowModal", value);
  },
  showModalAboutUs({ commit }, value) {
    console.log('ff')
    commit("setShowModalAboutUs", value);
  },
  showModalReply({ commit }, value) {
    commit("setShowModalReply", value);
  },
  addModalDataToState({ commit }, payload) {
    commit("setModalData", payload);
  },
  setReplyData({commit}, data) {
    commit("setReplyPostData", data);
  },
};
