define(
  [],
  function(){

    //the cellular automaton rules that each object uses to compute
    //their states.
    
    return function ( inputSeq ) {

      var noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"];
      
      var findNote = function(note){
        return parseInt(
          noteMap.map( function (val, ind, arr) { if (val == note) { console.log(ind); return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
        );
      }

      function nextState (currentSeq){

        var nextSeq = [],prev=0,next=0;
        for(var j = 0; j < currentSeq.length; j++) {
          
          if( j-1 < 0){
            prev = currentSeq.length-1;
            console.log("negative")
          }
          else { prev = j-1;}

          if ( j + 1 >= currentSeq.length){
            next  = 0;
            console.log("index bounds")
          }
          else {next = j+1;}
          
          nextSeq[j] = applyRule( "" + currentSeq[prev] + currentSeq[j] + currentSeq[next] );
        }
        return nextSeq;
        
      }
      
      // input sequence of notes:
      // each note in the sequence is a perturbation at a certain
      // timestep.
      // for each note, an output CA sequence is calculated.
      // current state of the CA is in some fixed point?
      

      function applyRule (state){
        var rule = [0,0,1,0,0,0,0,1] ; //wolframs CA rules
        var ruleInd = ["000","001","010","011","100","101","110","111"];

        return parseInt(ruleInd.map(function(el,ind,arr){
          if(state == el){
            return rule[ind];
          }
          else {
            return "";
          }
        }).reduce( function (s1,s2) {return s1+s2;}))
      }
      
      // calculate the output for every sequence and based on the
      // perturbation and the current state.
      var currentSeq = [0,0,0,0,0,0,0,0,0,0,0,0,0], nextSeq = [], rule = [];
      
      //console.log("testing Agent" + inputSeq.length);
      
      for(var i = 0; i < inputSeq.length-1; i++) {
        
        var pert = inputSeq[i]; //string reprsenting a note
        //var pertLocation = findNote(pert);

        console.log("pertLocation is" + pert)

        console.log(currentSeq)
        nextSeq = nextState(currentSeq);
        console.log(nextSeq)
        nextSeq[pert] = 1;
        console.log(nextSeq)
        
        for(var k = 0; k < currentSeq.length; k++) {
          currentSeq[k] = nextSeq[k];
        }
        
      }
      
      var bittorio=[];
      console.log("finally nextseq is" + nextSeq)
      for( var i = 0; i < inputSeq.length-1; i++) {
        if ( bittorio.length == 0){
          
          bittorio.push(nextState(nextSeq));
        }
        else{
          bittorio.push( nextState(bittorio[bittorio.length-1]) );
        }
      }

      bittorio.push([inputSeq[inputSeq.length-1]]);
      console.log(nextSeq);
      console.log(bittorio);
      return bittorio;
    }
    
  });
