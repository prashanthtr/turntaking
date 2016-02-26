define(
  ["utils"],
  function(utils){

    return function(inputSeq){
      
      function elementValue( id ){
        var num = document.getElementById(id).value
        return parseInt(num);
      }

      function setElementValue (id, num){
        document.getElementById(id).value = num;
      }

      function tonic (note){
        if(note == 0){
          return 1;
        }
        else{
          return 0;
        }
      }

      function tranpose (arr,val){
        console.log("arr is" + arr);
        var tranposed = arr.map(function(el){return el - val;}) 
        return tranposed;
      }

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
      
      var input = inputSeq.map(function(el){return el.map(findNote)});
      var len = input.length;
      var startingNote = elementValue("startNote"),
          pitchAscent = elementValue("pitchAscent"),
          transposeN = elementValue("tranposeNum");
      
      console.log("starting eliza with input");
      utils.prettyPrint(input);
      //eliza begins
      if( len == 1 || (tonic(input[len-1][0]) &&
                       !tonic(input[len-1][7]) &&
                        len >= 6 &&
                        !arrEq(input[len-1], input[len-5])
                      ) ){
        //1-2 bars
        setElementValue("phase", "3-4"); 
        return [3*pitchAscent, 3*pitchAscent,
                2*pitchAscent, 2*pitchAscent,
                pitchAscent, pitchAscent,
                0,0];
      }
      else if ( !tonic(input[len-1][7]) &&
                !tonic(input[len-1][0]) &&
                len >= 6 &&
                !arrEq(input[len-1], input[len-5])
              ){
        // in 3-4 bars
        setElementValue("phase", "5-6"); 
        return input[len-1].map(function(el){return el+transposeN});
      }
      else if ( !tonic(input[len-1][0]) &&
                !tonic(input[len-1][7]) &&
                arrEq(input[len-2], tranpose(input[len-1], transposeN) )
              ){
        //in 5-6 bars
        setElementValue("phase", "7-8"); 
        return input[len-1];
      }
      
      else if ( !tonic(input[len-1][0]) &&
                !tonic(input[len-1][7]) &&
                arrEq( input[len-1],input[len-2])
              ){
        //in 7-8 bars
        setElementValue("phase", "9-10"); 
        return input[len-4];
      }
      else if ( len >=5 && tonic(input[len-1][0]) &&
                !tonic(input[len-1][7]) &&
                arrEq( input[len-1],input[len-5]) ){
        //9-10 bars
        setElementValue("phase", "11-12"); 
        return input[len-4];

      }
      
      else if ( !tonic(input[len-1][0]) &&
                tonic(input[len-1][7]) &&
                len >= 6 &&
                arrEq( input[len-1], input[len-5])
              ){
        //in 11-12 bars
        setElementValue("phase", "1-2"); 
        return [startingNote, startingNote,
                startingNote+7, startingNote+7,
                startingNote+9, startingNote+9,
                startingNote+7, startingNote+7,
               ];
      }
      else {
        var rand = Math.floor(Math.random()*len);
        return input[rand]; //random input to continue sequence
      }
      
    }
    
  });


