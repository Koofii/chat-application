    
document.getElementById("sign-in-button").addEventListener("click", function(e) {
    e.preventDefault();
    validateEmail();
    validatePassword();
});

function validateEmail() {
    let email = document.getElementById("email-signin").value;

    if (email.indexOf("@") === -1) {
        $("#email-signin").prop('class', 'invalid');
        console.log("invalid email");
        return false;
    } else{
        console.log("valid email");
        return true;
    }
}

function validatePassword() {
    let password = document.getElementById("password-signin").value;

    if (password.length <= 5) {
        $("#password-signin").prop('class', 'invalid');
        console.log("invalid password");
        return false;
    } else {
        console.log("valid password");
        return true;
    }
}
