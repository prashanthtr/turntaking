require(
  ["squareGrid","utils","sound-module","caAgent","markovAgent","analogy","3partEliza"],
  function (squareGrid,utils,basicOsc,caAgent,markovAgent,analogy,eliza) {

    // --------------- Inits ------------------------------
    
    //bittorio display on which display happens
    var bittorio = [];
    var timer = -1;
    var prevTime = -1;
    var context = new AudioContext();
    var osc, gain;
    soundSetup(context);
    
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
        document.getElementById("time").value += "," + (context.currentTime-timer) + ",|,"; //extra space
        timer = -1;
        prevTime = context.currentTime;
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

        // switch off the old note, switch on the new note, and play
        // the new frequency.
        
        var str = document.getElementById("transcription").value;
        str = str.split(",");
        var oldInd = str[str.length-1];
        //console.log("old ind is" + oldInd)

        //Switch of the playing note,
        //first time, so oldInd is empty.
        if ( oldInd == ""){
        }
        else{
          //switch off the playing note.
          bittorio[findNote(oldInd)].updateFn(); 
        }
        
        // turn on the playing note
        var index = findKey(code);
        bittorio[index].userChange = 1;
        bittorio[index].updateFn();

        //trigger sound based on current note number in octave
        triggerSound( context, index, context.currentTime);
        
        if (oldInd == ""){
          document.getElementById("transcription").value += noteMap[index];
        }
        else if (oldInd == "|"){
          
        }
        else if( bittorio[index].state == 1 ){
          document.getElementById("transcription").value += "," + noteMap[index];
        }
        
        if (timer == -1){
          timer = context.currentTime;
          document.getElementById("time").value += 0;
        }
        else{
          if(bittorio[index].state == 1){
            document.getElementById("time").value += "," + (context.currentTime - timer);
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

    document.getElementById('start').onclick = function(){
      startSound(0);
    }

    
    document.getElementById('stop').onclick = function(){
      stopSound(0);
    }
    
    // --------- system response ------------------
    // system reads from the transcription and randomly plays the last
    // few notes from the transcription
    
    function playResponse (){

      //console.log("entering")
      //generates a response


      //get the transcription from textbox into array
      
      var user = utils.parseTextBox("transcription");
      var system = utils.parseTextBox("output");
      var timing = utils.parseTextBox("time");
      var transcription = [];

      //make sure last element of transcription contains what the
      //user played?
      for(var i = 0,k=0; i < system.length; i++) {
        transcription[k] = user[i];
        k++;
        if( system.length ){
          transcription[k] = system[i];
          k++;
        }
      }
      transcription[k] = user[user.length-1];

      // input to the agent
      var responseNotes =  transcription[transcription.length-1],
          schedule = timing[timing.length-1];
      
      //var inputNote = responseNotes[0];
      //var agentResponse = markovAgent(transcription,inputNote);
      //var response = eliza(transcription);

      //agent response
      var response = eliza(responseNotes, schedule)
      
      console.log("original schedule is" + schedule);
      schedule = response["schedule"];
      var agentResponse = response["pitch"];
      //console.log("new schedule is" + schedule);


      // agents output
      document.getElementById("output").value += agentResponse.map(function(el){return utils.number2Note(el);}).reduce(function(s1,s2) {return s1 + "," + s2;}) + ",|,"

      
      //recreate the whole transcription from array. why?
      document.getElementById("combined").value = transcription.map(function(el){return el.join(",");}).reduce(function(str1,str2){
        return str1 + ",|," + str2;
      })

      // add the agent's returned value on the combined output
      document.getElementById("combined").value += ",|," + agentResponse.map(function(el){return utils.number2Note(el);}).join(","); 

      // scheduleing time
      console.log("schedule time is" + prevTime)
      
      // acts a trigger for the notes
      agentResponse.map( function (el, i, arr){
        if( el!=0 && !el ){
          //nothing
        }
        //schedule notes by adding them to the time of the last played
        //note
        // else if( i == arr.length){
        //   triggerSound( context, el, prevTime + schedule[i]);
        //   stopSound( schedule[i]+ 0.5);
        // }

        //schedule notes by triggering frequencies at time of the last
        //played note
        else {
          //console.log("triggering at" + prevTime + schedule[i]);
          triggerSound( context, el, prevTime + schedule[i]);
          //var noteNum = findNote(el);
          // var osc = basicOsc(el);
          // //console.log("ele" + el)
          // setTimeout( function(){osc.play();}, schedule[i]);
          // setTimeout(function(){osc.release();},schedule[i+1]);
        }
        console.log("note" + el + " scheduled at" + (prevTime + schedule[i]))
      });
    }
    
    //-------triggering the sounds within audio context -----//

    //trigger sound sets the frequency of the sounding oscillator at
    //given time,
    function triggerSound (context,noteNum, startTime){
      
      console.log("triggering sound" + noteNum);
      //var now = context.currentTime;
      var frequency = 220*Math.pow(2, noteNum/12);
      osc.frequency.setValueAtTime(frequency, startTime);
      //gain.gain.setValue(0.1);
    }

    // sets up the oscillator and gain for playing sounds.
    function soundSetup(context){
      
      osc = context.createOscillator();
      gain = context.createGain();
      osc.frequency.value = 220*Math.pow(2, 0/12); //initial freq
      osc.connect(gain);
      gain.connect(context.destination);
      //osc.start(0);
      
    }

    function startSound(startTime){
      osc.start(startTime);
    }
    
    // stops the sound at a given time.
    function stopSound (endTime){
      gain.gain.setValueAtTime(0.001, endTime) ; //make gain 0
    } 
    /// ------------ Timers -------------------------------

    //current timer - or the now row
    var run = null;
    
  });
