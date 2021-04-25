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
var elementCloseUp = document.getElementById('closeUp');
var dropDownWindow = document.getElementById("dropBox");

function Box(x, y)
{
  this.x = x;
  this.y = y;
  this.width = 60;
  this.height = 60;
  this.rows = 8;
  this.col = 5;
  this.totalX = this.col * this.width;
  this.totalY = this.rows  * this.height;
}

var unitsTurnDone =
[
  false,
  false,
  false
]

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


// GameObject (both NPC and Player)
function Unit(img, x, y, health, range, attack, movement, name, width, height, element)
{
    this.img = new Image();
    this.img.src = img;

    this.icon = new Image();
    this.icon.src = "./img/icons/ElementIcons/Icon_Element_" + element + ".png";

    this.name = name;

    this.x = x;
    this.y = y;

    this.destinationX = x;
    this.destinationY = y;

    this.health = health;
    this.maxHealth = health;
    this.range = range;
    this.attack = attack;
    this.movement = movement;

    this.width = width;
    this.height = height;

    this.element = element;
}

var elementImages;

var selectedUnits =
[
  false,
  false,
  false,
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

function GameState(input) // Keeps track of players vs enemy turn, win and lose screens
{
  this.screen = input;
}

var gamerInput = new GamerInput("None"); //No Input
var gameStates =
[
  new GameState("Start"),
  new GameState("Start")
];
// Default GamerInput is set to None

var xmlhttp = new XMLHttpRequest();

// Gameobjects is a collection of the Actors within the game
// these objects are placeholder, they get updated in the onPageLoad
var numOfUnits = 6;
var units =
[
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0, "Fire"),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0, "Fire"),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0, "Fire"),

  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0, "Fire"),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0, "Fire"),
  new Unit("./favicon.ico", 0,0,0,0,0,0, "",0,0, "Fire")
];

var localStorageNames = [
  'unit1xPos',
  'unit1yPos',
  'unit1Health',

  'unit2xPos',
  'unit2yPos',
  'unit2Health',

  'unit3xPos',
  'unit3yPos',
  'unit3Health',

  'enemy1xPos',
  'enemy1yPos',
  'enemy1Health',

  'enemy2xPos',
  'enemy2yPos',
  'enemy2Health',

  'enemy3xPos',
  'enemy3yPos',
  'enemy3Health'
];

var localStorageValues = [];

function onPageLoad()
{
  document.getElementById("gameplay").style.visibility = "hidden";
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

          var h = 40;
          var w = 40;

          for (var i = 0; i < localStorageNames.length; i++)
          {
            localStorageValues.push(parseInt(localStorage.getItem(localStorageNames[i])));
          }

          var unitsValues = [
            data.units.Unit1,
            data.units.Unit2,
            data.units.Unit3,
            data.units.Enemy1,
            data.units.Enemy2,
            data.units.Enemy3
          ];

            for (var i = 0, j = 0; i < numOfUnits; i++, j += 3)
            {
              if (isNaN(localStorageValues[j]) || isNaN(localStorageValues[j + 1]) || isNaN(localStorageValues[j + 2]) ||
              (localStorageValues[j] == 0 && localStorageValues[j + 1] == 0 && localStorageValues[j + 2] == 0))
              {
                localStorage.setItem(localStorageNames[j], parseInt(units[i].x));
                localStorage.setItem(localStorageNames[j + 1], parseInt(units[i].y));
                localStorage.setItem(localStorageNames[j + 2], parseInt(units[i].health));

                localStorageValues[j] = parseInt(localStorage.getItem(localStorageNames[j]));
                localStorageValues[j + 1] = parseInt(localStorage.getItem(localStorageNames[j + 1]));
                localStorageValues[j + 2] = parseInt(localStorage.getItem(localStorageNames[j + 2]));
              }

              units[i] = new Unit(data.units.image, localStorageValues[j], localStorageValues[j + 1],
              localStorageValues[j + 2], unitsValues[i].range, unitsValues[i].attack, unitsValues[i].movement,
              unitsValues[i].name, w, h, unitsValues[i].element);
            }

          //  for (var i = 0; i < 3; i++)
          //  {
          //    units[i].health = 0;
          //  }


          elementImages =
          [
            data.elements.CloseUp.wind,
            data.elements.CloseUp.fire,
            data.elements.CloseUp.ice
          ]
          elementCloseUp.src = elementImages[0];

          displayWindowSize();


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
            attackDamageCalc(originalUnit, i);
            break;
        }
      }

    }
  }

  resetSelection();
}

