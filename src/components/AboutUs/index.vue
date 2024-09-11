<script setup>
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import { useStore } from "vuex";
const store = useStore();
const showModalAboutUs = (status) => store.dispatch("showModalAboutUs", status);
const formDef = {
  firstname: '',
  lastname: '',
  email: '',
  twitter: ''
}
const formRef = ref(null)
const form = ref({...formDef})
const toast = useToast()

const modalHide = () => {
  showModalAboutUs(false);
  localStorage.setItem("isFirstLogin", true);
  document.body.style.overflow = "auto";
};

function submit(event) {
  event.preventDefault();

  let firstname = form.value.firstname;
  let lastname = form.value.lastname;
  let email = form.value.email
  let twitter = form.value.twitter;
  let data = {};

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (twitter === '') {
    data = {
      firstName: firstname,
      lastName: lastname,
      email: email
    };
  } else {
    data = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      twitterUsername: twitter
    };
  }

  fetch('https://sez.us/api/beta-users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            throw new Error(errData.message.join(", "));
          });
        }
        return response.json();
      })
      .then(data => {
        toast.add({
          severity: "success",
          summary: "Thanks! You will now receive updates on Sez Us via email.",
          life: 7000,
        });
        form.value = {...formDef}
      })
      .catch((error) => {
        console.error(error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: 'There was an error with your sign up. Please try again. ' + error,
          life: 7000
        });
      });
}
</script>

<template>
  <Toast />
  <div class="relative z-10">
    <label class="text-[#fff] cursor-pointer opacity-50 rounded-[100%] fixed right-8 top-6 bg-[rgba(0,0,0)] w-10 h-10 flex items-center justify-center" @click="modalHide"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
    <div class="main">
      <div class="logo"><img alt="logo" src="/icon/Logo.svg"></div>
      <div class="container info">
        <h1 class="info-title">For Democracy and Community: A Social Media Declaration of Independence</h1>
        <div class="content">
          <p>When in the course of human interaction, it becomes necessary for one people to dissolve the social media platforms that further division and hate and have long dominated and controlled their digital lives, and to assume the equal station to which the laws of nature and digital freedom entitle them. Our democracy demands nothing less.</p>
          <p>We hold these truths to be self-evident, that all users are created equal, endowed with certain unalienable rights, that among these are ownership of their digital identity and reputation, privacy, transparency, and the pursuit of genuine connection.</p>
          <p>The history of the present social media giants is a history of the establishment of an absolute tyranny over users and their personal data, which has been manipulated to promote division and is eroding the social fabric required to strengthen democracy and community.</p>
          <ul>
            <li>They have centralized control, allowing CEOs and a few individuals to dictate rules and policies without accountability to users.</li>
            <li>They have used opaque algorithms that amplify division, hatred, and sensationalism, undermining the real conversations necessary for democracy.</li>
            <li>They have monetized user data and content, generating billions in profits while offering little to no compensation to the creators and users who generate this value.</li>
            <li>They have allowed bots, inauthentic users and bad-faith actors to thrive, creating toxic environments and undermining the trust and respect necessary for healthy debate and discourse.</li>
            <li>They have lacked transparency in their operations, leaving users in the dark about how their data is used and how content is moderated.</li>
          </ul>
          <p>We, therefore, solemnly publish and declare that we are free and independent users; and in our pursuit of genuine connection we desire:</p>
          <ul>
            <li><strong>Authentic Identities and Reputations:</strong> human interactions that reward those who build trust and respect with their actions. We must own our identities, our content, and the revenue we generate.</li>
            <li><strong>Transparency and Accountability:</strong> that all published data is bound to an identity, that we know how our data is used as well as how and why policies governing our speech are implemented.</li>
            <li><strong>Privacy and confidentiality:</strong> the right to restrict the use of our information or to remove it.</li>
            <li><strong>Economic Empowerment:</strong> users and creators must have transparent revenue relationships and ad revenue sharing. We should benefit financially from our contributions as both creators and consumers.</li>
            <li><strong>Technological Evolution for Democracy:</strong> we must have influence over these communications systems in order to evolve them as our needs change.</li>
          </ul>
          <p>We, united in the pursuit of a free, open, and equitable digital community, do hereby declare our independence from the centralized control of social media giants and dedicate ourselves to joining a social media movement of, by, and for the people, in order to secure our democracy.</p>
          <p>Democracy demands community and authentic conversation, and with this declaration, we commit to a future where social media empowers users, fosters genuine connection, and upholds the highest standards of reputation and trust.</p>
          <p>Sez Us is a new platform based on the principles of this declaration. Sign up for our launch just weeks away and tell your friends!</p>
        </div>
      </div>
      <div class="container signup">
        <form @submit="submit" ref="formRef" id="signup-form">
          <div class="form-group">
            <label class="label-accent" for="firstname">Name <span>(required)</span></label>
            <div class="name-group">
              <div>
                <label class="label-default" for="firstname">First Name</label>
                <input v-model.trim="form.firstname" type="text" id="firstname" name="firstname" required="">
              </div>
              <div>
                <label class="label-default" for="lastname">Last Name</label>
                <input v-model.trim="form.lastname" type="text" id="lastname" name="lastname" required="">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="label-accent" for="email">Email <span>(required)</span></label>
            <input v-model.trim="form.email" type="email" id="email" name="email" required="">
          </div>
          <div class="form-group">
            <label class="label-accent" for="twitter">X (Twitter) Username</label>
            <input v-model.trim="form.twitter" type="text" id="twitter" name="twitter" placeholder="@">
          </div>
          <div class="submit-button">
            <button type="submit">SIGN UP</button>
          </div>
        </form>
      </div>
    </div>
    <div class="footer">
      <div class="footer-logo">
        <div>Sez Us</div>
        <div>The Future of Social Media</div>
      </div>
      <div class="footer-links">
        <RouterLink to="/privacy">Privacy Policy</RouterLink>
        <a class="d-none" href="">Terms of Service</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "/src/assets/scss/aboutUs.scss";
</style>