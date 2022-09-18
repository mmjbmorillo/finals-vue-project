<template>
    <v-parallax :src="Image">
        <v-card class="mx-auto my-12 pa-5" max-width="50%" elevation="8" style="background-color: #003865;" shaped>

            <template v-slot:title>
                <h1 class="text-center" style="font-size: 30px; color: #FEB139; font-family: Feather;">GETTING STARTED</h1>
            </template>

            <v-divider class="mx-2"></v-divider>
            <div class="d-flex justify-center mt-6">


                <v-sheet class="w-50" style="background-color: #003865;">
                    <div v-if="error" class="alert alert-danger">{{error}}</div>
                    <form action="#" @submit.prevent="Login">
                        <v-text-field prepend-icon="mdi-email" label="Email" id="email" :rules="emailRules" type="email" name="email" required
                            v-model="email" class="mt-3"></v-text-field>
                        <v-divider class="mx-4"></v-divider>
                        <v-text-field prepend-icon="mdi-lock" :rules="passwordRules" label="Password" id="password" type="password" name="password" required
                            v-model="password" class="mt-3"></v-text-field>

                        <v-divider class="mx-4"></v-divider>
                        <div class="d-flex justify-center w-100">
                            <v-btn type="submit" style="font-size: 20px; font-family:Feather; color: black; background-color: #FEB139; margin-bottom: 10px;">Login</v-btn>
                        </div>
                        
                    </form>
                </v-sheet>

            </div>

        </v-card>
    </v-parallax>
</template>
  
<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ImageSrc from '../assets/images/blackbg.jpg'
export default {
    data: () => ({
        emailRules: [
            value => !!value || 'Required.',
            value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            },
        ],
        usernameRules: [
            value => !!value || 'Required.',
            value => (value || '').length <= 6 || 'Max 6 characters',
        ],
        passwordRules: [
            value => !!value || 'Required.',
            value => (value || '').length >= 6 || 'Min 6 characters',
        ],
        confirmPassRules: [
            (value) => !!value || 'type confirm password',
            (value) =>
                value === this.userPass || 'The password confirmation does not match.',
        ],
    }),
    name: "LoginComponent",
    setup() {
        const Image = ImageSrc;

        const email = ref('')
        const password = ref('')
        const error = ref(null)

        const store = useStore()
        const router = useRouter()

        const Login = async () => {
            try {
                await store.dispatch('logIn', {
                    email: email.value,
                    password: password.value
                })
                router.push('/')
            }
            catch (err) {
                error.value = err.message
            }
        }
        return { Image, Login, email, password, error }
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