function attackDamageCalc(attacker, target)
{
  switch (units[attacker].element) {
    case "Fire":
    if (units[target].element == "Fire")
    {
      attack(attacker, target, 0);
    }

    else if (units[target].element == "Ice")
    {
      attack(attacker, target, 1);
    }

    else if (units[target].element == "Wind")
    {
      attack(attacker, target, -1);
    }

    else
      {
        console.log("Not reading targets element!");
      }
    break;

    case "Ice":
    if (units[target].element == "Fire")
    {
      attack(attacker, target, -1);
    }

    else if (units[target].element == "Ice")
    {
      attack(attacker, target, 0);
    }

    else if (units[target].element == "Wind")
    {
      attack(attacker, target, 1);
    }

    else
      {
        console.log("Not reading targets element!");
      }

    break;

    case "Wind":
    if (units[target].element == "Fire")
    {
      attack(attacker, target, 1);
    }

    else if (units[target].element == "Ice")
    {
      attack(attacker, target, -1);
    }

    else if (units[target].element == "Wind")
    {
      attack(attacker, target, 0);
    }

    else
      {
        console.log("Not reading targets element!");
      }
      break;
    default:
    console.log("Error! Unknown Element! " + units[attacker].element);
    break;

  }
}

function attack(attacker, target, modifier)
{
  var damage = 0;

  damage = units[attacker].attack + modifier;
  units[target].health -= damage;
}

function selectAUnit(boxX, boxY, unitInside)
{
  if (unitInside >= 3)
  {
     selectedEnemy(boxX, boxY, unitInside);
  }

  else if (selectedUnits[unitInside])
 {
     resetSelection();
     selectedUnits[unitInside] = true;
     selectOwnUnit(boxX, boxY, unitInside);
 }

 else
  {
    selectedUnits[unitInside] = false;
    resetColour(boxX, boxY, unitInside);
    gamerInput = new GamerInput("None");
  }
}

function letOwnUnitMove(boxX, boxY, i)
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

function selectOwnUnit(boxX, boxY, i)
 {
   colours[boxY][boxX] = boxTypes[3][0];

   if (!unitsTurnDone[i])
   {
     letOwnUnitMove(boxX, boxY, i);
     gamerInput = new GamerInput("Movement");
   }
 }

function checkWhetherToMoveUnit(boxX, boxY, unitInside)
{
  if (gamerInput.action === "Movement")
  {
    for (var i = 0; i < 3; i++)
    {
      if (selectedUnits[i] &&
        colours[boxY][boxX] === boxTypes[3][0])
      {
        moveUnit(i, boxX, boxY);
        resetSelection();
      }

    }
  }

  resetSelection();
}

function moveUnit(i, boxX, boxY)
{
  resetSelection();
  units[i].destinationX = boxX;
  units[i].destinationY = boxY;
  unitsTurnDone[i] = true;
  //gamerInput.action = "None";
}

function resetSelection()
{
  for (var i = 0; i < numOfUnits; i++)
  {
    selectedUnits[i] = false;
    resetColour(units[i].x, units[i].y, i);
  }

      gamerInput = new GamerInput("None");
}

function findUnitInBox(boxX, boxY, unitInside)
{
  for (var a = 0; a < numOfUnits; a++)
  {
    if (boxX == units[a].x && boxY == units[a].y && units[a].health > 0)
    {
        unitInside = a;
        selectedUnits[a] = !selectedUnits[a];

      for (var i = 0; i < numOfUnits; i++)
      {
        if (i == a)
        {
          i++;
        }
      }
      break;
    }
  }

  return unitInside;
}

function selectedEnemy(boxX, boxY, unitInside)
{
  if (gamerInput.action === "Movement" && (colours[boxY][boxX] === boxTypes[2][0] ||
   colours[boxY][boxX] === boxTypes[3][0]))
   {
    attackUnit(boxX, boxY, unitInside);
    }

  else if (selectedUnits[unitInside])
    {
    resetSelection();
    selectedUnits[unitInside] = true;
    colours[boxY][boxX] = boxTypes[2][0];
    }

  else
    {
        resetColour(boxX, boxY, unitInside);
    }
}

// Process keyboard input event
function tappingBoard(e)
{
  if (gameStates[1].screen === "Player")
  {
    var mouseCoords = getBoxCoordinates(e);
    var boxX = mouseCoords[0];
    var boxY = mouseCoords[1];
    var unitInside = findUnitInBox(boxX, boxY, -1);

  if (unitInside != -1  && units[unitInside].health > 0)
  {
    selectAUnit(boxX, boxY, unitInside);
  }

  else
    {
      checkWhetherToMoveUnit(boxX, boxY, unitInside);
    }
  }
}

