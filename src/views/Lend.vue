<template>
  <div>
<v-card
    style="margin-top:0px;"
    max-width="100%"
    class="mx-auto"
    elevation="0"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title id="headerStyle" style="font-size: 40px;" class=""><b>Lend</b></v-list-item-title>
        <v-list-item-subtitle>Enter the amount you want to lend</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-img
      src="https://blog.payumoney.com/wp-content/uploads/2019/07/Payouts-cover-1280x720.png"
      height="194"
    ></v-img>

    <v-card-text>
        <v-text-field
        v-model="invAmt"
        label="Solo"
        placeholder="Lend Amount"
        prepend-inner-icon="$"
        solo
        ></v-text-field>
        <v-select
          v-model="invPerc"
          style="margin-top: -15px"
          :items="investmentPerc"
          label="Investment %"
          solo
        ></v-select>

<v-card
    style="margin-top: -15px"
    class="mx-auto"
    max-width="600"
    id="cardStyle"
  >

    <v-card-text>
      <v-row
        class="mb-4"
        justify="space-between"
      >
        <v-col class="text-left">
          <span
            style="color: white"
            class="display-3 font-weight-light"
            v-text="bpm"
          ></span>
          <span style="color: white" class="subheading font-weight-light mr-1">MONTHS</span>
          <v-fade-transition>
            <v-avatar
              v-if="isPlaying"
              :color="color"
              :style="{
                animationDuration: animationDuration
              }"
              class="mb-1 v-avatar--metronome"
              size="12"
            ></v-avatar>
          </v-fade-transition>
        </v-col>

      </v-row>

      <v-slider
        v-model="bpm"
        :color="color"
        track-color="grey"
        always-dirty
        min="2"
        max="36"
      >
        <template v-slot:prepend>
          <v-icon
            :color="color"
            @click="decrement"
          >
            mdi-minus
          </v-icon>
        </template>

        <template v-slot:append>
          <v-icon
            :color="color"
            @click="increment"
          >
            mdi-plus
          </v-icon>
        </template>
      </v-slider>
    </v-card-text>
  </v-card>
  <br>
  <v-btn block color="secondary" dark @click="submitlend()">
    Submit Lend
    </v-btn>
  <v-btn block color="#E32D91" dark>Submit Lend</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
    data() {
        return {
            invPerc: '2%',
            bpm: 2,
            interval: null,
            isPlaying: false,
            investmentPerc: ['2%','3%','4%','5%',]
        }
    },
    computed: {
      color () {
        if (this.bpm < 5) return 'indigo'
        if (this.bpm < 10) return 'teal'
        if (this.bpm < 15) return 'green'
        if (this.bpm < 25) return 'orange'
        return 'red'
      },
      animationDuration () {
        return `${60 / this.bpm}s`
      },
    },
    methods: {
      decrement () {
        this.bpm--
      },
      increment () {
        this.bpm++
      },
      toggle () {
        this.isPlaying = !this.isPlaying
      },
      async submitlend(){
        console.log("SUBMIT")
        if (window.location.href.indexOf("localhost") > -1) {
          firebase.functions().useFunctionsEmulator("http://localhost:5001")
        }
        /*firebase.functions().httpsCallable('insertloan')({
          tenor:this.bpm, 
          interest:this.invPerc, 
          amt:this.invAmt
        }).then(response => {
          console.log(response)
        })*/
        var bankAcc = firebase.functions().httpsCallable('getBankAccountDetails')
        await bankAcc("392496367").then((resp) => {
          console.log(resp)
        })

        var deposit = firebase.functions().httpsCallable('depositMoneyIntoAcct')
        await deposit({
          amount: 10,
          accountId: 'KCYN750'
        }).then((resp) =>{
          console.log(resp)
        })

        var transfer = firebase.functions().httpsCallable('transferMoneyToAnotherAcct')
        await deposit({
          amount: 10,
          sendAcctId: 'KCYN750',
          recvAcctId: 'CWDB171'
        }).then((resp) =>{
          console.log(resp)
        })

        
      },
    }
}
</script>

<style>
#cardStyle {
  background-image: linear-gradient(to bottom right, #8573D9, #E32D91);
}
#headerStyle {
  background: -webkit-linear-gradient(#E32D91, #8573D9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
 @keyframes metronome-example {
    from {
      transform: scale(.5);
    }

    to {
      transform: scale(1);
    }
  }

  .v-avatar--metronome {
    animation-name: metronome-example;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
</style>