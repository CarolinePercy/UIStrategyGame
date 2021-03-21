// Each time this function is called a GameObject
// is create based on the arguments
// In JavaScript you can consider everything an Object
// including functions

// All variables under here
var canvas = document.getElementById("game"); // canvas to draw to
var context = canvas.getContext("2d"); // Allows the file to draw to canvas
var cheerSound = document.getElementById("Cheers"); // sound that plays when NPC and Player intersect
var buttonSound = document.getElementById("ButtonSound"); // sound that plays when NPC and Player intersect
var selectBox = document.getElementById('equipment');

//canvas.addEventListener("click", tappingBoard, false);

function Box(x, y)
{
  this.x = x;
  this.y = y;
  this.width = 59;
  this.height = 18;
  this.rows = 8;
  this.col = 5;
  this.totalX = this.col * this.width;
  this.totalY = this.rows  * this.height;
}

var boxTypes =
[
  ["#32a852", "Grass"], // grass
  ["#3150b5", "Water"], // water
  ["#ba1a1a", "Attack"], // attack area
  ["#d67900", "Movement"], // movement area
  ["#472800", "Bridge"], // walkway over water
  ["#ffffff", "Empty"] // empty space
]

var box = new Box(0,0);

var startColours =
[
[boxTypes[1][0],boxTypes[1][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[1][0],boxTypes[1][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[4][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[1][0],boxTypes[4][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[0][0],boxTypes[0][0],boxTypes[0][0]]
];

let colours = [
[boxTypes[1][0],boxTypes[1][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[1][0],boxTypes[1][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[4][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[1][0],boxTypes[4][0],boxTypes[1][0],boxTypes[0][0],boxTypes[0][0]],
[boxTypes[0][0],boxTypes[0][0],boxTypes[0][0],boxTypes[0][0],boxTypes[0][0]]
];

// Methods/Classes after

// GameObject (both NPC and Player)
function Unit(img, x, y, health, range, attack, movement, name, width, height)
{
    this.img = new Image();
    this.img.src = img;

    this.name = name;

    this.x = x;
    this.y = y;

    this.health = health;
    this.range = range;
    this.attack = attack;
    this.movement = movement;

    this.width = width;
    this.height = height;
}

var selectedUnits =
[
  false,
  false,
  false
]
// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down)
function GamerInput(input)
{
    this.action = input;
}

var gamerInput = new GamerInput("None"); //No Input
// Default GamerInput is set to None

var xmlhttp = new XMLHttpRequest();

// Gameobjects is a collection of the Actors within the game
// these objects are placeholder, they get updated in the onPageLoad
var numOfUnits = 6;
var units =
[
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0),

  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0)
];

function onPageLoad()
{
  xmlhttp.open("GET", "./data/level.json", true);
  xmlhttp.send();

//  context.fillStyle = "rgb(0,0,0)";
  // Using JSON and Local Storage for
    // GameState Management
    //var playerXPos = parseInt(localStorage.getItem('xPos'));
    //var playerYPos = parseInt(localStorage.getItem('yPos'));

    xmlhttp.onreadystatechange = function ()
    {
      if (this.readyState == 4 && this.status == 200) // if response is ready and contents are "OK"
      {

        data = JSON.parse(this.responseText);

          U1Data = data.Unit1;
          U2Data = data.Unit2;
          U3Data = data.Unit3;
          E1Data = data.Enemy1;
          E2Data = data.Enemy2;
          E3Data = data.Enemy3;

          //if (isNaN(playerXPos) || isNaN(playerYPos) || (playerXPos == 0 && playerYPos == 0) )
          //{
          //  localStorage.setItem('xPos', parseInt(U1Data.position.x));
          //  localStorage.setItem('yPos', parseInt(U1Data.position.y));
          //  playerXPos = parseInt(localStorage.getItem('xPos'));
          //  playerYPos = parseInt(localStorage.getItem('yPos'))
          //}
          var h = 14;
          var w = 20;

          units[0] = new Unit(data.image, U1Data.position.x, U1Data.position.y,
          U1Data.health, U1Data.range, U1Data.attack, U1Data.movement, U1Data.name, w, h);

          units[1] = new Unit(data.image, U2Data.position.x, U2Data.position.y,
          U2Data.health, U2Data.range, U2Data.attack, U2Data.movement, U2Data.name, w, h);

          units[2] = new Unit(data.image, U3Data.position.x, U3Data.position.y,
          U3Data.health, U3Data.range, U3Data.attack, U3Data.movement, U3Data.name, w, h);

          units[3] = new Unit(data.image, E1Data.position.x, E1Data.position.y,
          E1Data.health, E1Data.range, E1Data.attack, E1Data.movement, E1Data.name, w, h);

          units[4] = new Unit(data.image, E2Data.position.x, E2Data.position.y,
          E2Data.health, E2Data.range, E2Data.attack, E2Data.movement, E2Data.name, w, h);

          units[5] = new Unit(data.image, E3Data.position.x, E3Data.position.y,
          E3Data.health, E3Data.range, E3Data.attack, E3Data.movement, E3Data.name, w, h);
      }
    };
}

function drawBoardOutline()
{
  context.beginPath();
  for (var x = 0; x <= box.totalX; x += box.width) {
        context.moveTo(0.5 + x, 0);
        context.lineTo(0.5 + x, box.totalY);
    }

    for (var x = 0; x <= box.totalY; x += box.height) {
        context.moveTo(0, 0.5 + x);
        context.lineTo(box.totalX, 0.5 + x);
    }
    context.strokeStyle = "black";
    context.closePath();
    context.stroke();
}

function drawBoardColour()
{
//  context.fillStyle = "rgb(200,0,0)";
  for (var x = 0, a = 0; x < box.totalX; x += box.width, a++)
    {
      for (var y = 0, b = 0; y < box.totalY; y += box.height, b++)
      {
          context.beginPath();
          context.fillStyle = colours[b][a];
          context.rect(x, y, box.width, box.height);
          context.fill();
          context.closePath();
      }
    }

}

function drawBoard()
{
  drawBoardColour();
  drawBoardOutline();
}

function getBoxCoordinates(e)
{
  var rect = canvas.getBoundingClientRect();

  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;

 var x = (e.clientX - rect.left) * scaleX;
 var y = (e.clientY - rect.top) * scaleY;

//console.log("x " + x);
 var boxX = 0;
 var boxY = 0;

 for (var a = 0, b = 0; a < box.col; a++, b += box.width)
 {
   if (x >= b && x <= b + box.width)
   {
     boxX = a;
     break;
   }
 }

 for (var a = 0, b = 0; a < box.rows; a++, b += box.height)
 {
   if (y >= b && y <= b + box.height)
   {
     boxY = a;
     break;
   }
 }
 return [boxX, boxY];
}

function resetColour(boxX, boxY, i)
{

  for (var x = -1; x < 2; x++)
  {
    for (var y = -1; y < 2; y++)
    {
      if (boxY + y < box.rows &&
        boxY + y >= 0 &&
        boxX + x >= 0 &&
        boxX + x < box.col &&
        colours[boxY + y][boxX + x] != boxTypes[1][0] &&
        Math.abs(x) + Math.abs(y) <= 1)
      {
        colours[boxY + y][boxX + x] = startColours[boxY + y][boxX + x];
      }
    }
  }

  for (var x = -2; x <= 2; x++)
  {
    for (var y = -2; y <= 2; y++)
    {
      if (boxY + y < box.rows &&
        boxY + y >= 0 &&
        boxX + x >= 0 &&
        boxX + x < box.col &&
        colours[boxY + y][boxX + x] != boxTypes[1][0] &&
        Math.abs(x) + Math.abs(y) == 2)
      {
        colours[boxY + y][boxX + x] = startColours[boxY + y][boxX + x];
      }
    }
  }
}

function attackUnit(boxX, boxY, i)
{
  var originalUnit;

  for (var b = 0; b < 3; b++)
  {
    if (selectedUnits[b])
    {
      originalUnit = b;
      break;
    }
  }

  for (var x = -1; x <= 1; x++)
  {
    for (var y = -1; y <= 1; y++)
    {
      if (boxY + y < box.rows &&
        boxY + y >= 0 &&
        boxX + x >= 0 &&
        boxX + x < box.col)
      {
        if (colours[boxY + y][boxX + x] == boxTypes[3][0]
        && Math.abs(x) + Math.abs(y) == 1)
        {
            moveUnit(originalUnit, boxX + x, boxY + y);
            units[i].health = 0;
            break;
        }
      }

    }
  }
}

function selectUnit(boxX, boxY, i)
{
  gamerInput = new GamerInput("Movement");

  colours[boxY][boxX] = boxTypes[3][0];

for (var x = -1; x < 2; x++)
{
  for (var y = -1; y < 2; y++)
  {
    if (boxY + y < box.rows &&
      boxY + y >= 0 &&
      boxX + x >= 0 &&
      boxX + x < box.col &&
      colours[boxY + y][boxX + x] != boxTypes[1][0] &&
      Math.abs(x) + Math.abs(y) <= 1)
    {
      colours[boxY + y][boxX + x] = boxTypes[3][0];
    }
  }
}

for (var x = -2; x <= 2; x++)
{
  for (var y = -2; y <= 2; y++)
  {
    if (boxY + y < box.rows &&
      boxY + y >= 0 &&
      boxX + x >= 0 &&
      boxX + x < box.col &&
      colours[boxY + y][boxX + x] != boxTypes[1][0] &&
      Math.abs(x) + Math.abs(y) == 2)
    {
      var valid = false;
      if (Math.abs(x) >= 1)
      {
        if (x < 1 && colours[boxY][boxX - 1] != boxTypes[1][0])
        {
          valid = true;
        }

        else if (x >= 1 && colours[boxY][boxX + 1] != boxTypes[1][0])
        {
          valid = true;
        }
      }

      if (Math.abs(y) >= 1)
      {
        if (y < 1 && colours[boxY - 1][boxX] != boxTypes[1][0])
        {
          valid = true;
        }

        else if (y >= 1 && colours[boxY + 1][boxX] != boxTypes[1][0])
        {
          valid = true;
        }
      }

      if (valid)
      {
            colours[boxY + y][boxX + x] = boxTypes[2][0];
      }
    }
  }
}

}

function moveUnit(i, boxX, boxY)
{
  console.log("Unit: " + i);
    resetSelection();

  units[i].x = boxX;
  units[i].y = boxY;

  //gamerInput.action = "None";
}

function resetSelection()
{
  for (var i = 0; i < 3; i++)
  {
    selectedUnits[i] = false;
    resetColour(units[i].x, units[i].y, i);
  }

      gamerInput = new GamerInput("None");
}
// Process keyboard input event
function tappingBoard(e)
{
  var mouseCoords = getBoxCoordinates(e);
  var boxX = mouseCoords[0];
  var boxY = mouseCoords[1];
  var unitInside = -1;

 for (var a = 0; a < 3; a++)
 {
   if (boxX == units[a].x && boxY == units[a].y && units[a].health > 0)
   {
       unitInside = a;
       selectedUnits[a] = !selectedUnits[a];

     for (var i = 0; i < 3; i++)
     {
       if (i == a)
       {
         i++;
       }
         selectedUnits[i] = false;
         resetColour(units[i].x, units[i].y, i);

     }
     break;
   }
 }

 for (var a = 3; a < numOfUnits; a++)
 {
   if (boxX == units[a].x && boxY == units[a].y && units[a].health > 0)
   {
     if (gamerInput.action === "Movement" && (colours[boxY][boxX] == boxTypes[2][0] ||
   colours[boxY][boxX] == boxTypes[3][0]) && a >= 3)
     {
       attackUnit(boxX, boxY, a);
     }

     for (var i = 0; i < 3; i++)
     {
       if (i == a)
       {
         i++;
       }
         selectedUnits[i] = false;
         resetColour(units[i].x, units[i].y, i);

     }
          break;
   }
   }

 if (unitInside != -1 && gamerInput.action === "None")
 {
   console.log("Unit select test");
    if (selectedUnits[unitInside])
    {
      selectUnit(boxX, boxY, unitInside);
    }

    else
     {
       gamerInput = new GamerInput("None");
       resetColour(boxX, boxY, unitInside);
      }
 }

else
  {
    var moved = false;
    console.log("Move test: " + gamerInput.action);
    if (gamerInput.action === "Movement")
    {
      for (var i = 0; i < 3; i++)
      {
        if (selectedUnits[i] &&
          colours[boxY][boxX] === boxTypes[3][0])
        {
          moveUnit(i, boxX, boxY);
          var moved = true;
        }

      }

      if (!moved)
      {
        resetSelection();
      }
    }

    else
    {
      resetSelection();
    }

 }
}

function update()
{
      if (gamerInput.action === "Left") // if user is pressing left, move player that way and flip image
      {
        units[0].x -= 1;
        facingRight[0] = false;
      }

      if (gamerInput.action === "Right") // else if user is pressing right, move right and make image back to how it originally was
      {
        units[0].x += 1;
        facingRight[0] = true;
      }

      if (gamerInput.action === "Up")
      {
        units[0].y -= 1;
      }

      if (gamerInput.action === "Down")
      {
        units[0].y += 1;
      }
}

// Draw GameObjects to Console
// Modify to Draw to Screen
function draw()
{
    animate(); // draws both objects to canvas
}

function animate()
{
  current = new Date().getTime(); // update current
  context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas of previous frame

  drawBoard();
  for (var i = 0; i < numOfUnits; i++)
  {
    if (units[i].health > 0)
    {
      context.drawImage(units[i].img, (units[i].x * box.width) + ((box.width / 2.0) - (units[i].width / 2.0)),
      (units[i].y * box.height) + ((box.height / 2.0) - (units[i].height / 2.0)), units[i].width,units[i].height);
    }
  }
}

function updatePlayerStorage()
{
  localStorage.setItem('Unit1xPos', parseInt(units[0].x));
  localStorage.setItem('Unit1yPos', parseInt(units[0].y));

  localStorage.setItem('Unit2xPos', parseInt(units[1].x));
  localStorage.setItem('Unit2yPos', parseInt(units[1].y));

  localStorage.setItem('Unit3xPos', parseInt(units[2].x));
  localStorage.setItem('Unit3yPos', parseInt(units[2].y));

  localStorage.setItem('Enemy1xPos', parseInt(units[3].x));
  localStorage.setItem('Enemy1xPos', parseInt(units[3].y));

  localStorage.setItem('Enemy2xPos', parseInt(units[4].x));
  localStorage.setItem('Enemy2xPos', parseInt(units[4].y));

  localStorage.setItem('Enemy3xPos', parseInt(units[5].x));
  localStorage.setItem('Enemy3xPos', parseInt(units[5].y));

  //console.log(localStorage.getItem('xPos'));
}

// Gameloop that is forever gone through until program closes
function gameloop()
{
    update();
    draw();
    window.requestAnimationFrame(gameloop);
}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);
// Handle Keypressed
//button.addEventListener("onclick", tappingBoard);