function unitDetails()
{
  dropDownWindow.style.visibility = "hidden";

  for (var a = 0; a < numOfUnits; a++)
  {
    if (selectedUnits[a])
    {
        var healthPercent = 0;

        healthPercent = (units[a].health / units[a].maxHealth) * 96;
        dropDownWindow.style.visibility = "visible";

        document.getElementById("unit-name").innerHTML = units[a].name;
        document.getElementById("unit-range").innerHTML = "Range: " + units[a].range;
        document.getElementById("unit-movement").innerHTML = "Speed: " + units[a].movement;
        document.getElementById("unit-attack").innerHTML = "Attack: " + units[a].attack;
        document.getElementById("healthNumbers").innerHTML = units[a].health + "/" + units[a].maxHealth;
        document.getElementById("unit-health").style.width = healthPercent.toString() + "%";
        ;

      switch (units[a].element) {
        case "Fire":
          elementCloseUp.src = elementImages[1];
          break;

          case "Ice":
          elementCloseUp.src = elementImages[2];
          break;

          case "Wind":
          elementCloseUp.src = elementImages[0];
          break;
        default:
        break;
      }
    }
  }
}

function animateUnitMovement()
{
  //console.log(units[0].x + ", " + units[0].destinationX);
  //console.log(units[0].y + ", " + units[0].destinationY);
  for (var a = 0; a < numOfUnits; a++)
  {
      if (units[a].x > units[a].destinationX + 0.05)
      {
        units[a].x -= 0.05;
      }

      else if (units[a].x < units[a].destinationX - 0.05)
      {
        units[a].x += 0.05;
      }

      else {
        units[a].x = units[a].destinationX;
      }

      if (units[a].y > units[a].destinationY + 0.05)
      {
        units[a].y -= 0.05;
      }

      else if (units[a].y < units[a].destinationY - 0.05)
      {
        units[a].y += 0.05;
      }

      else
      {
        units[a].y = units[a].destinationY;
      }

  }
}

function playerTurnManagement()
{
  if (gameStates[0].screen != "Player")
  {
    gameStates[0] = new GameState("Player");
    const buttons = document.querySelectorAll('button');

    for (var i = 0; i < buttons.length; i++)
    {
      buttons[i].disabled = false;
    }

    for (var i = 0; i < 3; i++)
    {
      if (units[i].health > 0)
      {
        unitsTurnDone[i] = false;
      }
    }
  }

  else
  {
    var playersTurnDone = true;
    for (var i = 0; i < 3; i++)
    {
      if (!unitsTurnDone[i])
      {
        playersTurnDone = false;
        break;
      }
    }

   if (playersTurnDone)
     {
     gameStates[1] = new GameState("Enemy");
     }
   }
  }

function enemyTurnManagement()
{
  var startTurn = true;
  if (gameStates[0].screen != "Enemy")
  {
    gameStates[0] = new GameState("Enemy");
    const buttons = document.querySelectorAll('button');

    for (var i = 0; i < buttons.length; i++)
    {
      buttons[i].disabled = true;
    }

    for (var i = 3; i < numOfUnits; i++)
    {
      if (units[i].health > 0)
      {
        unitsTurnDone[i - 3] = false;
      }
    }
  }

for (var j = 0; j < 3; j++)
{
  if (units[j].y != units[j].destinationY ||
  units[j].x != units[j].destinationX)
  {
    startTurn = false;
    break;
  }
}

  if (startTurn)
  {
    for (var i = 3; i < numOfUnits; i++)
    {
      if (units[i].health > 0)
      {
          enemyDistanceCalculation(i);
          unitsTurnDone[i - 3] = true;
      }
    }

     gameStates[1] = new GameState("Player");

  }
}

function turnManagement()
{
  switch (gameStates[1].screen)
  {
    case "Player":
    playerTurnManagement();
    break;

    case "Enemy":
    enemyTurnManagement();
    break;

    default:
    console.log("Error: The Turn tracker is null!");
    break;
  }
}

function enemyCalcClosestWorkAround(i, onYAxis, walkAroundDistance, walkAroundIndex, target)
{
  var addon = 0;
    var closest = 0;

  for (var a = 0; a < walkAroundDistance.length; a++)
  {
    if (walkAroundDistance[walkAroundIndex[a]] < walkAroundDistance[closest])
    {
      closest = a;
    }
  }

  if (onYAxis)
  {

    if (closest > units[i].x && colours[units[i].y][closest] != boxTypes[1][0])
    {
      addon = 1;
    }

    else
    {
      addon = -1;
    }
    units[i].destinationX = units[i].x + addon;
  }

  else
   {

     if (closest > units[i].y && colours[closest][units[i].x] != boxTypes[1][0])
     {
       addon = 1;
     }

     else
     {
       addon = -1;
     }

    units[i].destinationY = units[i].y + addon;
  }
}

