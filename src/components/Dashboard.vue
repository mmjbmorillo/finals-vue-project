<template>
  <div>
    <v-parallax :src="Image">
      <div v-if="user.loggedIn" style="margin-top: 40px;">
      </div>
      <div v-else>
        <v-card class="mx-auto mt-6 bg-info" max-width="25%" variant="outlined">
          <v-card-item color="white">
            <div>
              <div class="text-overline mb-1">
                YOU ARE NOT LOGGED IN!
              </div>
              <div class="text-caption mb-3">Please login if you already have an account, otherwise create one
                now.</div>
            </div>
          </v-card-item>
        </v-card>
      </div>
      <v-divider></v-divider>

      <v-container class="pa-4 text-center">
        <v-row class="fill-height" align="center" justify="center">
          <template v-for="(item, i) in items" :key="i">
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card :disabled="!user.loggedIn" :elevation="isHovering ? 12 : 2" :class="{ 'on-hover': isHovering }"
                  v-bind="props" :to="item.path">
                  <v-img :src="item.img" height="225px" cover>
                    <v-card-title class="text-h6 d-flex justify-center align-center h-100">
                      <p class="mt-4" style="font-family: Feather; font-weight: bold; font-size: 27px;">
                        {{ item.title }}
                      </p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </template>
        </v-row>
      </v-container>

      <v-divider></v-divider>
    </v-parallax>
  </div>

  <v-overlay :model-value="overlay" :opacity="1" :absolute="true" class="align-center justify-center bounce bg-dark">
    <v-progress-circular indeterminate size="64" color="info"></v-progress-circular>
  </v-overlay>

</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { auth } from '../firebase'

//Images
import ImageSrc from '../assets/images/blackbg.jpg'
import hWebsite from '../assets/images/hGuide.png'
import hMath from '../assets/images/hMath.png'
import hString from '../assets/images/hString.png'
import hProfile from '../assets/images/hAbout.png'
import hQuiz from '../assets/images/hQuiz.png'
import hVuetify from '../assets/images/hVuetify.png'

export default {
  data: () => ({
    show: true,
    overlay: true,
    items: [
      {
        title: 'Basic Math',
        img: hMath,
        path: '/basicMath',
      },
      {
        title: 'String Manipulator',
        img: hString,
        path: '/stringApp',

      },
      {
        title: 'About Vuetify',
        img: hVuetify,
        path: '/vuetify',

      },
      {
        title: 'Quiz',
        img: hQuiz,
        path: '/quiz',

      },
      {
        title: 'About the Developer',
        img: hProfile,
        path: '/bonnel',

      },
      {
        title: 'About the Website',
        img: hWebsite,
        path: '/about',

      },
    ],
    transparent: 'rgba(255, 255, 255, 0)',
  }),
  setup() {

    const Image = ImageSrc;
    const store = useStore()
    const router = useRouter()
    auth.onAuthStateChanged(user => {
      store.dispatch("fetchUser", user);
    });
    const user = computed(() => {
      return store.getters.user;
    });
    const signOut = async () => {
      await store.dispatch('logOut')
      router.push('/login')
    }
    return { user, signOut, Image }
  },
  mounted() {
    setTimeout(() => {
      this.overlay = false
    }, 1300)
  }
}
</script>
<style>
  @font-face {
  font-family: "Feather";
  src: local("Feather"),
   url(../assets/feather.ttf) format("truetype");
}
</style>