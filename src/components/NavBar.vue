<template>


  <v-toolbar class="pa-1" style="background-color:#003865; color: white;" app>
    <v-toolbar-title><h1 style="margin-right:500px; margin-top: 12px; color: #FEB139; font-family: Feather; font-weight: bolder; font-size: 27px;">FINALS PROJECT</h1></v-toolbar-title>
    <img alt="Vue logo" class="logo" src="../assets/images/vuetify-logo.png" width="40" height="40" style="margin-left: 200px;"/>
    <v-spacer></v-spacer>

    <div v-if="user.loggedIn">
      <v-btn color="#FEB139" class="font-weight-bold" @click.prevent="signOut" href="/" prepend-icon="mdi-logout-variant" style="font-family: Feather;">
        Logout
      </v-btn>
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" color="#FEB139">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" router :to="item.path" :prepend-icon="item.icon">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-else>
      <v-btn color="#FEB139" class="font-weight-bold" router :to="loginUrl" prepend-icon="mdi-login-variant" style="font-family: Feather;">
        Login
      </v-btn>
      <v-btn color="#FEB139" class="font-weight-bold" router :to="registerUrl" prepend-icon="mdi-account-plus-outline" style="font-family: Feather;">
        Register
      </v-btn>
    </div>
  </v-toolbar>
  <div v-if="user.loggedIn">
    <v-navigation-drawer style="color:#FEB139" expand-on-hover rail="true">
      <v-parallax style="background-color:#003865; color: white;"
        class="fill-height">
        <v-list>
          <center><img src="../assets/images/user.png" width="40" height="40" style="margin-top: 20px; margin-bottom: 20px;"></center>
          <v-list-item
            prepend-avatar="https://scontent.fmnl25-3.fna.fbcdn.net/v/t39.30808-6/285904537_7617205418351303_7735473882644039146_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHIPWzc2HNBuCxZ_399GXGH6z0lwVrMu6jrPSXBWsy7qOOsr-UohG1aT3CRSwR8RgrBD_momtxa5k7KNDeMuZUX&_nc_ohc=d21oIokLXjQAX-tnyIU&tn=Ov07vvXkhUqrdXVp&_nc_ht=scontent.fmnl25-3.fna&oh=00_AT8rOHbCwHtA9iIJ0Pjsf2VjbDUWb2K5Saf6dU7J7PG5Ig&oe=6322F5D9"
            :title="user.data.displayName" :subtitle="user.data.email"></v-list-item>
          
        </v-list>
        <v-divider></v-divider>

        <v-list density="compact" app>
          <v-list-item v-for="item in items" :key="item.title" router :to="item.path" :prepend-icon="item.icon"
            :color="item.color">
            <v-list-item-title :color="item.color">{{ item.title }}</v-list-item-title>

          </v-list-item>
          <v-list-item prepend-icon="mdi-logout-variant" title="Logout" @click.prevent="signOut" href="/"></v-list-item>
        </v-list>

      </v-parallax>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { auth } from '../firebase'

export default {
  data() {
    return {
      drawer: false,
      loginUrl: '/login',
      registerUrl: '/register',
      items: [
        { title: 'Home', icon: 'mdi-home-account', path: '/', color: "warning" },
        { title: 'Basic Calculator', icon: 'mdi-calculator-variant', path: '/basicMath', color: "warning" },
        { title: 'String Manipulator', icon: 'mdi-clipboard-text', path: '/stringApp', color: "warning" },
        { title: 'Vuetify Research', icon: 'mdi-vuetify', path: '/vuetify', color: 'warning' },
        { title: 'Quiz', icon: 'mdi-ab-testing', path: '/quiz', color: 'warning' },
        { title: 'Quiz History', icon: 'mdi-history', path: '/quizHistory', color: 'warning' },
        { title: 'About the Creator', icon: 'mdi-account-multiple', path: '/bonnel', color: 'warning' },
        { title: 'Guide to Website', icon: 'mdi-web', path: '/about', color: 'warning' },
      ],
      rail: false,
    }
  },
  setup() {

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
    return { user, signOut }
  }
};
</script>
<style>
  @font-face {
font-family: "Feather";
src: local("Feather"),
 url(../assets/feather.ttf) format("truetype");
}
</style>