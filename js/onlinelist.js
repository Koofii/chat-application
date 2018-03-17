var listRef = new Firebase("https://<url>.firebaseio.com/presence/");
var userRef = listRef.push();

// Add ourselves to presence list when online.
var presenceRef = new Firebase("https://<url>.firebaseio.com/.info/connected");
presenceRef.on("value", function(snap) {
  if (snap.val()) {
    // Remove ourselves when we disconnect.
    userRef.onDisconnect().remove();

    userRef.set(true);
  }
});

// Number of online users is the number of objects in the presence list.
listRef.on("value", function(snap) {
  console.log("# of online users = " + snap.numChildren());
});    