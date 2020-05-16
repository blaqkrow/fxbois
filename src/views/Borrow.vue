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
            <v-text-field
            label="Solo"
            placeholder="Loan Amount"
            prepend-inner-icon="$"
            solo
            @keyup="getTop2Loans"
            type="number"
            v-model="loanAmt"
            ></v-text-field>
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
export default {
    data() {
        return {
            show: false,
            top2Loans:[],
            loanAmt: null,
        }
    },
    methods: {
      getTop2Loans() {
        console.log('Hi')
        console.log('Loan amt: ', this.loanAmt)
      },

    }

}
</script>


<style>
#headerStyle {
  background: -webkit-linear-gradient(#E32D91, #8573D9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
#appContent {
  background-image: linear-gradient(to bottom right, #4775E7, #4775E7 );
}
</style>