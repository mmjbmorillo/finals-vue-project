<template>
  <center><v-card 
      class="ma-15 pa-5"
      max-width="600"
      elevation = "11"
      style="background-color: #003865;"
      >
      <img src="../assets/images/calculator-logo.png" width="120" height="120">
      <v-card-title style="color: #FEB139; font-family: Feather; font-size: 30px; margin-top: 5px; margin-bottom: 5px;"> Basic Calculator </v-card-title>
      <v-container fluid>
        <v-text-field label="First Input" v-model.number="fNumber" style="color:white; max-width: 400px;"></v-text-field>
        <v-text-field label="Second Input" v-model.number="sNumber" style="color:white; max-width: 400px;"></v-text-field>
        
        <v-btn class="ma-2" color = "#FEB139" @click="doSum" style="color: black; font-family: Feather; font-size: 15px;">Compute</v-btn>
        <v-btn class="ma-2" color = "red" @click="resetValue" style="color: white; font-family: Feather; font-size: 15px;">Reset</v-btn><br/><br/>
   
        <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">Sum: 
          <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{sum}}</p></v-chip>
        <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">Difference: 
          <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{difference}}</p></v-chip>
        <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">Product: 
          <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{product}}</p></v-chip><br/>
        <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">Quotient: 
          <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{quotient}}</p></v-chip>
        <v-chip class="ma-2" label style="color: white; font-family: Feather; font-size: 18px;">Average: 
          <p style="color: #FEB139; font-family: Feather; font-size: 18px; margin-bottom: -3px;">&nbsp;{{average}}</p></v-chip>
      </v-container>
    </v-card></center>
  </template>
  
  <script setup>
    import {ref} from 'vue'
  
    const fNumber=ref('')
    const sNumber=ref('')
    const sum = ref(0)
    const difference = ref(0)
    const product = ref(0)
    const quotient = ref(0)
    const average = ref(0)
  
    function doSum(){
      sum.value = fNumber.value + sNumber.value;
      difference.value = fNumber.value - sNumber.value;
      product.value = fNumber.value * sNumber.value;
      quotient.value = fNumber.value / sNumber.value;
      average.value = (fNumber.value + sNumber.value)/2;
    }
  
    function resetValue(){
      fNumber.value = '';
      sNumber.value = '';
      sum.value = 0;
      difference.value = 0;
      product.value = 0;
      quotient.value = 0;
      average.value = 0;
    }
  </script>
  
  
  <style>
    p{
      color: white;
    }
  </style>