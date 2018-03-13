/* global db */
const state = {
    currentRoom: "room1",
    msg: $("#msg"),
    send: $("#send")
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
function msgHandler(snapshot) {
    $(`#${state.currentRoom}`).append(`<div>
        <p class="user">${snapshot.val().user}<p>
        <p class="messages">${snapshot.val().message}
        <p class="time-stamp">${snapshot.val().time}</p>
    </div>`);
}

function startChat(state) {
    db.ref(`/chat/${state.currentRoom}`).on("child_added", msgHandler);
}

state.send.on("click", function(e) {
    e.preventDefault();
    let user = firebase.auth().currentUser;
    let ref = db.ref(`/users/${user.uid}`);
    ref.on("value", function(snapshot) {
        let username = snapshot.val().username;
        db.ref(`/chat/${state.currentRoom}`).push({
            user: username,
            message: state.msg.val(),
            time: Date.now()
        });
        state.msg.val("");
    });
});

state.msg.on("keydown", function(e) {
    console.log(e.keyCode);
    if ((e.keyCode || e.which ) === 13) {
        $("#send").trigger("click");
    }
});



startChat(state);