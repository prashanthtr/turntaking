define(
  ["createCell"],
  function (createCell) {

    return function (id, colLength){
      
      //console.log(id)
      //getting the
      var canvas = document.getElementById(id);
      var rect = canvas.getBoundingClientRect();
      
      var pWidth = rect.width;
      var pHeight = rect.height;
      console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

      //scaling factor for rows and columns.
      var xLen = pWidth/colLength, yLen = 50;
      
      // //2d grid
      var grid = [];
      
      //simply populate the grid with the objects
      for(col=0; col< colLength; col++){
        console.log(xLen);
        grid[col] = new createCell(id, col, pHeight/2-yLen/2, xLen, yLen);
      }
      
      return grid;
    }

  });
