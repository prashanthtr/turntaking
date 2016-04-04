define(
  ["utils"],
  function(utils){

    return function(inputSeq, inputTime){

      function elementValue( id ){
        var num = document.getElementById(id).value
        return parseInt(num);
      }

      function setElementValue (id, num){
        document.getElementById(id).value = num;
      }

      // function tonic (note){
      //   if(note == 0){
      //     return 1;
      //   }
      //   else{
      //     return 0;
      //   }
      // }

      // function tranpose (arr,val){
      //   console.log("arr is" + arr);
      //   var tranposed = arr.map(function(el){return el - val;}) 
      //   return tranposed;
      // }
      
      function arrEq( arr1, arr2){
        if( arr1.join(",") == arr2.join(",")){
          return 1
        }
        else{
          return 0
        }
      }

      var noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"];
      
      function findNote (note){
        return parseInt(
          noteMap.map( function (val, ind, arr) { if (val == note) { console.log(ind); return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
        );
      }

      //checks if the two numbers are within range
      function R(  n1, n2 ){
        if( n1 > 1.2*n2 || n1 < 0.8*n2){
          return 1; //out of range 
        }
        else {
          return 0; //within range
        }
      }
      
      //only sending in the last phrase for now
      var inputPitch = inputSeq.map(function(el){return findNote(el);});
      var inputTime = inputTime.map(function(el){return parseInt(el)});
      
      // var startingNote = elementValue("startNote"),
      //     pitchAscent = elementValue("pitchAscent"),
      //     transposeN = elementValue("tranposeNum");
      
      console.log("starting eliza with input");
      //utils.prettyPrint(input);
      console.log(inputPitch + " " + inputTime);

      // ------------- grouping and perception ---------

      //system that recognizes only a single change in the tempo
      function onlySingleChange ( phraseTime){

        console.log("here is single change detector" + phraseTime)

        var interval = [];
        var cP = 0, cC = 0, cF = 0;
        for(var i = 0; i < phraseTime.length; i++) {
          
          if( i == 0 ){
           interval[i] = 0; // a change from nothing
          }
          else if(i == phraseTime.length-1){
            interval[i] = 0  //phraseTime[i] - phraseTime[i-1]; //distance between last and second last
          }
          else if ( i == 1 || i == phraseTime.length-2 ){
            cC1 = phraseTime[i] - phraseTime[i-1]; //immediate future 
            cC2 = phraseTime[i+1] - phraseTime[i]; // immediate past
            
            if ( R( cC2, cC1) ){
              interval[i] = 1; //different time 
            }
            else{ // if the interval is greater than required amount
              interval[i] = 0;
            }
          }
          else{ // checking future progression.

            var cP = phraseTime[i-1] - phraseTime[i-2],
                cC1 = phraseTime[i] - phraseTime[i-1],
                cC2 = phraseTime[i+1] - phraseTime[i],
                cF = phraseTime[i+2] - phraseTime[i+1]; 

            // 001 
            if( !R( cP, cC1 ) && !R(cC1, cC2) && R(cC2, cF)  ){
              interval[i] = 0 //R(cC1, cC2); // single change happens
              //later
              //uses the single change from the future in the present
            }
            // 010, 011 
            else if ( (!R( cP, cC1 ) && R(cC1, cC2) && !R(cC2, cF))
                      || 
                      (!R( cP, cC1 ) && R(cC1, cC2) && R(cC2, cF))
                    ){
              interval[i] = R(cC1, cC2); //point of change
            }
            // 100,101, 111, 110
            else if ( (R( cP, cC1 ) && !R(cC1, cC2) && !R(cC2, cF))
                      || (R( cP, cC1 ) && R(cC1, cC2) && !R(cC2, cF))
                      || (R( cP, cC1 ) && !R(cC1, cC2) && R(cC2, cF))
                      || (R( cP, cC1 ) && R(cC1, cC2) && R(cC2, cF))
                    ){
              interval[i] = 0; // single change occured
            }
            else { //000
              interval[i] = 0; // no change, it continues as it does
            }
          }
        }
        
        console.log("intervals is" + interval)
        return interval; 

      }

      // cybernetic rhythm system that uses relative difference in
      // durations to determine the interval breaks
      function cyberneticRhythm( phraseTime){
        
        // Cpr = R(arr[ind+1] - el, arr[ind] - arr[ind-1] );
        // cF = R(arr[ind+2] - arr[ind+1], arr[ind+1] - el );
        // cPa = R( arr[ind-1] - arr[ind-2], arr[ind+1] - el );

//         cf is within range of cpa.
// 1) rhythm has not changed (cpa, cp, cf are all within range) [no change]
// 2) rhythm has changed once and then comes within range [play cp within range, play cf as cp, ]

// cf is out of range of cpa means.
// 1) cp is within range and cf is not [play cp out of range]
// 2) cp is out of range and cf is within range of cp [play cf in cp range]
// 2) cp is out of range and cf is out of range of cp [play cf in cp range]


// 0 0 0 -> continue
// 0 1 0 -> 0 1 1
// 0 0 1 -> 0 1 1
// 0 1 0 -> 0 1 1
// 0 1 1 -> 0 1 0
        
        var intervals = phraseTime.map(function(el,ind,arr){
          //if( ind == 0 ){
          //  return 1;
          //}
          if(ind == arr.length-1){
            return el - arr[ind-1]; //distance between last and second last
          }
          else{ // using the current state to check future state.
            if ( arr[ind+1] - el  > 1.2*(el - arr[ind-1]) ){
              return 1; //different time 
            }
            else if( arr[ind+1] - el  < 0.8*(el - arr[ind-1])  ){
              return 1; //different time
            }
            else{ // if the interval is greater than required amount
              return 0;
            }
          }
        });

        console.log("intervals is" + intervals)
        return intervals; 
      }


      
      // Recgonizes pitch duration between +1/-1 pitch/time intervals, double
      //interval is something greater than > than 1.4 of the original
      // simplest algo needs 3 pitches to find relations, t1,t0,t-1. 
      function getArrInterval( phraseTime){
        
        var intervals = phraseTime.map(function(el,ind,arr){
          //if( ind == 0 ){
          //  return 1;
          //}
          if(ind == arr.length-1){
            return 1;
          }
          else{
            if ( arr[ind+1] - el  > 1.4*(el - arr[ind-1]) ){
              return 2;
            }
            else if( arr[ind+1] - el  < 0.6*(el - arr[ind-1])  ){
              return 0.5;
            }
            else{
              return 1;
            }
          }
        });

        console.log("intervals is" + intervals)
        return intervals; 
      }


      // Recgonizes pitch duration between +1/-1 pitch/time intervals, double
      //interval is something greater than > than 1.4 of the original
      // simplest algo needs 3 pitches to find relations, t1,t0,t-1. 
      function getPitchInterval( pitch){
        
        var intervals = pitch.map(function(el,ind,arr){
          //if( ind == 0 ){
            //return 1;
          //}
          if(ind == arr.length-1){
            return 0;
          }
          else{
            if ( arr[ind+1] - el  > 1.05*(el - arr[ind-1]) ){
              return 2; //percievable increase in pitch
            }
            else if( arr[ind+1] - el  < 0.95*(el - arr[ind-1])  ){
              return -2; // percievable decrease in pitch
            }
            else{
              return 1; //preserve the distance
            }
          }
        });
        
        console.log("intervals is" + intervals)
        return intervals; 
      }
      
      //-------------- Actual transformation functions ----

      function cyberneticTime ( phraseTime){
        
        var intervals = onlySingleChange(phraseTime);
        console.log("new inteval" + intervals)
        
        //uses previous time to calculate .
        var timeModel = [];
        var curInterval = phraseTime[1] - phraseTime[0];
        console.log("curInterval is" + curInterval)

        for(var ind = 0; ind < intervals.length; ind++) {
          if(ind == 0){
            timeModel[ind] = phraseTime[ind]; //this is 0
          }
          else if (ind == intervals.length-1){
            timeModel[ind] = timeModel[ind-1] + (phraseTime[ind] - phraseTime[ind-1]);  //last interval
          }
          else{
            if ( intervals[ind] == 0) { //constant time
              timeModel[ind] = timeModel[ind-1] + curInterval; // update 
            }
            else{
              timeModel[ind] = timeModel[ind-1] + curInterval; // update 
              curInterval = phraseTime[ind+1] - phraseTime[ind]; //next
              console.log("intervals are" + intervals)
              console.log("curInterval is" + curInterval)
              //time - current time (becasue this number has changed,
              //which means that the next duration is a greater interval)
              //timeModel[ind] = timeModel[ind-1] + curInterval;
            }

          } 
        }
        
        console.log("phrase time is" + phraseTime)
        console.log("time model is" + timeModel);

        return timeModel; //return inverse;

        
      }
      
      //takes the original phrase and transforms it using the
      //intervals  
      function transformTime ( phraseTime, transformFn ){

        if( document.getElementById("timeTransforms").value == "mirror" ){
          return phraseTime;
        }
        else{
          var intervals = getArrInterval(phraseTime);
          intervals = transformFn ( intervals);

          console.log("new inteval" + intervals)
          //uses previous time to calculate .
          var timeModel = [];
          for(var ind = 0; ind < intervals.length; ind++) {
            if(ind == 0){
              timeModel[ind] = phraseTime[ind];
            }
            else{
              var rescaledTime = timeModel[ind-1] + (phraseTime[ind] - phraseTime[ind-1])*intervals[ind];
              //console.log("scale is" + typeof(phraseTime[ind]) + " " + typeof(rescaledTime))
              timeModel[ind] = rescaledTime; //rescaling the time
            }
          }
          
          console.log("phrase time is" + phraseTime)
          console.log("time model is" + timeModel);

          return timeModel; //return inverse;

        }
        
      }
      
      //takes the original phrase and transforms it using the
      //intervals 
      function transformPitch( pitch, transformFn ){

        if( document.getElementById("pitchTransforms").value == "mirror"){
          return pitch;
        }
        else{
          
          var intervals = getPitchInterval(pitch);
          intervals = transformFn ( intervals);
          
          //uses previous pitches and intervals to calculate new pitch .
          var pitchModel = [];
          for(var ind = 0; ind < intervals.length; ind++) {
            if(ind == 0){
              pitchModel[ind] = pitch[ind];
            }
            else{
              //inverts if the distance is within a certain, or else
              //magnifies or decreases distance
              pitchModel[ind] = pitch[ind-1] + intervals[ind]*(pitch[ind] - pitch[ind-1]); 
              //console.log("scale is" + typeof(pitch[ind]) + " " + typeof(rescaledTime))
              pitchModel[ind] = Math.round(pitchModel[ind]);
            }
          }
          
          console.log("pitches are" + pitch)
          console.log("pitch model is" + pitchModel);

          return pitchModel; //return inverse;
        }
        
      }

      //-------- custom functions ------------//

      function mirror(){
        return 1;
      }
      
      //inverse of intervals [various ways to decide this]
      function cmirror (arr) {
        return arr; 
      }
      
      function reverse (arr){
        console.log("original is " + arr)
        return arr.map(function(el,ind,arr){
          return arr[arr.length-1-ind]; 
        });
      }

      function invert (arr){
        return arr.map(function(el,ind,arr){
          return 1/el;
        });
      }
      
      function invertReverse (arr){
        return invert(reverse(arr));
      }
      
      //---------- agent IO ----------------
      
      var agentResponse = {};
      var pitchTransform = eval(document.getElementById("pitchTransforms").value);
      var timeTransform = eval(document.getElementById("timeTransforms").value);
      var loudnessTransfrom = eval(document.getElementById("timeTransforms").value);

      console.log("timetrans is" + timeTransform)

      //agentResponse["schedule"] = transformTime( inputTime, timeTransform );
      
      agentResponse["schedule"] = cyberneticTime( inputTime);
      agentResponse["pitch"] = transformPitch(inputPitch, pitchTransform);

      //agentResponse["loudness"] = transformLoudness(input, getPitchInterval(input));

      // groups
      //
      
      return agentResponse;
    }
    
  });


