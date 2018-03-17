
const userlist = $("#list-of-users ul");

db.ref("/online").on("value", snapshot => {

    const online = Object.keys(snapshot.val()).map(key => {
        return snapshot.val()[key]["online"];
    });

    userlist.html("");
    online.forEach(val => {
        userlist.append(`<li>${val}</li>`);
    });

    // Object.keys(snapshot.val()).forEach(val => {
    //     console.log(snapshot.val()[val]["online"]);
    // });
    
    //console.log(snapshot.val());
})