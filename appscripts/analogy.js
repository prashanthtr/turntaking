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
      
      //uses the note relations to form an abstract description of transcription
      function abstraction (lastPhrase){
        lastPhrase = lastPhrase.map( findNote);
        var abstr = lastPhrase.map(function(el,ind,arr){
          if( ind == 0 ){return el;}
          else{
            str2 = el;
            str1 = arr[ind-1];
            console.log(str1 + "and" + str2)
            return str2 - str1;
            //if( str2 - str1 > 1 ) return "up+"; //tone
            //else if(str2 - str1 == 1 ) return "up"; //semitone
            //else if(str2 - str1 == -1 ) return "down"; //semitone
            //else if(str2 - str1 < -1 ) return "down+"; //tone 
            //else if (str2 - str1 == 0) return "same";
            //else return "";
          }
        });

        console.log("abstraction is " + abstr)
        return abstr;
      }
      
      // //simplest grouping, pair cells that are within semitone range
      // function createGrouping (abstraction){
      //   return abstraction.reduce(function(str1, str2){
      //     if( str2 == "up+" || str2 == "down+"){
      //       return str1 + ",|," + str2; 
      //     }
      //     else{
      //       return str1 + "," + str2;
      //     }
      //   });
      // }
      
      //uses the first note to generate the rest of notes in sequence
      // needs four notes always
      function analogyGen(inputSeq){
        
        var output = [];
        var lastPhrase = inputSeq[inputSeq.length-1];

        var abstLast = abstraction(lastPhrase);
        var seqMatch = findNote(lastPhrase[0]) + "000";

        //console.log("last phrase s" + lastPhrase);
        // console.log("abstr of last phrase is" + abstLast)
        //console.log(  seqMatch );
        
        if( abstLast.join("") == seqMatch ){
          if( inputSeq.length == 1 ){
            console.log("phrase 1")
            document.getElementById("phase").value = 2;
          
            output = lastPhrase.map(findNote).map(function(el) {return el+2;});
          }// A mode, tranpose by 1
          else {
            var secondLast = inputSeq[inputSeq.length-2];
            if( lastPhrase[0] - secondLast[0] == 2){ //second mode only tone increase
              console.log("phrase 2");
              document.getElementById("phase").value = 3;
          
              output = lastPhrase.map(findNote).map(function(el,ind,arr) {return el+ind*2;}); //increase every note by its position
            }
            else{ //still A mode only
              console.log("phrase 2");
              document.getElementById("phase").value = 1;
          
              output = lastPhrase.map(findNote).map(function(el) {return el+2;});
            }
          }
        }
        else{
          console.log("phrase 4");
          document.getElementById("phase").value = 4;
          var rs = inputSeq[inputSeq.length-1].map(findNote)[0];
          if(rs-4 < 0){
            rs = (12 + rs - 4)% 13; //turn around
            output = [rs,rs,rs,rs];
          }
          else{
            output = [rs-4,rs-4,rs-4,rs-4];
          }
          
        }//in C, to resolution which is A 
        
        //firstNote + "," + 
        //console.log("outou" + output)

        return output;
      }
      
      // two d matrix of weights based on only adjacent note probablities
      // [   C C# D D#]
      // [C           ]
      // right now, it is trained only on note sequences
      
      //normalize
      //var inputPhrase = transcription[transcription.length-1];
      //var abstraction = createAbstraction(inputPhrase); //single analogy
      //var grouping = createGrouping(abstraction);

      var outputSeq = analogyGen (transcription); //length of lat phrase
      
      //console.log(abstraction);
      //console.log(grouping);
      console.log(outputSeq);
      return outputSeq;
    }
    
  });


        // for(var i = 0; i < abstraction.length; i++) {
        //   if( i == 0){
        //     output[i] = abstraction[0];
        //   }
        //   else{

        //     str1 = output[i-1];
        //     str2 = abstraction[i];

        //     if( str2 == "up" ) {output[i] = str1 + 1; } 
        //     else if(str2 == "down" ) {output[i] = str1 - 1; } 
        //     else if(str2  == "same" ) {output[i] = str1; }
        //     // else if(str2 == "up+" ) {
        //     //   output[i] = str1 + Math.floor((13-str1)*Math.random());
        //     // }  //tone 
        //     // else if ( str2 == "down+" ){
        //     //   output[i] = str1 - Math.floor(str1*Math.random());
        //     // }//staying within octave
        //     else return output[i] = -12; //constant C
        //   }
