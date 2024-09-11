import { data } from "autoprefixer";

export default {
  async setRecomendedPosts({ commit }) {
    const params = new URLSearchParams({ limit: '30', showOwnPosts: true }).toString();
    let response = await fetch(`/api/posts/recommended?${params}`);
    let posts = await response.json();
    commit("setPosts", posts.results);
    return posts;
  },
  async setNextPagonationPosts({ commit }, after) {
    const params = new URLSearchParams({ limit: '30', showOwnPosts: true, after: after }).toString();
    let response = await fetch(`/api/posts/recommended?${params}`);
    let posts = await response.json();
    return posts;
  },
  async setSuggestedPosts({ commit }, payload) {
    const params = new URLSearchParams({ limit: '50' }).toString();
    let response = await fetch(`/api/posts/recommended?${params}`);
    let posts = await response.json();
    commit("setPostsSuggested", posts.results);
  },
  async setRecomendedPost({ commit }, payload) {
    let response = await fetch(`/api/posts/${payload}`);
    let posts = await response.json();
    commit("setPost", posts);
  },
  async setFollowingPosts({ commit }, payload) {
    let response = await fetch(`/api/posts/following`);
    let posts = await response.json();
    commit("setPosts", posts.results);
  },
  async setUserPosts({ commit }, payload) {
    let params = new URLSearchParams({ limit: '300' }).toString();
    if(payload?.id) {
      params = new URLSearchParams({ limit: '300', authorUserId: payload?.id }).toString();
    }
    let response = await fetch(`/api/posts?${params}`);
    let posts = await response.json();
    commit("setPosts", posts.results);
  },
  async setProfile({ commit }, id) {
    let response = await fetch(`/api/users/${id}`);
    let profile = await response.json();
    console.log(profile)
    commit("setProfile", profile);
    return profile;
  },
  async setRepliesPosts({ commit }, payload) {
    let response = await fetch(`/api/posts/${payload}/replies`);
    let posts = await response.json();
    commit("setRepliePost", posts.results);
  },
  async setUpdateStatus({ commit }, payload) {
    commit("setStatusLoad", payload);
  },
  async setPost({ commit }, {title, text, repostedPostId, attachedFileIds, isAnyoneCanReply, postToTwitter, urls, toast}) {
    try {
      const response = await fetch (
        `/api/posts`,
        {
          method: 'POST',
          body: JSON.stringify({
            title: title ? title : undefined,
            text,
            repostedPostId: repostedPostId ? repostedPostId : undefined,
            attachedFileIds: attachedFileIds ? attachedFileIds : undefined,
            isAnyoneCanReply: isAnyoneCanReply,
            postToTwitter: postToTwitter,
            urls: urls?.[0] ? [{
              url: urls[0].url,
              title: urls[0].title,
              description: urls[0].description,
              imageUrl: urls[0].imageUrl
            }] : undefined
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 429) {
        toast.add({
          severity: 'error',
          summary: 'Sorry, you have reached the max number of posts allowed for users with your score',
          life: 7000,
        });
        return;
      }

      if (response.status === 409) {
        toast.add({
          severity: 'error',
          summary: 'You are not allowed to reply to this post/reply',
          life: 7000,
        });
        return;
      }

      const data = await response.json();

      if (data.error) {
        console.log('error', data.message);
      } else {
        if (!data.statusCode) {
          commit("postPost", data);
          toast.add({
            severity: "success",
            summary: "Post created",
            life: 7000,
          });
        } else {
          commit("setUserDataError", data);
        }
      }

    } catch (error) {
      console.log('error', error)
      commit("setUserDataError", error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 7000,
      });
    }
  },
    async updatePost({ commit }, {title, text, isAnyoneCanReply, id, toast}) {
    try {
      const response = await fetch (
        `/api/posts/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            title: title ? title : undefined,
            text,
            isAnyoneCanReply: isAnyoneCanReply,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 429) {
        toast.add({
          severity: 'error',
          summary: 'Sorry, you have reached the max number of posts allowed for users with your score',
          life: 7000,
        });
        return;
      }

      const data = await response.json();

      if (data.error) {
        console.log('error', data.message);
      } else {
        if (!data.statusCode) {
          toast.add({
            severity: "success",
            summary: "Post updated",
            life: 7000,
          });
        } else {
          commit("setUserDataError", data);
        }
      }

    } catch (error) {
      console.log('error', error)
      commit("setUserDataError", error);
    }
  },
  async deletePost({ commit }, postId) {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        commit('removePost', postId);
      } else {
        throw new Error('Failed to delete the post');
      }
    } catch (error) {
      console.error('Error in deletePost action:', error.message);
    }
  },
  startGlobalTimer({ commit }) {
    setInterval(() => {
      commit('updateNow');
    }, 60000);
  },
  async setUserReplies({ commit }, userId) {
    const response = await fetch(`/api/users/${userId}/replies`);
    let replies = await response.json();
    commit('setUserReplies', replies.results);
  },
  async setUserReposts({ commit }, userId) {
    const response = await fetch(`/api/users/${userId}/reposts`);
    let reposts = await response.json();
    commit('setUserReposts', reposts.results);
  },
  async setOnlyUserPosts({ commit }, payload) {
    let params = new URLSearchParams({ limit: '533' }).toString();
    if(payload?.id) {
      params = new URLSearchParams({ limit: '533', authorUserId: payload?.id, onlyPosts: true }).toString();
    }
    let response = await fetch(`/api/posts?${params}`);
    let posts = await response.json();
    commit("setOnlyUserPosts", posts.results);
  },
  async fetchReactionsPrices({ commit }) {
    const response = await fetch(`/api/posts/reaction-prices`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let data = await response.json();
    commit('setReactionsPrices', data);
  },
  async fetchReportBotId({commit}, id) {
    commit('setReportBotId', id);
  }
};
