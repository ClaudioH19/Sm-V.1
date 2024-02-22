let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");
var r1 = document.getElementById("test1");
var r2 = document.getElementById("test2");
var r3 = document.getElementById("test3");
var r4 = document.getElementById("test4");

var rr1 = document.getElementById("rr1");
var rr2 = document.getElementById("rr2");
var rr3 = document.getElementById("rr3");
var rr4 = document.getElementById("rr4");

var zombies = [];
var map = [];
var n = 30; // max 124
var maxZ = 20;
var minZ = 20;
var sounds = [];
var refresh = 50;
var t = 0;
var intelligence = 20; // 100
var ratioexpl = 80;
var TbtwExp = 3000; // ms

function drawZombieinMap() {
  //console.log(zombies.length);
  for (i = 0; i < zombies.length; i++) {
    map[zombies[i].getX()][zombies[i].getY()] = "Z";
  }
}

function createMap() {
  for (let index = 0; index < n; index++) {
    map[index] = new Array(n);
  }

  for (let index = 0; index < n; index++) {
    for (let j = 0; j < n; j++) {
      map[index][j] = "_";
    }
  }
}

function printMap() {
  for (let index = 0; index < n; index++) {
    for (let j = 0; j < n; j++) {
      document.write(map[index][j] + " ");
    }
    document.write("<BR/>");
  }
}

class Zombie {
  soundX;
  soundY;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setSound(x, y) {
    this.soundX = x;
    this.soundY = y;
  }

  getSx() {
    return this.soundX;
  }

  getSy() {
    return this.soundY;
  }

  dstc(x, y) {
    return Math.sqrt(
      Math.pow(x - this.soundX, 2) + Math.pow(y - this.soundY, 2)
    );
  }
}

function createZombies(max) {
  var num = Math.floor(Math.random() * max + minZ);

  for (let index = 0; index < num; index++) {
    var x = Math.floor(Math.random() * n);
    var y = Math.floor(Math.random() * n);

    //console.log(x + " " + y + " hay zombie");

    zombies[index] = new Zombie(x, y);
  }
}

function moveTo(numz) {
  zaux = zombies[numz];

  if (Math.floor(Math.random() * 100) > intelligence) {
    //formula de seleccion en probabilidad
    selection = Math.floor(Math.random() * 4);
    //console.log("MOV: "+selection);
    map[zaux.getX()][zaux.getY()] = "_";
    switch (selection) {
      case 0:
        if (zaux.getX() + 1 < n && map[zaux.getX() + 1][zaux.getY()] != "Z")
          zaux.x = zaux.getX() + 1;
        break;
      case 1:
        if (zaux.getX() - 1 >= 0 && map[zaux.getX() - 1][zaux.getY()] != "Z")
          zaux.x = zaux.getX() - 1;
        break;

      case 2:
        if (zaux.getY() + 1 < n && map[zaux.getX()][zaux.getY() + 1] != "Z")
          zaux.y = zaux.getY() + 1;
        break;

      default:
        if (zaux.getY() - 1 >= 0 && map[zaux.getX()][zaux.getY() - 1] != "Z")
          zaux.y = zaux.getY() - 1;
        break;
    }
  } else {
    dstc = [];

    //if (zaux.getX() + 1 < n)
    x1 = zaux.getX() + 1;
    dstc[0] = Math.abs(x1 - zaux.getSx());

    //if (zaux.getX() - 1 >= 0)
    x2 = zaux.getX() - 1;
    dstc[1] = Math.abs(x2 - zaux.getSx());

    //if (zaux.getY() + 1 < n)
    y1 = zaux.getY() + 1;
    dstc[2] = Math.abs(y1 - zaux.getSy());

    //if (zaux.getY() - 1 >= 0)
    y2 = zaux.getY() - 1;
    dstc[3] = Math.abs(y2 - zaux.getSy());

    //console.log("DSTC: "+x1+" "+x2+" "+y1+" "+y2+" "+zaux.getSx()+" "+zaux.getSy());
    //console.log("DSTC: "+dstc[0]+" "+dstc[1]+" "+dstc[2]+" "+dstc[3]+" ");
    posmenorx = 0;
    for (let index = 0; index < 2; index++) {
      if (dstc[posmenorx] > dstc[index]) posmenorx = index;
    }

    posmenory = 2;
    for (let index = 2; index < 4; index++) {
      if (dstc[posmenory] > dstc[index]) posmenory = index;
    }
    //console.log("MENOR X.Y: "+posmenorx+" "+posmenory);

    selectionx = posmenorx;

    map[zaux.getX()][zaux.getY()] = "_";

    switch (selectionx) {
      case 0:
        if (zaux.getX() + 1 < n && map[zaux.getX() + 1][zaux.getY()] != "Z")
          zaux.x = zaux.getX() + 1;
        break;
      default:
        if (zaux.getX() - 1 >= 0 && map[zaux.getX() - 1][zaux.getY()] != "Z")
          zaux.x = zaux.getX() - 1;
        break;
    }

    selectiony = posmenory;
    map[zaux.getX()][zaux.getY()] = "_";
    switch (selectiony) {
      case 2:
        if (zaux.getY() + 1 < n && map[zaux.getX()][zaux.getY() + 1] != "Z")
          zaux.y = zaux.getY() + 1;
        break;

      default:
        if (zaux.getY() - 1 >= 0 && map[zaux.getX()][zaux.getY() - 1] != "Z")
          zaux.y = zaux.getY() - 1;
        break;
    }
    //console.log("MOV: "+selectionx+" "+selectiony);
  }
}

