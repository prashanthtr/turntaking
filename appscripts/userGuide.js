define(
    [],
  function(){

    return function(){
            document.getElementById('userGuide').innerHTML = "<p> The following text provides instructions to play along with the a
  turn taking system whose goal is provide reflexive
  interactions. </p>";
      
      document.getElementById('userGuide').innerHTML += "<h2> Key mapping </h2> Use the following key mapping to the input a
 sequence of notes. The notes are toggled on or off to indicate the
 sequence you have. Black notes are on and grey notes are off. <ol>
 <li>a - C</li> <li>s - C#</li> <li>d- D</li> <li>f- D#</li> <li>\g-
 E</li> <li>h - F</li> <li>j - F#</li> <li>k - G</li> <li>l - G#</li>
 <li>; - A</li> <li>' - A#</li> <li>Enter - B</li> </ol> <br> <h3> R - reset cells, C - clear transcription </h3>";

      document.getElementById('userGuide').innerHTML += "<h2> User interaction </h2> Input a certain user interaction and press
 to generate a sequence that is related to the input. Try to continue
 the interaction as continuously as possible";

    }
    
  });