function enemyWorkAround(i, addon, onYAxis, target)
{
  var walkAroundIndex = [];
  var walkAroundDistance = [];

  if (onYAxis)
  {
    for (var k = 0; k < box.col; k++)
    {
        if (colours[units[i].y + addon][k] != boxTypes[1][0])
        {
            walkAroundIndex.push(k);
            walkAroundDistance.push(Math.abs(units[target].x - k));
        }
    }
  }

  else
    {
      for (var k = 0; k < box.rows; k++)
      {
          if (colours[k][units[i].x + addon] != boxTypes[1][0])
          {
            walkAroundIndex.push(k);
            walkAroundDistance.push(Math.abs(units[target].y - k));
          }
      }

    }

    enemyCalcClosestWorkAround(i, onYAxis, walkAroundDistance, walkAroundIndex, target);
}

function collidingWithAnotherEnemy(addonX, addonY, index)
{
  var collided = false;

  for (var i = 3; i < numOfUnits; i++)
  {
    if (i == index)
    {
      continue;
    }

    else if (units[index].y + addonY == units[i].destinationY &&
      units[index].x + addonX == units[i].destinationX)
    {
      collided = true;
      break;
    }
  }

  return collided;
}

function enemyMoveLeft(i, j)
{
  if(colours[units[i].y][units[i].x - 1] != boxTypes[1][0] &&
    !collidingWithAnotherEnemy(-1, 0, i))
  {
    units[i].destinationX = units[i].x - 1;
  }

  else
  {
    enemyWorkAround(i, -1, false, j);

  }
}

function enemyMoveRight(i, j)
{
  if (colours[units[i].y][units[i].x + 1] != boxTypes[1][0] &&
    !collidingWithAnotherEnemy(1, 0, i))
  {
      units[i].destinationX = units[i].y + 1;
  }

  else {
    enemyWorkAround(i, 1, false, j);
  }

}

function enemyMoveUp(i, j)
{
  if (colours[units[i].y - 1][units[i].x] != boxTypes[1][0]
  && !collidingWithAnotherEnemy(0, -1, i))
  {

  units[i].destinationY = units[i].y - 1;
  }

  else
    {
        enemyWorkAround(i, -1, true, j);
    }
}

function enemyMoveDown(i, j)
{
  if (colours[units[i].y + 1][units[i].x] != boxTypes[1][0] &&
    !collidingWithAnotherEnemy(0, 1, i))
  {
        units[i].destinationY = units[i].y + 1;
  }

  else
    {
      enemyWorkAround(i, 1, true, j);
    }
}

function enemyDistanceCalculation(i)
{

  if (units[i].x == units[i].destinationX && units[i].y == units[i].destinationY && !unitsTurnDone[i - 3])
  {
    var closest = 0;
    var distances = [0,0,0];

    for (var j = 0; j < 3; j++)
    {
      if (units[j].health > 0)
      {
        closest = j;
        break;
      }
    }

    for (var j = 0; j < 3; j++)
    {
      distances[j] = Math.abs(units[i].x - units[j].x) + Math.abs(units[i].y - units[j].y);

      if (distances[closest] > distances[j] && units[j].health > 0)
      {
        closest = j;
      }
    }

if (distances[closest] > 1)
{
    if (units[closest].y > units[i].y)
    {
       enemyMoveDown(i, closest);
    }

    else if (units[closest].y < units[i].y)
    {
      enemyMoveUp(i, closest);
    }

    else if (units[closest].x > units[i].x)
    {
        enemyMoveRight(i, closest);
    }

    else if (units[closest].x < units[i].x)
    {
      enemyMoveLeft(i, closest);
    }
  }

  else
    {
      enemyAttack(closest,i);
    }
  }
}

function enemyAttack(closest,i)
{
  attackDamageCalc(i, closest);

}

function EndTurn()
{
  for (var i = 0; i < 3; i++)
  {
    unitsTurnDone[i] = true;
  }

  resetSelection();
}

function update()
{
  if (gameStates[1].screen === "Player" ||
      gameStates[1].screen === "Enemy")
  {
    turnManagement();
    unitDetails();
    animateUnitMovement();
    gameOverCheck();
  }

  updatePlayerStorage();
}

function updatePlayerStorage()
{
  for (var i = 0, j = 0; i < numOfUnits; i++, j += 3)
  {
      localStorage.setItem(localStorageNames[j], parseInt(units[i].x));
      localStorage.setItem(localStorageNames[j + 1], parseInt(units[i].y));
      localStorage.setItem(localStorageNames[j + 2], parseInt(units[i].health));
  }
}