createMap();
createZombies(maxZ);
//generateSound();

function generateSound() {
  //SX = Math.floor(Math.random() * n);
  //SY = Math.floor(Math.random() * n);
  //map[SX][SY] = "O";

  for (let index = 0; index < zombies.length; index++) {
    let index0 = Math.floor(Math.random() * zombies.length);
    let index1 = Math.floor(Math.random() * zombies.length);
    let z0 = zombies[index0];
    let z1 = zombies[index1];
    z1.setSound(z0.getX(), z0.getY());

    //console.log( index0+"siguiendo a "+index1);
  }
}

var xepl = 0;
var yepl = 0;

function blow() {
  var num = Math.floor(Math.random() * 100);
  if (num <= ratioexpl && t % TbtwExp == 0) {
    map[xepl][yepl] = "_";
    xepl = Math.floor(Math.random() * n);
    yepl = Math.floor(Math.random() * n);

    map[xepl][yepl] = "X";
    //console.log("EXPLOSION");
    for (let i = 0; i < zombies.length; i++) {
      zombies[i].setSound(xepl, yepl);
    }
  } else if (num == 0) {
    map[xepl][yepl] = "_";
  } else if (num > ratioexpl) {
    for (let i = 0; i < zombies.length; i++) {
      zombies[i].setSound(xepl, yepl);
    }
  }
}

function draw(x, y) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (map[i][j] == "X") {
        ctx.fillStyle = "red";
        ctx.fillRect(
          Math.floor(i * (canvas.width / n)),
          Math.floor(j * (canvas.height / n)),
          5,
          3
        );
      } else if (map[i][j] == "Z") {
        ctx.fillStyle = "white";
        ctx.fillRect(
          Math.floor(i * (canvas.width / n)),
          Math.floor(j * (canvas.height / n)),
          1,
          1
        );
      }
    }
  }
}

function updateVars() {
  refresh = r1.value;
  ratioexpl = r2.value;
  TbtwExp = r3.value; // ms
  intelligence = r4.value; // 100

  rr1.innerText=r1.value;
  rr2.innerText=r2.value;
  rr3.innerText=r3.value;
  rr4.innerText=r4.value;
}

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  zombies.forEach((z) => {
    t++;
    z = Math.floor(Math.random() * zombies.length);

    blow();

    moveTo(z);
  });
  generateSound();
  drawZombieinMap();
  draw();
  updateVars();
}, refresh);
