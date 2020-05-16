<template>
  <div class="home" id="content">
<v-card
    style="margin-top: 10px;"
    class="mx-auto"
    color="#8573D9"
    dark
    max-width="400"
  >
    <v-card-title>
      <span class="title font-weight-light">Welcome!</span>
    </v-card-title>

    <v-card-text class="headline font-weight-bold">
      “The person who doesn't know where his next dollar is coming from usually doesn't know where his last dollar went.”
    </v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img
            class="elevation-6"
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{getUserInfo.name}}</v-list-item-title>
        </v-list-item-content>

        <v-row
          align="center"
          justify="end"
        >
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>

      <v-card
      style="margin-top: 10px;"
      max-width="400"
    class="mx-auto text-center"
    color="#E32D91"
    dark
  >
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :value="value"
          color="rgba(255, 255, 255, .7)"
          height="100"
          padding="24"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item">
            ${{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="display-1 font-weight-thin">Earnings 24h</div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn block text>Go to Report</v-btn>
    </v-card-actions>
  </v-card>
  <br>
  <br>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Home',
  data() {
    return {
      response: 'Nothing',
       value: [
        423,
        446,
        675,
        510,
        590,
        610,
        760,
      ],
    }
  },
  computed: {
    getUserInfo() {
      return this.$store.getters.getUserInfo
    }
  },
  methods: {
    test() {
      var test = firebase.functions().httpsCallable('test')
      test('Hello').then(response => {
        console.log(response)
        this.response = response.data
      }) 
    },
    loan() {
      firebase.functions().useFunctionsEmulator('http://localhost:5001');
      var test = firebase.functions().httpsCallable('insertloan')
      test({tenor:10, interest:0.05, amt:10000}).then(response => {
        console.log(response)
      }) 
    }
  }
}
</script>

<style>
</style>
