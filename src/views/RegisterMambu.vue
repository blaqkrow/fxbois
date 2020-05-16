<template>
  <div class="d-flex justify-center">
    <v-card style="margin-top: 50px;" width="350" class="mx-auto">
      <v-card-title >
          <span  style="font-weight: 400">Sign Up</span>
      </v-card-title>
        <v-card-subtitle>
        Sign Up using your name
        </v-card-subtitle>
      <v-card-content>
          <v-container>
            <v-form ref="form" @submit="onSubmit">
                <v-text-field
                    label="First Name"
                    v-model="fname"
                    required
                ></v-text-field>
                <v-text-field
                    label="Last Name"
                    v-model="lname"
                    required
                ></v-text-field>
                <p>{{ feedback }}</p>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :loading="signingIn" type="submit" depressed >Sign Up</v-btn>
                </v-card-actions>
            </v-form>
          </v-container>
      </v-card-content>
    </v-card>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
    data(){
        return {
            email: null,
            password: null,
            signingIn: false,
            feedback: null,
            lname: '',
            fname:'',
        }
    },
    methods: {
        onSubmit (evt) {
            evt.preventDefault()
            this.mambuSignUp()
        },
        mambuSignUp() {
            console.log('sign up clicked')
            if (window.location.href.indexOf("localhost") > -1) {
                firebase.functions().useFunctionsEmulator("http://localhost:5001")
            }
            firebase.functions().httpsCallable('registerMambu')({
                firstName: this.fname,
                lastName: this.lname
            }).then(response => {
                console.log(response)
            }).catch(err => {console.log(err)})

        },
    },
}
</script>

<style>

</style>