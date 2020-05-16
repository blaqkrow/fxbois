<template>
  <v-app>
    <v-app-bar
      app
      id="appBarStyle"
      dark
      elevation="0"
    >
      <div class="d-flex align-center">
        <h2 style="font-family: 'GalandaModernaW00-Light'">YO.LOAN</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="signOut()" text>
        Sign Out
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
      <v-bottom-navigation
      v-if="getUser"
      fixed
        v-model="bottomNav"
      >
    <v-btn value="recent" @click="goToHome()">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>

    </v-btn>
    <v-btn value="recent" @click="goToBorrow()">
        <span>Borrow</span>
        <v-icon>mdi-charity</v-icon>

    </v-btn>
    <v-btn value="favorites" @click="goToLend()">
      <span>Lend</span>
      <v-icon>mdi-currency-usd-circle</v-icon>
    </v-btn>

    <v-btn value="nearby"  @click="goToBorrowHistory()">
      <span>History</span>
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <v-btn value="nearby" @click="goToLendPortfolio()">
      <span>Portfolio</span>
      <v-icon>mdi-diamond-stone</v-icon>
    </v-btn>
  </v-bottom-navigation>
  </v-app>
</template>
<script>
import db, {auth} from '@/firebase/init'
export default {
  name: 'App',
  data() {
    return {

    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if(user) {
        this.$store.commit('setUser', {
            user: user,
        })
        console.log('user.uid: ', user.uid)
        db.collection('users').doc(user.uid).get().then(doc => {
          this.$store.commit('setUserInfo', {
            userInfo: doc.data()
          })
          console.log('doc.data(): ', doc.data())
        })
      }
      console.log('User: ', user)
    })
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser
    }
  },
  methods: {
    signOut() {
      auth.signOut().then(() => {
        this.$store.commit('setUser', {
            user: null,
        })
        this.$router.push({ name: 'SignIn' })
      }).catch(err => {})
    },
    goToBorrow() {
      this.$router.push({name: 'Borrow'})
    },
    goToHome() {
      this.$router.push({name: 'Home'})
    },
    goToLend() {
      this.$router.push({name: 'Lend'})
    },
    goToBorrowHistory() {
      this.$router.push({name: 'BorrowHistory'})
    },
    goToLendPortfolio() {
      this.$router.push({name: 'LendPortfolio'})
    },

  }
};
</script>
<style>
#appBarStyle {
  background-image: linear-gradient(to bottom right, #8573D9, #E32D91);
}
</style>
