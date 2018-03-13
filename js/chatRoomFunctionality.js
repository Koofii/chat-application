/* global db */



// firebase.initializeApp(config); //eslint-disable-line
// const db = firebase.database(); //eslint-disable-line

const state = {
    currentRoom: "room1"
};

$("nav ul li").on("click", changeRoom);

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


/*
This is how chat messages should look
<div>
    <p class="user">kristoffer_frejd</p>
    <p class="messages"> lorem20 Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quo.</p>
    <p class="time-stamp">TIMESTAMP</p>
</div>
<div>
    <p class="user">BOBNICK</p>
    <p class="messages"> lorem20 Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quo.</p>
    <p class="time-stamp">TIMESTAMP</p>
</div>
*/

startChat(state);