import { createStore } from "vuex";
import auth from "./auth/index.js";
import main from "./main/index.js";
import modals from "./modal/index.js";

const store = createStore({
  modules: {
    auth,
    main,
    modals
  },
});

export default store;
