// this handles the switching of chat rooms.

//import { config } from "./config";


const config = {
    apiKey: "AIzaSyAl4qIrAr0pjNYnvPQLp3ubQ1jRipSmYTw",
    authDomain: "gopnik-chat.firebaseapp.com",
    databaseURL: "https://gopnik-chat.firebaseio.com",
    projectId: "gopnik-chat",
    storageBucket: "gopnik-chat.appspot.com",
    messagingSenderId: "1075818501637"
};

const ui = {
    userName: $("#userName"),
    text: $("#text"),
    postBtn: $("#post"),
    output: $("#room1")
};

firebase.initializeApp(config); //eslint-disable-line
const db = firebase.database(); //eslint-disable-line
const state = {
    currentRoom: "room1"
};

$(document).on("click", "li", changeRoom);

function changeRoom() {
    const room = $(this).attr("data-value");
    // empty room we're leaving
    if (state.currentRoom !== room) {
        $(`#${state.currentRoom}`).html("");
        // remove event listeners
        db.ref(`/chat/${state.currentRoom}`).off();
        // update state
        state.currentRoom = room;
        // attach a listener to the new room
        db.ref(`/chat/${room}`).on("child_added", msgHandler);
    }
    

}

function msgHandler(snapshot) {
    //I draw messages!
    $(`#${state.currentRoom}`).append(`<div>${snapshot.val().user} says: ${snapshot.val().message}</div>`);
}

function startChat(state) {
    db.ref(`/chat/${state.currentRoom}`).on("child_added", msgHandler);
}


startChat(state);

ui.postBtn.on("click", function () {
    let msgUser = ui.userName.val();
    let msgText = ui.text.val();
    db.ref(`/chat/${state.currentRoom}`).push(
        {
            user: msgUser,
            message: msgText
        }
    );
    ui.text.value = "";
});