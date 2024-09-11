import state from "./state";

export default {
  getRecomendedPosts: (state) => state.recomendedPosts,
  getSuggestedPosts: (state) => state.suggestedPosts,
  getRecomendedPost: (state) => state.recomendedPost,
  getRepliesPosts: (state) => state.replies,
  getPost: (state) => state.post,
  getCurrentTime: (state) => state.now,
  getProfile: (state) => state.profile,
  getUserReplies: (state) => state.userReplies,
  getUserReposts: (state) => state.userReposts,
  getOnlyUserPosts: (state) => state.onlyUserPosts,
  getReactionsPrices: (state) => state.reactionsPrices,
  getLoadStatus: (state) => state.loadStatus,
  getReportPostId: (state) => state.reportId
};
