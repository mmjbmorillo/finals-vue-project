<template>

     <center><v-card
        class="ma-15 pa-5"
        max-width="600"
        elevation = "11"
        style="background-color: #003865;"
     ><br/>
    <img src="../assets/images/text-logo.png" width="70" height="70"><br/><br/>
      <v-card-title style="color: #FEB139; font-family: Feather; font-size: 30px; margin-top: 5px; margin-bottom: 5px;"> String Manipulator </v-card-title>
    <br/>
       <v-text-field label="Enter a String" v-model="stringInput" style="color: white;"></v-text-field>
    
       <v-btn class="ma-2" color="primary" @click="doCountVowel" style="color: white; font-family: Feather; font-size: 15px;">
            Manipulate
       </v-btn>
       <v-btn class="ma-2" color="error" @click="resetValue" style="color: white; font-family: Feather; font-size: 15px;">
            Reset
       </v-btn>
    
       <br/><br/>
       <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">
         Vowels: <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{ vowelCount }}</p>
       </v-chip>&nbsp;
       <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">
         Number of Characters: <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{ count }}</p>
       </v-chip><br/>&nbsp;
       <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">
         Consonants: <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{ conso }}</p>
       </v-chip>&nbsp;
       <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">
         Vowels to *: <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{ con }}</p>
       </v-chip><br/><br/>
     </v-card>  </center>
    
    </template>
    
    <script setup>
    import {ref} from 'vue'
    
    const stringInput = ref('')
    const vowelCount = ref(0)
    const count = ref(0)
    const conso = ref(0)
    const con = ref('--')
    
    function doCountVowel () {
         vowelCount.value = stringInput.value.match(/[aeiouAEIOU]/gi).length;
         count.value = stringInput.value.match(/[a-zA-z]/gi).length;
         conso.value = stringInput.value.match(/[bcdfghjklmnpqrstvwxyz]/gi).length;
         con.value = stringInput.value.replace(/[aeiouAEIOU]/gi,'*');
    }
    
    function resetValue(){
         stringInput.value = '';
         vowelCount.value = 0;
         count.value = 0;
         conso.value = 0;
         con.value = '--';
    }
    
    </script>