function gameOverCheck()
{
  var gameIsFinished = true;

  for (var i = 0; i < 3; i++)
  {
    if (units[i].health > 0)
    {
      gameIsFinished = false;
      break;
    }
  }

  if (gameIsFinished)
  {
    roundEnd();
    playerLost();
  }

 gameIsFinished = true;

  for (var i = 3; i < numOfUnits; i++)
  {
    if (units[i].health > 0)
    {
      gameIsFinished = false;
      break;
    }
  }

  if (gameIsFinished)
  {
    roundEnd();
    playerWon();
  }
}

function switchToGameplay()
{
  gameStates[1] = new GameState("Player");
  document.getElementById("form").style.visibility = "hidden";
  document.getElementById("gameplay").style.visibility = "visible";

  var unitNames =
  [
   document.getElementById("unit1Name").value,
   document.getElementById("unit2Name").value,
   document.getElementById("unit3Name").value
 ];

  for (var i = 0; i < 3; i++)
  {
    if (unitNames[i].length > 0)
    {
      units[i].name = unitNames[i];
    }
  }
}

function displayWindowSize()
{

   canvas.width  = window.innerHeight / 2.0;
   canvas.height = (window.innerHeight / 10.0) * 7.0;

   if (canvas.width > window.outerWidth)
   {
     canvas.width  = window.outerWidth;
     canvas.height = (window.outerWidth / 5.0) * 7.0;
   }

   box.width = canvas.width / 5;
   box.height = canvas.height / 8;

   box.totalX = canvas.width;
   box.totalY = canvas.height;

   for (var i = 0; i < numOfUnits; i++)
   {
     units[i].width = box.width / 3;
     units[i].height = box.height / 1.5;
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
      context.drawImage(units[i].icon, (units[i].x * box.width) + ((box.width / 1.5)),
      (units[i].y * box.height) + ((box.height / 2.0) + (units[i].height / 5.0)), units[i].height/2.0, units[i].height/2.0);

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
}

// Gameloop that is forever gone through until program closes
function gameloop()
{
    update();
    draw();
    window.requestAnimationFrame(gameloop);
}

function playerLost()
{
  document.body.style.backgroundColor = "darkslategray";
  var lostText = document.getElementById("announcementText");

  var message = "Game Over";
  message = message.bold();

  lostText.style.color = "tomato";
  lostText.innerHTML = message;
  document.getElementById("endButtons").disabled = false;
}

function playerWon()
{
  document.body.style.backgroundColor = "forestgreen";

  var wonText = document.getElementById("announcementText");

  var message = "You Win";
  message = message.bold();
  lostText.style.color = "black";

  wonText.innerHTML = message;
  document.getElementById("endButtons").disabled = false;
}

function roundEnd()
{
  gameStates[1] = new GameState("End");
  var message = document.getElementById("announcementText");
    message.style.fontSize = "12vh";
    message.style.top = "10%";

  document.getElementById("gameplay").style.visibility = "hidden";
  var button = document.getElementById("endButtons");
  button.style.visibility = "visible";
  message.style.visibility = "visible";
}

function reset()
{
  document.getElementById("endButtons").style.visibility = "hidden";
  document.getElementById("gameplay").style.visibility = "visible";
  document.getElementById("announcementText").style.visibility = "hidden";
  document.getElementById("endButtons").style.visibility = "hidden";

  xmlhttp.open("GET", "./data/level.json", true);
  xmlhttp.send();

    xmlhttp.onreadystatechange = function ()
    {
      if (this.readyState == 4 && this.status == 200) // if response is ready and contents are "OK"
      {

        data = JSON.parse(this.responseText);

        var unitsValues = [
          data.units.Unit1,
          data.units.Unit2,
          data.units.Unit3,
          data.units.Enemy1,
          data.units.Enemy2,
          data.units.Enemy3
        ];

          for (var i = 0; i < numOfUnits; i++)
          {
            units[i].x = unitsValues[i].position.x;
            units[i].y = unitsValues[i].position.y;
            units[i].destinationX = unitsValues[i].position.x;
            units[i].destinationY = unitsValues[i].position.y;
            units[i].health = unitsValues[i].health;
          }

          gameStates[0] = new GameState("Menu");
          gameStates[1] = new GameState("Player");

        document.body.style.backgroundColor = "white";
      }
    };
}
// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);
window.addEventListener("resize", displayWindowSize);
// Handle Keypressed
//button.addEventListener("onclick", tappingBoard);
