export default {
  setShowModal(state, status) {
    state.showModal = status;
  },
  setShowModalReply(state, status) {
    state.showModalReply = status;
  },
  setShowModalAboutUs(state, status) {
    console.log('55')
    state.showModalAboutUs = status;
  },
  setModalData(state, payload) {
    state.modalData = payload;
  },
  setReplyPostData(state, data) {
    state.replyPostData = data;
  }
};
