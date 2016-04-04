require(
  ["squareGrid","utils","sound-module","caAgent","markovAgent","analogy","3partEliza"],
  function (squareGrid,utils,basicOsc,caAgent,markovAgent,analogy,eliza) {

    // --------------- Inits ------------------------------
    
    //bittorio display on which display happens
    var bittorio = [];
    var timer = -1;
    
    // --------------------- FUNCTIONS ----------------
    
    // Draws the now line on startup and when canvas is redrawn
    function drawKeys (){
      
      var svg = document.getElementById('bittorio');
      var rect = svg.getBoundingClientRect();
      var nowy = (rect.height/2-50);

      var cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      // Set any attributes as desired
      cell.setAttribute("x", 0);
      cell.setAttribute("width", rect.width);
      cell.setAttribute("height",  150);
      cell.setAttribute("fill", "white");
      cell.setAttribute("fill-opacity", "0.2");
      
      var lineTop = document.createElementNS("http://www.w3.org/2000/svg", "path");
      var lineBottom = document.createElementNS("http://www.w3.org/2000/svg", "path");

      bittorio = squareGrid("bittorio", 13);
      
      lineTop.setAttribute("d", "M0 " + nowy + " L"+ rect.width + " " + nowy + " Z");
      lineTop.setAttribute("stroke", "red");

      lineBottom.setAttribute("d", "M0 " + (nowy+100) + " L"+ rect.width + " " + (nowy+100) + " Z");
      lineBottom.setAttribute("stroke", "red");
      
      svg.appendChild(lineTop);
      svg.appendChild(lineBottom);
      svg.appendChild(cell);
    }


    function userGuide (){
      
      document.getElementById('userGuide').innerHTML = "<p> The following text provides instructions to play along with the a turn taking system. The system has a set of behaviors for pitch, duration and loudness, that the user can select. User can select a particular type of system behaviors, and improvise by taking turns. </p>";
      
      // document.getElementById('userGuide').innerHTML += "<h2> Key
      // mapping </h2> Use the following key mapping to the input a
      // sequence of notes. The notes are toggled on or off to
      // indicate the sequence you have. Black notes are on and grey
      // notes are off. <ol> <li>a - C</li> <li>s - C#</li> <li>d-
      // D</li> <li>f- D#</li> <li>\g- E</li> <li>h - F</li> <li>j -
      // F#</li> <li>k - G</li> <li>l - G#</li> <li>; - A</li> <li>' -
      // A#</li> <li>Enter - B</li> </ol> <h3> R - reset cells, C -
      // clear transcription </h3>";
      
      document.getElementById('userGuide').innerHTML += "<h2> User interaction </h2> <ol> <li> Set each system behaviors separately (mirror, inverse, reverse) in the boxes in the left most column. </li> <li> 'Mirror' exactly repeats the user's input. All other behaviors change some aspect of the music in their response to the user. </li> <li> Press any sequence of notes through keyboard key presses. Press 'b' to signal the end of the user sequence and let the computer respond based on the behavior. </li> <li> Key more sequence of notes and continue the interaction from step 1. </li> <li> Press 'c'to clear the transcription display box. </li> </ol>"

      document.getElementById('userGuide').innerHTML += "<br> <h2> Experiment with structures </h2> Once you are able to understand what each behavior does separately, select multiple behaviors using the boxes to have a certain combinations of improvisational behaviors. A description of behaviors are: <li> <b> Exact mirror: </b> Exactly mirrors the user input </li> <li> <b> Partial mirror: </b> Closely mirrors the pitch/time/loudness when interval changes are within a threshold, but exagerates the changes when they are more than threshold.  </li> <li> <b> Inverse: </b> Inverts the interval changes in pitch/time/loudness intervals between successive notes. <li> <b> Reverse: </b> Reverses the interval changes in  pitch/time/loudness intervals between successive notes from end to start. </li> </ol>"
      
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

      //console.log(evt)
      var code = evt.which || evt.keyCode;

      //s,e,d,r,f,g,y,h,u,j,i,k,l,
       
      var keyMap = [115, 101, 100, 114, 102, 103, 121, 104, 117, 106, 105, 107, 108];
      //var keyMap = [97,115,100,102,103,104,106,107,108,59,39,46,47];
      var noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"];

      //bar break
      
      if( code == 98){
        utils.clear(bittorio);
        document.getElementById("transcription").value += ",|,";
        document.getElementById("time").value += "," + (evt.timeStamp-timer) + ",|,"; //extra space
        timer = -1;
        playResponse();
      }
      else if( code == 99){
        utils.clearTranscription();
      }
      else if( keyMap.indexOf(code) != -1) {
        
        var findKey = function (code){
          return parseInt(
            keyMap.map( function (val, ind, arr) { if (val == code) { return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
          );
        }

        var findNote = function(note){
          return parseInt(
            noteMap.map( function (val, ind, arr) { if (val == note) { return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
          );
        }
        
        var str = document.getElementById("transcription").value;
        str = str.split(",");
        var oldInd = str[str.length-1];
                        //console.log("old ind is" + oldInd)
        
        if ( oldInd == ""){
          //first time
        }
        else{
          //console.log("hi" + oldInd);
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
            document.getElementById("time").value += "," + (evt.timeStamp - timer);
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


    // --------- system response ------------------
    // system reads from the transcription and randomly plays the last
    // few notes from the transcription
    
    function playResponse (){

      //console.log("entering")
      //generates a response

      
      var user = utils.parseTextBox("transcription");
      var system = utils.parseTextBox("output");
      var timing = utils.parseTextBox("time");

      var transcription = [];
      for(var i = 0,k=0; i < system.length; i++) {
        transcription[k] = user[i];
        k++;
        if( system.length ){
          transcription[k] = system[i];
          k++;
        }
      }
      transcription[k] = user[user.length-1];

      var len = transcription.length;

      //console.log(transcription);
      
      var responseNotes =  transcription[transcription.length-1],
          schedule = timing[timing.length-1];
      
      //console.log("number is" + number)
      
      //console.log("response is" + responseNotes);
      //console.log(schedule);
      
      var noteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2"];
      
      var findNote = function(note){
        return parseInt(
          noteMap.map( function (val, ind, arr) { if (val == note) { return ind;} else {return "";}} ).reduce (function (str1, str2) {return str1 + str2;})
        );
      }

      // gets a number relative to center octave and outputs the
      // note and the octave it is in
      var number2Note = function(freq){
        // 0 -11 octave 1, 11-22 octave 2
        var newTonic = freq - freq%12;  //new tonic
        var octave = newTonic/12;
        var note = noteMap[Math.abs(freq%12)] + "" + octave;
        return note;
      }
      
      //var inputNote = responseNotes[0];
      //var agentResponse = markovAgent(transcription,inputNote);
      //var response = eliza(transcription);
      var response = eliza(responseNotes, schedule)
      
      console.log("original schedule is" + schedule);
      schedule = response["schedule"];
      var agentResponse = response["pitch"];
      console.log("new schedule is" + schedule);
      
      document.getElementById("output").value += agentResponse.map(function(el){return number2Note(el);}).reduce(function(s1,s2) {return s1 + "," + s2;}) + ",|,"

      document.getElementById("combined").value = transcription.map(function(el){return el.join(",");}).reduce(function(str1,str2){
        return str1 + ",|," + str2;
      })
      
      document.getElementById("combined").value += ",|," + agentResponse.map(function(el){return number2Note(el);}).join(","); 
      
      //var agentResponse = caAgent(responseNotes);
      // response from Ca is howeveer, a string of notes.
      
      // agentResponse.map ( function(el,i,arr){
      //   if( el!=0 && !el ){
      //     //nothing
      //   }
      //   else{
      //       //el contains more than 1 element
      //     el.map(function(el2,ind,arr){
      //       if(!el2){
      //         // do nothing
      //       }
      //       else{
      //         var osc = basicOsc(ind);
      //         console.log("ele2" + ind + "schedule" + schedule[i] + " " + schedule[i+1]);
      //         setTimeout( function(){osc.play();}, schedule[i]);
      //         setTimeout(function(){console.log("closing");  osc.release();},schedule[i+1]);
      //       }
      //     });
      //   }
      // });
      
      agentResponse.map( function (el, i, arr){
        if( el!=0 && !el ){
          //nothing
        }
        else {
          //var noteNum = findNote(el);
          var osc = basicOsc(el);
          //console.log("ele" + el)
          setTimeout( function(){osc.play();}, schedule[i]);
          setTimeout(function(){osc.release();},schedule[i+1]);
        }
      });
    }
    
    /// ------------ Timers -------------------------------

    //current timer - or the now row
    var run = null;
    
  });
