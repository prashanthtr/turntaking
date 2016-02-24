define(
  [],
  function(){

    //the analogy agent that takes in musical phrases and maintains
    //some kind of structure similarity through high level analogy
    
    return function ( transcription ) {
      
      var noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"];

      var noteRelations = ["up", "down", "up+", "down+"];
      // only semitone and more than semitone relations
      
      function findNote (note){
        return parseInt(
          noteMap.map( function (val, ind, arr) { if (val == note) { console.log(ind); return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
        );
      }

      //uses the nte relations to form an abstract description of transcription
      function createAnalogy (lastPhrase){
        lastPhrase = lastPhrase.map( findNote);

        var abstraction = lastPhrase.map(function(el,ind,arr){
          if( ind == 0 ){return el;}
          else{
            str2 = el;
            str1 = arr[ind-1];
            console.log(str1 + "and" + str2)
            return str2 - str1;
            // if( str2 - str1 > 1 ) return "up+"; //tone
            // else if(str2 - str1 == 1 ) return "up"; //semitone
            // else if(str2 - str1 == -1 ) return "down"; //semitone
            // else if(str2 - str1 < -1 ) return "down+"; //tone 
            // else if (str2 - str1 == 0) return "same";
            // else return "";
          }
        });
        return abstraction;
      }


      //uses the first note to generate the rest of notes in sequence
      function analogyGen( abstraction){
        var output = [];
        
        for(var i = 0; i < abstraction.length; i++) {
          if( i == 0){
            output[i] = abstraction[0];
          }
          else{

            str1 = output[i-1];
            str2 = abstraction[i];

            if( str2 == "up" ) {output[i] = str1 + 1; } 
            else if(str2 == "down" ) {output[i] = str1 - 1; } 
            else if(str2  == "same" ) {output[i] = str1; }
            else if(str2 == "up+" ) {
              output[i] = str1 + Math.floor((13-str1)*Math.random());
            }  //tone 
            else if ( str2 == "down+" ){
              output[i] = str1 - Math.floor(str1*Math.random());
            }//staying within octave
            else return output[i] = -12; //constant C
          }
        }

        //firstNote + "," + 
        console.log("outou" + output)
        return output;
      }
      
      // two d matrix of weights based on only adjacent note probablities
      // [   C C# D D#]
      // [C           ]
      // right now, it is trained only on note sequences

      //normalize
      var inputPhrase = transcription[transcription.length-1];
      var abstraction = createAnalogy(inputPhrase); //single analogy
      var outputSeq = analogyGen (abstraction); //length of lat phrase

      console.log(abstraction);
      console.log(outputSeq);
      return outputSeq;
    }
    
  });
