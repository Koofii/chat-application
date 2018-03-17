/* global db, firebase */
const state = {
    currentRoom: "room1",
    msg: $("#msg"),
    send: $("#send"),
    chatrooms: document.getElementById("chatrooms")
};

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
    $(`#${state.currentRoom}`).append(`<div>
        <p class="user">${snapshot.val().user}</p>
        <p class="messages">${snapshot.val().message}
        <p class="time-stamp">${snapshot.val().time}</p>
    </div>`);
    state.chatrooms.scrollTop = state.chatrooms.scrollHeight;
}

function startChat(state) { //eslint-disable-line
    db.ref(`/chat/${state.currentRoom}`).on("child_added", msgHandler);
}

state.send.on("click", function (e) {
    e.preventDefault();
    let user = firebase.auth().currentUser;
    let ref = db.ref(`/users/${user.uid}`);
    ref.on("value", function (snapshot) {
        let username = snapshot.val().username;
        let time = new Date();
        
        db.ref(`/chat/${state.currentRoom}`).push({
            user: username,
            message: state.msg.val().replace(/</g, "") || "I am poor gopnik I cannot afford send real text",
            //ninja lvl: 1,000
            time: time.toISOString().split("T").join(" ").slice(0, 19)
        });
        state.msg.val("");
    });
});

state.msg.on("keydown", function (e) {
    if ((e.keyCode || e.which) === 13) {
        $("#send").trigger("click");
    }
});
$("nav ul li").on("click", changeRoom);