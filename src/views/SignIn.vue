<template>
  <div class="d-flex justify-center">
    <v-card style="margin-top: 50px;" width="350" class="mx-auto">
      <v-card-title >
          <span  style="font-weight: 400">Sign In</span>
      </v-card-title>
        <v-card-subtitle>
        Sign in using your email and password.
        </v-card-subtitle>
      <v-card-content>
          <v-container>
            <v-form ref="form" @submit="onSubmit">
                <v-text-field
                    light
                    label="Email"
                    v-model="email"
                    required
                    type="email"
                ></v-text-field>
                <v-text-field
                    label="Password"
                    v-model="password"
                    required
                    type="password"
                ></v-text-field>
                <p>{{ feedback }}</p>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="goToSignUp" depressed >No Acc? Sign Up</v-btn>
                    <v-btn :loading="signingIn" type="submit" depressed >Sign In</v-btn>
                </v-card-actions>
            </v-form>
          </v-container>
      </v-card-content>
    </v-card>
  </div>
</template>

<script>
import db, {auth} from '@/firebase/init'

export default {
    data(){
        return {
            email: null,
            password: null,
            signingIn: false,
            feedback: null,
        }
    },
    methods: {
        goToSignUp() {
            this.$router.push({name: 'SignUp'})
        },
        onSubmit (evt) {
            evt.preventDefault()
            this.signIn()
        },
        signIn() {
            if (this.$refs.form.validate()) {
                this.signingIn = true
                if(this.email && this.password){
                    auth.signInWithEmailAndPassword(this.email, this.password)
                    .then(cred => {
                        var user = cred.user
                        this.$store.commit('setUser', {
                            user: user,
                        })
                    }).catch( err => {
                        this.signingIn = false
                    })
                    this.feedback = null
                } else {
                    this.signingIn = false
                }
            }

        },
    },
}
</script>

<style>
#video {
    background-color: #000000;
}
#canvas {
    display: none;
} 
</style>