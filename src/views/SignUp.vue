<template>
  <div class="center">
      <h2 style="text-align: center">Sign up (KYC)</h2>
        <div style="text-align: center"><video ref="video" id="video" width="320" height="240" autoplay></video></div>
        <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>

        <v-btn class="center" style="width: 50%; margin-top: 10px;" @click="capture">Capture</v-btn>

        <v-card class="center" style="width: 70%; margin-top: 10px;">
            <v-card-title>
                <span  style="font-weight: 400">Sign Up</span> 
            </v-card-title>
            <v-card-subtitle>
                Sign in using your email and password.
            </v-card-subtitle>
        <v-card-content>
            <v-form style="padding: 20px;" ref="form" @submit="onSubmit">
                <v-text-field
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
                <v-text-field
                    label="Name"
                    v-model="name"
                    required
                    type="text"
                ></v-text-field>
                <v-text-field
                    label="Race"
                    v-model="race"
                    required
                    type="text"
                ></v-text-field>
                <v-text-field
                    label="DOB"
                    v-model="dob"
                    required
                    type="text"
                ></v-text-field>
                <v-text-field
                    label="ID Num"
                    v-model="idNum"
                    required
                    type="text"
                ></v-text-field>
                <v-text-field
                    label="Country"
                    v-model="country"
                    required
                    type="text"
                ></v-text-field>
                <p>{{ feedback }}</p>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" depressed >Sign Up</v-btn>
                </v-card-actions>
            </v-form>
        </v-card-content>
        </v-card>

    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Verifying...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="rejected"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">IC Reject</v-card-title>

        <v-card-text>
          Please scan your IC/ID again.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="rejected = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import db, {auth} from '@/firebase/init'
import firebase from 'firebase'
export default {
    data() {
        return {
            dialog: false,
            rejected: false,

            email: null,
            password: null,
            name: null,
            race: null,
            dob: null,
            idNum: null,
            country: null,

            feedback: null,
            video: {},
            originalFaceId: null,
            canvas: {},
            initialFaceBase64: null,
            currentImg: null,

            response: null,
        }
    },
    mounted() {
        this.video = this.$refs.video;
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: {facingMode: {ideal: 'environment'}}  }).then(stream => {
                this.video.srcObject = stream
            });
        }
    },
    methods: {
        onSubmit (evt) {
            evt.preventDefault()
            this.signUp()
        },
        signUp() {
            this.dialog = true
            auth.createUserWithEmailAndPassword(this.email,this.password)
            .then(cred => {
                var uid = cred.user.uid
                db.collection('users').doc(uid).set({
                    name: this.name,
                    race: this.race,
                    dob: this.dob,
                    idNum: this.idNum,
                    country: this.country,
                    email: this.email
                }).then(() => {
                    this.dialog = false
                    this.$router.push({name: 'Home'})
                })

            }).catch((error) => {
                this.dialog = false
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
                console.log(error);
            })
        },
        capture() {
            this.canvas = this.$refs.canvas;
            var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 640, 480);
            this.currentImg = canvas.toDataURL("image/jpeg")
            var buff = new Buffer(this.currentImg.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
            var b64encoded = btoa(String.fromCharCode.apply(null, buff));
           // console.log('b64encoded: ', b64encoded)
            var kyc = firebase.functions().httpsCallable('kyc')
            this.dialog = true

            kyc({ image: b64encoded }).then(response => {
                console.log(response)
                this.response = response.data
                this.dialog = false
                if(!this.response.qualityCheck.finalDecision){
                    this.rejected = true
                } else {
                    this.name = this.response.vision.extract.name
                    this.race = this.response.vision.extract.race
                    this.dob = this.response.vision.extract.dob
                    this.idNum = this.response.vision.extract.idNum
                    this.country = this.response.vision.extract.countryOfBirth
                }
            }) 
            
        },
        initVid() {
            this.video = this.$refs.video;
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: {facingMode: {ideal: 'environment'}} }).then(stream => {
                    this.video.srcObject = stream
                });
            }
        },
    }
}
</script>

<style>
.center {
display: block;
  width: 100%;
  margin: 0 auto;
}
#video {
    background-color: #000000;
}
#canvas {
    display: none;
}   
</style>