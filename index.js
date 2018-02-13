
const five = require("johnny-five");
const board = new five.Board({ port: "COM3" });
//const firebase = require('firebase');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iotandroid-7a4f6.firebaseio.com"
});

const refledHabitacion = admin.database().ref("home").child("id123").child("room");
const refledCocina = admin.database().ref("home").child("id123").child("kitchen");
const refledbano = admin.database().ref("home").child("id123").child("bathroom");
const refledSala = admin.database().ref("home").child("id123").child("living");
//const refhome = admin.database().ref("home").child("id123");

board.on("ready", () => {

    ledCocina = new five.Led(13);
    ledHabitacion = new five.Led(12);
    ledBano = new five.Led(11);
    ledSala = new five.Led(10);
    motion = new five.Motion(7);

    ledCocina.stop().off();
    ledHabitacion.stop().off();
    ledBano.stop().off();
    ledSala.stop().off();  

    listener();

    motion.on("calibrated", () => {
        console.log("YA calibrated");
    });

    motion.on("motionstart", () => {
        console.log("motionstart");
        let updates = {};
        updates["/home/id123/movroom"] = Math.random();
        admin.database().ref().update(updates);
    });

    motion.on("motionend", () => {
        console.log("motionend");
    });

    //var key = firebase.database().ref("hogar").set({ test: 'Hola Mundo arduino' });
});

function listener() {

    refledHabitacion.on("value", (snapshot) => {
        cambiarColor(ledHabitacion, snapshot.val(), 'ledHabitacion');
    });

    refledCocina.on("value", (snapshot) => {
        cambiarColor(ledCocina, snapshot.val(), 'ledCocina');
    });

    refledbano.on("value", (snapshot) => {
        cambiarColor(ledBano, snapshot.val(), 'ledBano');
    });

    refledSala.on("value", (snapshot) => {
        cambiarColor(ledSala, snapshot.val(), 'ledSala');
    });

}

function cambiarColor(led, value, tag) {

    console.log(`led = ${tag}, value = ${value}`);

    if (value === 0) {
        led.stop().off();
        return;
    }

    if (value === 1) {
        led.stop().off();
        led.on();
        return;
    }

    if (value === 2) {
        led.blink(2000);
        return;
    }

}
