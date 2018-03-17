/* global firebase */
const config = {
    apiKey: "AIzaSyAl4qIrAr0pjNYnvPQLp3ubQ1jRipSmYTw",
    authDomain: "gopnik-chat.firebaseapp.com",
    databaseURL: "https://gopnik-chat.firebaseio.com",
    projectId: "gopnik-chat",
    storageBucket: "gopnik-chat.appspot.com",
    messagingSenderId: "1075818501637"
};
firebase.initializeApp(config);
$("#reg-form").hide();

$("#become-gopnik p span").click(function(){
    $("#sign-in-view").hide();
    $("#reg-form").fadeIn();
});
$("#cancel-reg p").click(function(){
    $("#sign-in-view").fadeIn();
    $("#reg-form").hide();
});
// Vars for Firebase
let db = firebase.database();
// let auth = firebase.auth();

function removeUserFromOnlineList() {
    const currentUser = firebase.auth().currentUser;
    db.ref("/online/").child(`${currentUser.uid}`).remove();
    return null;
}

// This is used to log in and verify details
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // const currentUser = firebase.auth().currentUser;
        // const userReference = db.ref(`/users/${currentUser.uid}`);
        // userReference.update({
        //     online: false
        // });
        removeUserFromOnlineList();
        firebase.auth().signOut();
    } else {
        var email = $("#email-signin").val()
        var password = $("#password-signin").val();
        if (email.length < 4) {
            alert("Please enter an email address.");
            return;
        }
        if (password.length < 4) {
            alert("Please enter a password.");
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                const currentUser = firebase.auth().currentUser;

                db.ref(`/users/${currentUser.uid}`).once("value", snapshot => {
                    db.ref(`/online/${currentUser.uid}`).set({ online: snapshot.val().username });
                });
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode === "auth/wrong-password") {
                    alert("Wrong password.");
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                $(".sign-in-button").prop("disabled, false");

                // [END_EXCLUDE]
            });
        // [END authwithemail]
    }
    $(".sign-in-button").prop("disabled, false");
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = $("#email").val();
    var password = $("#password").val();
    var username = $("#username").val();
    var fName = $("#fname").val();
    var lName = $("#lname").val();
    if (email.length < 4) {
        alert("Please enter an email address.");
        return;
    }
    if (password.length < 4) {
        alert("Please enter a password.");
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == "auth/weak-password") {
            alert("The password is too weak.");
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // If user state changes and "user" exists, check Firebase Database for user
            const userReference = db.ref(`/users/${user.uid}`);
            userReference.once("value", snapshot => {
                if (!snapshot.val()) {
                    // User does not exist, create user entry
                    userReference.set({
                        email: user.email,
                        username: username,
                        firstname: fName,
                        lastname: lName,
                    });
                }
            });
        }
    });
    // [END createwithemail]
}

function initApp() {
    // Listening for auth state changes.
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $("#rooms").fadeIn();
            $("#chatrooms").fadeIn();
            $("#list-of-users").fadeIn();
            $("#input-box").fadeIn();
            $("#div-button").fadeIn();
            $("#sign-in-view").hide();
            
        } else {
            $("#rooms").hide();
            $("#chatrooms").hide();
            $("#list-of-users").hide();
            $("#input-box").hide();
            $("#div-button").hide();
            $("#sign-in-view").show();
           
        }
    });
    // [END authstatelistener]
    $("#sign-in-button").click(toggleSignIn);
    $("#sign-up-button").click(handleSignUp);
    $("#sign-out-button").click(toggleSignIn);
}

window.onload = function () {
    initApp();
};


$(window).on("beforeunload", function () {
    removeUserFromOnlineList();
});