var config = {
    apiKey: "AIzaSyAF6jU7HH0MKgc4Illi56CsyTyr-yuZVp4",
    authDomain: "trainscheduler-850a6.firebaseapp.com",
    databaseURL: "https://trainscheduler-850a6.firebaseio.com",
    projectId: "trainscheduler-850a6",
    storageBucket: "",
    messagingSenderId: "627101584155"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#buttonSubmit").on("click", function() {
    event.preventDefault();
    console.log("I work");

    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime= $("#firstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    var trainInfo = {
        T: trainName,
        D: destination,
        Fi: firstTrainTime,
        Fr: frequency,
    };

    database.ref().push(trainInfo);

    console.log(trainInfo.T);
    console.log(trainInfo.D);
    console.log(trainInfo.Fi);
    console.log(trainInfo.Fr);

    alert("A new train has successfully been added to the schedule!");

    $('#trainName').val("");
    $('#destination').val("");
    $('#firstTrainTime').val("");
    $('#frequency').val("");
  });

  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());
      var trainName = childSnapshot.val().T;
      var destination = childSnapshot.val().D;
      var firstTrainTime = childSnapshot.val().Fi;
      var frequency = parseInt(childSnapshot.val().Fr);
        var formattedTrainTime = moment(firstTrainTime, "HH:mm");
        var max = moment.max(moment(), formattedTrainTime);
        var nextArrival;
        var minutesAway;
        // if the first train has not arrived set time until first train
        if (formattedTrainTime === max) {
            nextArrival = formattedTrainTime.format("HH:mm");
            minutesAway = formattedTrainTime.diff(moment(), "minutes")
        } else {
            // calculate difference between current time and next train
            var totalMinutes = moment().diff(formattedTrainTime, "minutes");
            var timeSinceLastTrain = totalMinutes % frequency;
            console.log(totalMinutes);
            console.log(timeSinceLastTrain);
            minutesAway = frequency - timeSinceLastTrain;
            nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
        }
      
      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(firstTrainTime),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway),
      );
    
      // Append the new row to the table
      $("#trainSchedule > tbody").append(newRow);
    });
    
