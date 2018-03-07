const config = {
    apiKey: "AIzaSyAl4qIrAr0pjNYnvPQLp3ubQ1jRipSmYTw",
    authDomain: "gopnik-chat.firebaseapp.com",
    databaseURL: "https://gopnik-chat.firebaseio.com",
    projectId: "gopnik-chat",
    storageBucket: "gopnik-chat.appspot.com",
    messagingSenderId: "1075818501637"
};
firebase.initializeApp(config);


// Vars for Firebase
let db = firebase.database();
let auth = firebase.auth();
let provider = new firebase.auth.GithubAuthProvider();
let userId;

firebase.auth().onAuthStateChanged(function(currentUser) {
    if (currentUser) {
        $(".sign-up").hide();
        $(".sign-in").hide();
        //Show chatrooms + navigation
    } else {
        $(".sign-up").hide();
        $(".sign-in").show();
    }
});

// This is used to log in and verify details
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email-signin').value;
        var password = document.getElementById('password-signin').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
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
    var email = $('#email').val();
    var password = $('#password').val();
    var username = $('#username').val();
    var fName = $('#fname').val();
    var lName = $('#lname').val();
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });

    firebase.auth().onAuthStateChanged( user => {
        if (user) {
            // If user state changes and 'user' exists, check Firebase Database for user
            const userReference = db.ref(`/users/${user.uid}`);
            userReference.once('value', snapshot => {
                if (!snapshot.val()) {
                // User does not exist, create user entry
                    userReference.set({
                        email: user.email,
                        username: username,
                        firstname: fName,
                        lastname: lName
                    });
                }
            });
        }
    });
    // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        $("#verify-email").prop("disabled, false");
        // [END_EXCLUDE]
        if (user) {

            // User is signed in.
            const displayName = user.displayName;
            const email = user.email;
            const emailVerified = user.emailVerified;
            const photoURL = user.photoURL;
            const isAnonymous = user.isAnonymous;
            const uid = user.uid;
            const providerData = user.providerData;
            // [START_EXCLUDE]
            $('#sign-in-status').text("Signed in");
            $('#sign-in-button').text("Sign out");
            $('#account-details').text(JSON.stringify(user, null, '  '));
            if (!emailVerified) {
                $('#verify-email').prop("disabled, false");
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            $('#sign-in-status').text("Signed out");
            $('#sign-in-button').text("Sign in");
            $('#account-details').text("null");
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        $("#sign-in-button").prop("disabled, false");
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    
    $("#sign-in-button").click(toggleSignIn);
    $("#sign-up-button").click(handleSignUp);
    $("#verify-email").click(sendEmailVerification);
    $("#password-reset").click(sendPasswordReset);

   
}
window.onload = function() {
    initApp();
};