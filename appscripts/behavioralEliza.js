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
            if ( arr[ind+1] - el  > 1.4*(el - arr[ind-1]) ){
              return 2; //percievable increase in pitch
            }
            else if( arr[ind+1] - el  < 0.6*(el - arr[ind-1])  ){
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

      agentResponse["schedule"] = transformTime( inputTime, timeTransform );
      agentResponse["pitch"] = transformPitch(inputPitch, pitchTransform);

      //agentResponse["loudness"] = transformLoudness(input, getPitchInterval(input));

      // groups
      //
      
      return agentResponse;
    }
    
  });


