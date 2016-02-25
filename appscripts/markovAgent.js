define(
  [],
  function(){

    //the cellular automaton rules that each object uses to compute
    //their states.
    
    return function ( trainingSeq, inputNote ) {
      
      var noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"];
      
      function findNote (note){
        return parseInt(
          noteMap.map( function (val, ind, arr) { if (val == note) { console.log(ind); return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
        );
      }

      function trainModel (transcription, markovChain){

        transcription.map( function(el,id,arr){
          index = findNote(el); 
          if( id == arr.length-1){
            for(var i = 0; i < 13; i++) { //last note
              markovChain[index][i] += 0;
            }
          }
          else{
            for(var i = 0; i < 13; i++) { //for all notes
              if (arr[id+1] == noteMap[i]){ //for each round update the
                //next note 
                markovChain[index][i] += 1;
              }
              else{
                markovChain[index][i] += 0;
              }
            }
          }
        });

        return markovChain;
      }

      //uses the first note to generate the rest of notes in sequence
      function markovGen( markovModel, input, length){

        console.log("here" + input + " " + length)
        var output = [];
        for(var i = 0; i < length; i++) {
          inputIndex = findNote(input);
          var greatest = markovModel[inputIndex].reduce( function (s1,s2) {if (s1 > s2) {return s1;} else { return s2;} }) 
          var grIndex = markovModel[inputIndex].indexOf(greatest);
          output[i] = noteMap[grIndex];
          input = output[i]; 
        }
        return output;
        
      }
      
      // two d matrix of weights based on only adjacent note probablities
      // [   C C# D D#]
      // [C           ]
      // right now, it is trained only on note sequences
      
      var markovChain = [];

      for(var i = 0; i < 13; i++) {
        markovChain[i] = [];
        for(var j = 0; j < 13; j++) {
          markovChain[i][j] = 0;
        }
      }


      var count = 0;
      // markov is a 2d matrix that is used to retrieve continuations
      // of a sequence using the first note?
      for(var i = 0; i < trainingSeq.length; i++) {
        markovChain = trainModel(trainingSeq[i],markovChain);
        count += trainingSeq[i].length;
      }

      //normalize
      
      console.log("count is" + count)
      for(var i = 0; i < markovChain.length; i++) {
        for(var j = 0; j < markovChain[i].length; j++) {
          markovChain[i][j] = markovChain[i][j] / count; //distribution 
        }
      }
      
      markovChain.map(function(el){
        console.log(el.join(" "));
      })

      console.log("input note is" + inputNote)
      var outputSeq = markovGen (markovChain, inputNote, trainingSeq[trainingSeq.length-1].length); //length of lat phrase

      console.log(outputSeq);
      return outputSeq;
    }
    
  });
