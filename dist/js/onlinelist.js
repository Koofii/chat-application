/* global db */

const userlist = $("#list-of-users ul");

function updateOnline() { //eslint-disable-line
    db.ref("/online").on("value", snapshot => {
        const online = Object.keys(snapshot.val()).map(key => {
            return snapshot.val()[key]["online"];
        });

        userlist.html("");
        online.forEach(val => {
            userlist.append(`<li>${val}</li>`);
        });
    });
}