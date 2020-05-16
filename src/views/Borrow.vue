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
        <v-list-item-title id="headerStyle" style="font-size: 40px;" class=""><b>Borrow</b></v-list-item-title>
        <v-list-item-subtitle>Enter the amount you want to borrow</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-img
      src="https://alltopstartups.com/wp-content/uploads/2019/03/Getting-by-When-Moneys-Tight.png"
      height="194"
    ></v-img>

    <v-card-text>
        <div>
          <v-text-field
            v-model="loanAmt"
            dark
            label="Solo"
            placeholder="Loan Amount"
            prepend-inner-icon="$"
            solo
            @keyup="getTop2Loans"
            type="number"
            ></v-text-field>
        </div>
    <v-card-text>
      <v-row
        class="mb-4"
        justify="space-between"
      >
        <v-col class="text-left">
          <span
            class="display-1 font-weight-light"
            v-text="bpm"
          ></span>
          <span class="subheading font-weight-light mr-1">MONTHS</span>
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
        min="1"
        max="36"
        @change="getTopLoans()"
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
        <div>

        </div>

        <div>

        <v-card
            color="#8573D9"
            dark
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline">$1000 EIR 4.2%</v-card-title>

                <v-card-subtitle>
                    $1000 at 6% interest
                </v-card-subtitle>
                
              </div>

              <v-avatar
                class="ma-3"
                size="80"
                tile
              >
                <v-img src="https://image.flaticon.com/icons/svg/2422/2422235.svg"></v-img>
              </v-avatar>
            </div>
            <v-card-actions style="margin-top: -20px;">
                <v-btn text >Select This</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    @click="show = !show"
                >
                    <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
                </v-card-actions>

                <v-expand-transition>
                <div v-show="show">
                    <v-divider></v-divider>

                    <v-card-text>
                        $600 at 5% interest for 3 months <br>
                        $400 at 3% interest for 3 months
                    </v-card-text>
                </div>
                </v-expand-transition>
          </v-card>
        <v-card
            style="margin-top: 10px;"
            color="#E32D91"
            dark
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline">12 Months</v-card-title>

                <v-card-subtitle>
                    $1000 at 6% interest
                </v-card-subtitle>
              </div>

              <v-avatar
                class="ma-3"
                size="80"
                tile
              >
                <v-img src="https://image.flaticon.com/icons/svg/2422/2422235.svg"></v-img>
              </v-avatar>

            </div>
            <v-card-actions style="margin-top: -20px;">
                <v-btn text >Select This</v-btn>
            </v-card-actions>
          </v-card>
        </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
  <br>
  <br>
 
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
    data() {
        return {
            show: false,
            top2Loans:[],
            loanAmt: null,
            bpm: 1,
            isPlaying: false,
            loanAmt:'',
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
      getTopLoans(){
       
        if (window.location.href.indexOf("localhost") > -1) {
          firebase.functions().useFunctionsEmulator("http://localhost:5001")
        }
        firebase.functions().httpsCallable('getTopLoans')({
          tenorSelected:this.bpm, 
          amt:this.loanAmt
        }).then(response => {
          console.log(response)
        }) 
      },
      getTop2Loans() {
        console.log('Hi')
        console.log('Loan amt: ', this.loanAmt)
      },
    },
}
</script>

<style>
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