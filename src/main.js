import { createApp } from "vue";
import router from "./router";
import store from "./store";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import "primevue/resources/themes/aura-light-green/theme.css";
import "primevue/resources/primevue.min.css"; /* Deprecated */
import "primeicons/primeicons.css";
import App from "./App.vue";

// global import ui-kit components
import BaseButton from "@/components/ui-kit/BaseButton/index.vue";
import BaseField from "@/components/ui-kit/BaseField/index.vue";
import BaseTextarea from "@/components/ui-kit/BaseTextarea/index.vue";
import BaseDropdown from "@/components/ui-kit/BaseDropdown/index.vue";
import BaseRange from "@/components/ui-kit/BaseRange/index.vue";
import BaseModal from "@/components/ui-kit/BaseModal/index.vue";
import BaseToggle from "@/components/ui-kit/BaseToggle/index.vue";
import BaseRangeSelect from "@/components/ui-kit/BaseRangeSelect/index.vue";
import BaseAvatar from "@/components/ui-kit/BaseAvatar/index.vue";

const app = createApp(App);
app.component("BaseButton", BaseButton);
app.component("BaseField", BaseField);
app.component("BaseTextarea", BaseTextarea);
app.component("BaseDropdown", BaseDropdown);
app.component("BaseRange", BaseRange);
app.component("BaseModal", BaseModal);
app.component("BaseToggle", BaseToggle);
app.component("BaseAvatar", BaseAvatar);
app.component("BaseRangeSelect", BaseRangeSelect);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.use(store);
app.use(router);
app.mount("#app");
