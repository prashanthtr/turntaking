define(
  ["utils","sound-module"],

  function(utils,basicOsc){
    
    //.  x,y, - positions, side - of the square x,y, -
    //positions, side - of the square
    return function (parent, x,y, xLen, yLen){
      
      //create an svg rectangle
      var cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");

      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");

      text.setAttribute("x", x*xLen + xLen/2-15);
      
      // Set any attributes as desired
      cell.setAttribute("x", x*xLen);
      cell.setAttribute("width",  xLen);
      
      var white = [0,2,4,5,7,9,11,12];
      var black = [1,3,6,8,10];

      if( white.indexOf(x) != -1 ){
        cell.setAttribute("height",  yLen);
        cell.setAttribute("fill", "white");
        cell.colStr = "white";
        cell.setAttribute("y", y+20);
        text.setAttribute("y", y+40);
      
      }
      else{
        cell.setAttribute("height",  yLen);
        cell.setAttribute("fill", "black");
        cell.colStr = "black";
        cell.setAttribute("y", y-20);
        text.setAttribute("y", y);
      }
      
      var noteMap = ["C(s)", "C#(e)", "D(d)", "D#(r)", "E(f)", "F(g)", "F#(y)", "G(h)", "G#(u)", "A(j)", "A#(i)", "B(k)", "C2(l)"];

      text.textContent = noteMap[x];
      text.setAttribute("stroke", "red");

      cell.setAttribute("stroke-width", 1);
      cell.setAttribute("stroke", "black");

      // Add to a parent node; document.documentElement should be the root svg element.
      document.getElementById(parent).appendChild(cell);
      document.getElementById(parent).appendChild(text);

      cell.state = 0;

      //calculates the state of an object using internal relation
      //between ca cells
      cell.userChange = 0;
      cell.ind = x;
      
      cell.tone = basicOsc(x);
      
      //simply plays a note when the cell is on
      cell.play = function(){

        if(this.state == 1){
          this.tone.play();
        }
        else{
          this.tone.release();
        }
      }
      
      //object events, declared
      cell.changeColor = function(){
        
        //also includes user change perturbation color
        if(this.userChange == 1 && this.state == 1){
          this.setAttribute("fill", "grey");
        }
        else{
          this.setAttribute("fill", cell.colStr);
        }
      }
      
      cell.changeColor();
      
      cell.onclick = function(){
        this.state = (this.state + 1)%2;
        this.userChange = 1;
        this.changeColor(); 
      }
      
      cell.updateFn = function (){
        this.state = (this.state + 1)%2; //merely toggle
        this.changeColor(); 
        this.play();
      }
      
      return cell;
    }
    
  });
