require(
  ["squareGrid","utils"],
  function (squareGrid,utils) {

    // --------------- Inits ------------------------------
    
    //bittorio display on which display happens
    var bittorio = [];
    var timer = -1;
    
    // --------------------- FUNCTIONS ----------------
    
    // Draws the now line on startup and when canvas is redrawn
    function drawKeys (){
      
      var svg = document.getElementById('bittorio');
      var rect = svg.getBoundingClientRect();
      var nowy = (rect.height/2-25);
      
      var lineTop = document.createElementNS("http://www.w3.org/2000/svg", "path");
      var lineBottom = document.createElementNS("http://www.w3.org/2000/svg", "path");

      bittorio = squareGrid("bittorio", 13);
      
      lineTop.setAttribute("d", "M0 " + nowy + " L"+ rect.width + " " + nowy + " Z");
      lineTop.setAttribute("stroke", "red");

      lineBottom.setAttribute("d", "M0 " + (nowy+50) + " L"+ rect.width + " " + (nowy+50) + " Z");
      lineBottom.setAttribute("stroke", "red");
      
      svg.appendChild(lineTop);
      svg.appendChild(lineBottom);
    }


    function userGuide (){
      
      document.getElementById('userGuide').innerHTML = "<p> The following text provides instructions to play along with the a turn taking system whose goal is provide reflexive interactions. </p>";
      
      document.getElementById('userGuide').innerHTML += "<h2> Key mapping </h2> Use the following key mapping to the input a sequence of notes. The notes are toggled on or off to indicate the sequence you have. Black notes are on and grey notes are off. <ol> <li>a - C</li> <li>s - C#</li> <li>d- D</li> <li>f- D#</li> <li>\g- E</li> <li>h - F</li> <li>j - F#</li> <li>k - G</li> <li>l - G#</li> <li>; - A</li> <li>' - A#</li> <li>Enter - B</li> </ol> <h3> R - reset cells, C - clear transcription </h3>";

      document.getElementById('userGuide').innerHTML += "<h2> User interaction </h2> Press a certain sequence of notes through keyboard key press. Press start to automatically generate a sequence that is a continuation of the input. Try to continue the interaction";
    }
    
    drawKeys();
    
    // //function that updates the rows after on screen each action
    // function rowChange (rc){
    //   for(var row = rc+1; row < bittorio.length; row++) {
    //     caupdate.changeFuture(bittorio,row);
    //   }

    // }
    utils.clear(bittorio);
    utils.clearTranscription();
    userGuide();

    /// ------------ Events on buttons ---------------------------
    
    document.onkeypress = function(evt){

      console.log(evt)
      var code = evt.which || evt.keyCode;

      var keyMap = [97,115,100,102,103,104,106,107,108,59,39,46,47];
      var noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"];
      
      if( code == 114){
        utils.clear(bittorio);
        document.getElementById("transcription").value += ",|,";
      }
      else if( code == 99){
        utils.clearTranscription();
      }
      else if( keyMap.indexOf(code) != -1) {
        
        var findKey = function (code){
          return parseInt(
            keyMap.map( function (val, ind, arr) { if (val == code) { console.log(ind); return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
          );
        }

        var findNote = function(note){
          return parseInt(
            noteMap.map( function (val, ind, arr) { if (val == note) { console.log(ind); return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
          );
        }
        
        var str = document.getElementById("transcription").value;
        str = str.split(",");
        var oldInd = str[str.length-1];
        console.log("old ind ias" + oldInd)
        
        if ( oldInd == ""){
          //first time
        }
        else{
          console.log("hi" + oldInd);
          bittorio[findNote(oldInd)].updateFn(); //close the previous playing note
        }
        
        var index = findKey(code);

        bittorio[index].userChange = 1;
        bittorio[index].updateFn();

        if (oldInd == ""){
          document.getElementById("transcription").value += noteMap[index];
        }
        else if (oldInd == "|"){
          
        }
        else if( bittorio[index].state == 1 ){
          document.getElementById("transcription").value += "," + noteMap[index];
        }
        
        if (timer == -1){
          timer = evt.timeStamp;
          document.getElementById("time").value += 0;
        }
        else{
          if(bittorio[index].state == 1){
            document.getElementById("time").value += "," + (evt.timeStamp - timer)/1000;
          }
        }
        
      }
      else{
        console.log("no change")
      }
      
    }
        
    document.getElementById('clear').onclick = function(){
      utils.clear(bittorio);
    }

    document.getElementById('clearT').onclick = function(){
      utils.clearTranscription();
    }
    
    // document.getElementById('start').addEventListener("click", function(){
    //   //console.log("here after reset");
    //   rowChange(now);
    //   if(run == null){
    //     run = setInterval(simulate , parseFloat(document.getElementById("loopTime").value)); // start setInterval as "run";
    //   }
    // },true);

    // document.getElementById('gain').onchange = function(){
    //   utils.setGain(bittorio[now], utils.getVal("gain"));
    // }

    
    
    /// ------------ Timers -------------------------------

    //current timer - or the now row
    var run = null;
    
  });
