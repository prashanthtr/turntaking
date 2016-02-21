define(
  ["utils","sound-module"],

  function(utils,basicOsc){
    
    //.  x,y, - positions, side - of the square x,y, -
    //positions, side - of the square
    return function (parent, x,y, xLen, yLen){
      
      //create an svg rectangle
      var cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      // Set any attributes as desired
      cell.setAttribute("x", x*xLen);
      cell.setAttribute("y", y);
      cell.setAttribute("width",  xLen);
      cell.setAttribute("height",  yLen);
      
      cell.setAttribute("fill", "grey");
      cell.setAttribute("stroke-width", 1);
      cell.setAttribute("stroke", "black");

      // Add to a parent node; document.documentElement should be the root svg element.
      document.getElementById(parent).appendChild(cell);
      
      cell.state = 0;
      cell.colStr = "grey";
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
          this.setAttribute("fill", "black");
        }
        else{
          this.setAttribute("fill", "grey");
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
