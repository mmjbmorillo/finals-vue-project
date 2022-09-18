<template>
    <v-parallax>
        <div class="d-flex justify-center mt-15">
            <v-carousel class="w-50 rounded mt-6" hide-delimiter-background show-arrows="hover">
                <v-carousel-item v-for="(title, i) in titles" :key="i">
                    <v-sheet :color="colors[i]" height="100%">

                        <div class="d-flex fill-height justify-center align-center w-100">
                            <v-card class="mx-auto" width="50%" prepend-icon="mdi-home">
                                <template v-slot:title>
                                    <h3 style="color:#FEB139; font-family: Feather;">{{ title }}</h3>
                                </template>

                                <v-card-text style="font-size:17px">
                                    {{ message[i] }}
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>
        </div>

    </v-parallax>

</template>

<script>
export default {
    data() {
        return {
            colors: [
                '#003865',
                '#003865',
                '#003865',
            ],
            titles: [
                'Introduction',
                'About Vuetify',
                'Why Vuetify',
            ],
            message: [
                'Learn more about what Vuetify is, how to create an application from scratch, browse API references, sample code, tutorials, and more.',
                "Vuetify is a complete UI framework built on top of Vue.js. The goal of the project is to provide developers with the tools they need to build rich and engaging user experiences. Vuetify is designed from the ground up to be easy to learn and rewarding to master with almost a hundred carefully crafted components from the Material Design specification.",
                'Since its initial release in 2014, Vue.js has grown to be one of the most popular JavaScript frameworks in the world. One of the reasons for this popularity is the wide use of components which enable developers to create concise modules to be used and re-used throughout their application. UI libraries are collections of these modules that implement a specific style guideline and provide the necessary tools to build expansive web applications.',
            ],
        }
    },
}
</script>