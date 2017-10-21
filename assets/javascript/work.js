var config = {
    apiKey: "AIzaSyBH7heYTB0BvGKuBnqgSmxv6jhF-hc9i78",
    authDomain: "trainschedule-61ac7.firebaseapp.com",
    databaseURL: "https://trainschedule-61ac7.firebaseio.com",
    projectId: "trainschedule-61ac7",
    storageBucket: "trainschedule-61ac7.appspot.com",
    messagingSenderId: "308882222070"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var name = "";
var destination = "";
var firstTime = 0;
var frequency = "";

    // Capture Button Click
    $("#add-train").on("click", function(event) {
      event.preventDefault();

      // Grabbed values from text boxes
      name = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      firstTime = $("#time-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      // Code for handling the push
      database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

    });

    // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
    database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();
      var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
      
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      var tRemainder = diffTime % sv.frequency;
      console.log(tRemainder);

      var tMinutesTillTrain = sv.frequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
      // Console.loging the last user's data
      console.log(sv.name);
      console.log(sv.destination);
      console.log(sv.firstTime);
      console.log(sv.frequency);

      // Change the HTML to reflect
      $("#my-table").append("<tr><td>"+sv.name+"</td>"+
        "<td>"+sv.destination+"</td>"+
        "<td>"+sv.frequency+"</td>"+
        "<td>"+moment(nextTrain).format("hh:mm")+"</td>"+
        "<td>"+tMinutesTillTrain+"</td>"+
        "</tr>"
        );


      $("#name-display").text(sv.name);
      $("#role-display").text(sv.role);
      $("#date-display").text(sv.startDate);
      $("#rate-display").text(sv.rate);

      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  