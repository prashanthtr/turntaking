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

      function sum(a,b){return a + b;}
      
      // recognizes increasing sequence and continues
      function getPitchInterval( pitch){
        
        var intervals = pitch.map(function(el,ind,arr){
          if( ind == 0 ){
            return 1;
          }
          if(ind == arr.length-1){
            return 1;
          }
          else{
            if( el - arr[ind-1] == 0 ){
              return 1;
            }
            else{
              var ratio = (arr[ind+1] - el)/(el - arr[ind-1])
              if(ratio > 0){
                return 1;
              }
              else{
                return -1;
              }
            }
          }
        });
        
        console.log("intervals is" + intervals)
        return intervals.reduce(sum); 
      }
      
      //-------------- Actual transformation functions ----

      //takes the original time and continues it using the intervals

      function transformTime ( phraseTime, pitchModel ){
        
        //uses previous time to calculate .
        var timeModel = [];

        var interval = phraseTime[phraseTime.length-1] - phraseTime[phraseTime.length-2];
        timeModel[0] = 0;
        
        for(var ind = 1; ind < pitchModel.length; ind++) {
          var rescaledTime = timeModel[ind-1] + interval;
        }
        
        console.log("phrase time is" + phraseTime)
        console.log("time model is" + timeModel);

        return timeModel; //return inverse;
      }

      //takes the original phrase and transforms it using the
      //intervals 
      function elizaResponse( pitch ){
        
        var interval = getPitchInterval(pitch);

        //uses previous pitches and intervals to calculate new pitch .
        var pitchModel = [];
        
        if(  interval == pitch.length) { //increasing seq

          pitchModel[0] = pitch[pitch.length-2];
          var incInterval = pitch[pitch.length - 1] - pitch[pitch.length - 2];
          //  increase the sequence
          for(var ind=1; ind < 4; ind++) {
            pitchModel[ind] = pitchModel[ind-1] + incInterval; 
          }
          
        }
        else if (interval == -pitch.length ) {//decreasing seq, eliza
          //continues sequence 
          
          //var revPitch = pitch.reverse();
          var decInterval = pitch[pitch.length - 1] - pitch[pitch.length - 2];
          pitchModel[0] = pitch[pitch.length-2];
          //  increase the sequence
          for(var ind=1; ind < 4; ind++) {
            pitchModel[ind] = pitchModel[ind-1] + decInterval; 
          }
          
        }
        else { //increasing and decreasing seqiuemce, eliza holds
          pitchModel[0] = pitch[pitch.length-2];
          pitchModel[1] = pitch[pitch.length-1];
        }
        
        console.log("pitches are" + pitch)
        console.log("pitch model is" + pitchModel);

        return pitchModel; //return inverse;
      }
      

      //-------- custom functions ------------//

      
      
      //---------- agent IO ----------------
      
      var agentResponse = {};

      // var pitchTransform = eval(document.getElementById("pitchTransforms").value);
      // var timeTransform = eval(document.getElementById("timeTransforms").value);
      // var loudnessTransfrom = eval(document.getElementById("timeTransforms").value);

     
      
      pitchResponse = elizaResponse(inputPitch);
      agentResponse["pitch"] = pitchResponse;
      agentResponse["schedule"] = transformTime( inputTime, pitchResponse);
      
      //agentResponse["loudness"] = transformLoudness(input, getPitchInterval(input));

      // groups
      //
      
      return agentResponse;
    }
    
  });


