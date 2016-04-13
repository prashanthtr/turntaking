
//experimental settings

var a = 1;  // linear decrease for user
var alpha = -0.5; // combined decrease x - user
var b = -1;  // linear decrease for system 
var beta = 1; // combined decrease for agent

var ac = new AudioContext();
var agent = objSetup(0,a,alpha);
var user = objSetup(410,b,beta);


agent.setAttribute("fill", "black");
user.setAttribute("fill", "red");


//goal: the chances of the human playing increases
// x -> ax - bxy, x-> agent  
// y -> -cy + dxy, y -> user

var speed = 20; // in milliseconds.
var stopper; // clears timeouts.

//3. LAUNCH
function launch( ) {
  // calculate trajectories.
  var agentX = agent.xPos, userX = user.xPos;
  console.log("running");
  console.log(agent.xPos);
  console.log(user.xPos);
  agent.trajectory(userX);
  user.trajectory(agentX);
  agent.update();
  user.update();
}

// create two svg objects that move around on screen
function objSetup(x,coeff1,coeff2){ 

  var cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  cell.xPos = x;
  cell.setAttribute("x", x);
  cell.setAttribute("width",  10);
  cell.setAttribute("height",  10);

  //cell to sound mappings
  cell.osc = ac.createOscillator();
  cell.gain = ac.createGain();
  cell.osc.connect (cell.gain);
  cell.gain.connect(ac.destination);
  
  cell.update = function(){
    var randNo = Math.floor( 0.5 + 12*Math.random());
    cell.osc.frequency.value = 220*Math.pow(2,randNo/12) 
    // volume based on 
    cell.gain.value = cell.x/1000;
  }
  
  //model 
  cell.coeff1 = coeff1; // linear decrease 
  cell.coeff2 = coeff2; //decrease due to interaction

  //cells trajectory is dependent on its x,coeff1,coeff2, and user's X. 
  cell.trajectory = function(otherX){
    var newPos =  coeff1*(cell.xPos/300) + coeff2*(otherX/300);
    cell.xPos = cell.xPos + newPos;
    cell.setAttribute("x", cell.xPos);
  }
  document.getElementById("bittorio").appendChild(cell);
  return cell;
}


//events

document.getElementById('start').onclick = function(){
  if(stopper == null){
    agent.osc.start(0)
    user.osc.start(0)
    stopper = setInterval( launch, speed );
  }
}

document.getElementById('stop').addEventListener("click", function(){
  if(stopper != null){
    clearInterval(stopper);
    agent.osc.stop(0)
    user.osc.stop(0)
    stopper = null;
  }
});




