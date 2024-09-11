
export default {
  setPosts(state, payload) {
    state.recomendedPosts = payload;
  },
  setReportBotId(state, id) {
    state.reportId = id;
  },
  setPostsSuggested(state, payload) {
    state.suggestedPosts = payload;
  },
  setPost(state, payload) {
    state.recomendedPost = payload;
  },

  setRepliePost(state, payload) {
    state.replies = payload;
  },
  postPost(state, payload) {
    state.post = payload;
  },
  removePost(state, postId) {
    state.recomendedPosts = state.recomendedPosts.filter(post => post.id !== postId);
  },
  updateNow(state) {
    state.now = new Date();
  },
  setProfile(state, profile) {
    state.profile = profile;
  },
  setUserReplies(state, replies) {
    state.userReplies = replies;
  },
  setUserReposts(state, reposts) {
    state.userReposts = reposts;
  },
  setOnlyUserPosts(state, posts) {
    state.onlyUserPosts = posts;
  },
  setReactionsPrices(state, prices) {
    state.reactionsPrices = prices;
  },
  setStatusLoad(state, payload) {
    state.loadStatus = payload;
  }
};
