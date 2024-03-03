var canvas = document.getElementById("canvas");
var grafico = document.getElementById("grafico");
var wallpaper = document.getElementById("wallpaper");
var ctx = canvas.getContext("2d");

var Maxpopulation = 5;
var maxTempSupported = 38;
var minTempSupported = -10;
var musicb;
var food = [];

//individuos
var positions = [];
var maxTemp = [];
var minTemp = [];
var genes = [];
var coordsFood = [];
var supply = [];
var coop = []; //%
var health = [];
var powerAttack = [];
var lastAng = [];
var rangeVision=[];
var stamina=[];
var age=[];
var genHated=[];

var lord="";
var inwar=[];
var totalwar=false;
//configuraciones
canvas.width = 1675;
canvas.height = 700;

//canvas.width = 2675;
//canvas.height = 1200;


var draw = false;
var era=0;
var gameOver=false;


var tempo=0;
var medcop=0;

function createPopulation(n) {

  var color = [
    "#4DEB88",
    "#49AAEB",
    "#EBD84D",
    "#D7EBBD",
    "#EB5B4D",
    "#EBAC4D",
    "#EB3934",
    "#EB4DA4",
    "#3D34EB",
    "#CCFA6E",
  ];

  for (i = 0; i < n; i++) {
    positions.push([
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height),
    ]);
    maxTemp.push(Math.floor(Math.random() * maxTempSupported + 0));
    minTemp.push(
      Math.floor(Math.random() * maxTempSupported + minTempSupported)
    );
    supply.push(0);
    genes.push(color[Math.floor(Math.random() * 10)]);
    coop.push(Math.floor(Math.random() * 100));
    coordsFood.push([0, 0]);
    health.push(100);
    powerAttack.push(Math.floor(Math.random() * 10));
    lastAng.push(0);
    rangeVision.push(100);
    stamina.push(100);
    age.push(0);
    genHated.push(" ");
  }
}

function setChild(i, j) {

  var music = document.getElementById("born");
  const promise = music.play();
  music.volume=0.3;

  setTimeout(()=>{music.pause();
  music.currentTime=0;},1800);

  positions.push([
    Math.floor(
      (positions[i][0] + positions[j][0]) / 2 +
        Math.random() * (50)
    ),
    Math.floor(
      (positions[i][1] + positions[j][1]) / 2 +
        Math.random() * (50)
    ),
  ]);

  var mt=Math.floor(Math.random() * maxTemp[j] + minTemp[i])
  var Mt=Math.floor(Math.random() * maxTemp[i] + minTemp[j]);
  var auxcamb=0;
  if(Mt<mt){
    auxcamb=mt;
    mt=Mt;
    Mt=auxcamb;
  }
  
  maxTemp.push(Mt);
  minTemp.push(mt);

  supply.push(0);
  //console.log("#"+genes[i].charAt(Math.floor(Math.random() *6)+1)+genes[i].charAt(Math.floor(Math.random() *6)+1)+genes[i].charAt(Math.floor(Math.random() *6)+1)+genes[j].charAt(Math.floor(Math.random() *6)+1)+genes[j].charAt(Math.floor(Math.random() *6)+1)+genes[j].charAt(Math.floor(Math.random() *6)+1))
  //genes.push("#"+genes[i].charAt(1)+genes[j].charAt(2)+genes[i].charAt(Math.floor(Math.random() *7)+1)+genes[j].charAt(Math.floor(Math.random() *7)+1)+genes[j].charAt(Math.floor(Math.random() *7)+1)+genes[j].charAt(Math.floor(Math.random() *7)+1));
  
  var adn="#"+genes[i].charAt(1)+genes[j].charAt(1);
  for(k=3;k<7;k++){
    var form=Math.floor(Math.random()*2);
    if(form==0){
      adn+=genes[i].charAt(k);
    }
    else{
      adn+=genes[j].charAt(k);
    }
  }


  genes.push(adn);
  coop.push(Math.floor(Math.random() * coop[j] + coop[i]));
  coordsFood.push([0, 0]);
  health.push(100);
  powerAttack.push(Math.floor(Math.random() * powerAttack[j] + powerAttack[i])%10);
  lastAng.push(0);
  rangeVision.push((rangeVision[i]+rangeVision[j])/2+Math.floor(Math.random()*5+-5));
  stamina.push(Math.floor((stamina[i]+stamina[j])/2)+Math.floor(Math.random()*10-10));
  age.push(0);
  genHated.push(genHated[i]);
}

function distancePeople(i, j) {
  return Math.sqrt(
    Math.pow(positions[i][0] - positions[j][0], 2) +
      Math.pow(positions[i][1] - positions[j][1], 2)
  );
}

function distanceFood(i, j) {
  return Math.sqrt(
    Math.pow(positions[i][0] - food[j][0], 2) +
      Math.pow(positions[i][1] - food[j][1], 2)
  );
}

function distance(x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}

function createfood() {
  var proba = Math.floor(Math.random() * 100);
  if (proba+era > 80) {
    food.push([
      Math.floor(Math.random() * (canvas.width - 50)) + 50,
      Math.floor(Math.random() * (canvas.height - 50)) + 50,
      Math.floor(Math.random() * 100),
    ]);
  }
}

function drawFood() {
  var colors;
  for (i = 0; i < food.length; i++) {
    if (food[i][2] > 0) colors = "red";
    if (food[i][2] >= 10) colors = "lime";
    if (food[i][2] > 30) colors = "yellow";
    if (food[i][2] > 50) colors = "blue";
    if (food[i][2] > 80) colors = "white";
    if (food[i][2] > 0) {
      drawcircle(colors, 5, food[i][0], food[i][1]);
    }
  }
}





function drawBuilding(){
  for(i=0;i<house.length;i++){

    if(house[i][3]==1){
      var img = new Image();
      // Definir la ruta de la imagen
       img.src = "icons/hogar.png";
       // Esperar a que la imagen se cargue antes de dibujarla en el canvas
       
         // Dibujar la imagen en el canvas en la posición (0, 0)
         ctx.drawImage(img, house[i][0]-25, house[i][1]-25,50,50);
    
        this.ctx.globalCompositeOperation = "source-over"
        var tam=50;
        this.ctx.globalAlpha = 0.05; // reset alpha
        drawcircle("#DBFF00",tam,house[i][0],house[i][1]);//#F0EA50
        this.ctx.globalAlpha = 1; // fade rate
    }
    else if(house[i][3]==0){

      var img = new Image();
      // Definir la ruta de la imagen
      img.src = "icons/suelo.png";
      if(era>5)
        img.src = "icons/granja.png";
      // Esperar a que la imagen se cargue antes de dibujarla en el canvas
      // Dibujar la imagen en el canvas en la posición (0, 0)
      this.ctx.globalAlpha = 0.5; // fade rate
      ctx.drawImage(img, house[i][0], house[i][1],100,80);
    

      this.ctx.globalAlpha = 1; // fade rate
      this.ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle="brown";
      ctx.borderColor="lime";
      //ctx.fillRect(house[i][0],house[i][1],100,80);
      
      if(Math.floor(Math.random()*100<1))
        food.push([house[i][0]+Math.floor(Math.random()*90+10),house[i][1]+10,10]);
      if(Math.floor(Math.random()*100<1))
        food.push([house[i][0]+Math.floor(Math.random()*90+10),house[i][1]+30,10]);
      if(Math.floor(Math.random()*100<1))
        food.push([house[i][0]+Math.floor(Math.random()*90+10),house[i][1]+50,10]);
      if(Math.floor(Math.random()*100<1))
        food.push([house[i][0]+Math.floor(Math.random()*90+10),house[i][1]+70,10]);
    
      this.ctx.globalAlpha = 1; // fade rate

    }
  }
}


var house=[];
function buildBuilding(i){
  if(health[i]<0)return;

    var p=0;
    var avaliable=true;
    
    for(k=0;k<positions.length;k++){
      if(distance(positions[i][0],positions[i][1],positions[k][0],positions[k][1])<100){
        p++;
      }
    }
    if(p<=4) return;

    setTimeout(()=>{

    for(k=0;k<house.length;k++){
      if(distance(positions[i][0],positions[i][1],house[k][0],house[k][1])<=175){
        avaliable=false;
      }
    }
    
    if(avaliable){
      var music = document.getElementById("house");
      music.play();
      music.volume=0.5;

      house.push([positions[i][0],positions[i][1],true,Math.floor(Math.random()*2)]);
    }
  
    },3800);

}

function functionbuildings() {

  for(k=0;k<house.length;k++){
    if(house[k][2]=false) return;
    var p=0;
    var num=[];
    for(i=0;i<positions.length;i++){
      if(health[i]>0 && distance(positions[i][0],positions[i][1],house[k][0],house[k][1])<50){
        p++;
        num.push(i);
        health[i]+=2;
        stamina[i]+=2;
        //supply[i]+=1;
      }

    }

    for(j=0;j<food.length;j++){
      var ang=calcAng(food[j][0],food[j][1],house[k][0],house[k][1]);
      if(house[k][3]!=0 && food[j][2]>0 && distance(food[j][0],food[j][1],house[k][0],house[k][1])<225){
        food[j][0]+=Math.cos(ang)*0.1;
        food[j][1]+=Math.sin(ang)*0.1;
      }

    }
    
  }
}







function search() {
  for (i = 0; i < positions.length; i++) {
    if (supply[i] == 0) {
      coordsFood[i][0] = undefined;
      coordsFood[i][1] = undefined;
    }

    for (j = 0; j < food.length; j++) {
      if (health[i] > 0 && food[j][2] > 0) {
        if (draw && distanceFood(i, j) < rangeVision[i] && calcAng(positions[i][0], positions[i][1],food[j][0],food[j][1])==lastAng[i]) {
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.moveTo(positions[i][0], positions[i][1]);
          ctx.lineTo(food[j][0],food[j][1]);
          ctx.stroke();
          ctx.closePath();
        }
        if(distanceFood(i, j) < rangeVision[i]/2.5){
          var music = document.getElementById("eat");
          const promise = music.play();
          music.volume=0.05;
          //setTimeout(()=>{music.pause();music.currentTime=0},2000);

          coordsFood[i] = [food[j][0], food[j][1]];
          food[j][2]--;
          if (supply[i] < 200) supply[i]++;
        }
      }
    }

    for (j = 0; i != j && j < positions.length; j++) {
      if (health[j] > 0 && health[i] > 0 && distancePeople(i, j) < rangeVision[i]*3/4) {

        var num = Math.floor(Math.random() * 100);
        if (genes[j] != lord && (num > coop[i] || genHated[i].charAt(6)==genes[j].charAt(6)) ) {
          //eliminar
          if(coop[j]>-100)
            coop[j]--;
          genHated[j]=genes[i];

          if (powerAttack[i] > powerAttack[j]) health[j] -= powerAttack[i];
          if (draw) {
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(positions[i][0], positions[i][1]);
            ctx.lineTo(positions[j][0], positions[j][1]);
            ctx.stroke();
            ctx.closePath();
          }
        } else if (genes[j]==lord || num <= coop[i] || genes[i].charAt(1) == genes[j].charAt(1) || genes[i].charAt(2) == genes[j].charAt(2)) {
          //cooperar

          //buildBuilding(i);

          if (coop[i] < 100) coop[i]++;
          if (coop[j] < 100) coop[j]++;

          if(stamina[i]<10)stamina[i]++;
          if(stamina[j]<10)stamina[j]++;

          if(coordsFood[i][0]!=undefined)
            coordsFood[j][0] = coordsFood[i][0];

          if(coordsFood[i][1]!=undefined)
            coordsFood[j][1] = coordsFood[i][1];
        

          if (supply[i] > 40 && supply[j] > 40) {

            setChild(i, j);
            supply[i] -= 40;
            supply[j] -= 40;
            coop[i]=100;
            coop[j]=100;

          }
          //fijarse en este orden primero buscaran procrear
          if (supply[i] > 0 && health[j] < 100) {
            var help = Math.floor(Math.random() * supply[i]);
            health[j] += help;
            supply[i] -= help;
          }
          if (supply[j] == 0 && health[j] > 0) {
            var help = Math.floor(Math.random() * supply[i]);
            supply[j] += help;
            supply[i] -= help;
          }
          if (draw) {
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(positions[i][0], positions[i][1]);
            ctx.lineTo(positions[j][0], positions[j][1]);
            ctx.stroke();
            ctx.closePath();
          }

          buildBuilding(i);
        }
      }
    }
  }
}

function drawPositions(i, ang) {

  this.ctx.globalAlpha = 0.7; // fade rate
  this.ctx.globalCompositeOperation = "source-over"

  var color = [
    "#4DEB88",
    "#49AAEB",
    "#EBD84D",
    "#D7EBBD",
    "#EB5B4D",
    "#EBAC4D",
    "#EB3934",
    "#EB4DA4",
    "#3D34EB",
    "white",
  ];

  drawcircle(genes[i], 15, positions[i][0], positions[i][1]);
  drawcircle(
    "white",
    5,
    positions[i][0] + Math.cos(ang - Math.PI / 6) * 10,
    positions[i][1] + Math.sin(ang - Math.PI / 6) * 10
  );
  drawcircle(
    genes[i],
    2,
    positions[i][0] + Math.cos(ang - Math.PI / 8) * 12,
    positions[i][1] + Math.sin(ang - Math.PI / 8) * 12
  );

  drawcircle(
    "white",
    5,
    positions[i][0] + Math.cos(ang + Math.PI / 6) * 10,
    positions[i][1] + Math.sin(ang + Math.PI / 6) * 10
  );
  drawcircle(
    genes[i],
    2,
    positions[i][0] + Math.cos(ang + Math.PI / 8) * 12,
    positions[i][1] + Math.sin(ang + Math.PI / 8) * 12
  );

  drawcircle(
    genes[i],
    5,
    positions[i][0] + Math.cos(ang - Math.PI / 4) * 18,
    positions[i][1] + Math.sin(ang - Math.PI / 4) * 18
  );
  drawcircle(
    genes[i],
    5,
    positions[i][0] + Math.cos(ang + Math.PI / 4) * 18,
    positions[i][1] + Math.sin(ang + Math.PI / 4) * 18
  );

  this.ctx.globalAlpha = 0.5; // fade rate
  this.ctx.globalCompositeOperation = "source-over"

  ctx.font = "14pt Verdana";
  ctx.fillStyle = "white";
  if (draw) {
    ctx.beginPath();
    ctx.fillText("Yo:" + age[i], positions[i][0] + 10, positions[i][1] - 145);
    ctx.fillText("St:" + stamina[i], positions[i][0] + 10, positions[i][1] + 5);
    ctx.fillText("Ht:" + health[i], positions[i][0] + 10, positions[i][1] - 10);
    ctx.fillText("Fo:" + supply[i], positions[i][0] + 10, positions[i][1] - 25);
    ctx.fillText("Ge:" + genes[i], positions[i][0] + 10, positions[i][1] - 40);
    ctx.fillText(
      "MT:" + maxTemp[i],
      positions[i][0] + 10,
      positions[i][1] - 55
    );
    ctx.fillText(
      "mT:" + minTemp[i],
      positions[i][0] + 10,
      positions[i][1] - 70
    );
    ctx.fillText(
      "At:" + powerAttack[i],
      positions[i][0] + 10,
      positions[i][1] - 85
    );
    ctx.fillText("Co:" + coop[i], positions[i][0] + 10, positions[i][1] - 100);
    ctx.fillText("Rv:" + rangeVision[i], positions[i][0] + 10, positions[i][1] - 115);
    ctx.fillText("Gh:" + genHated[i], positions[i][0] + 10, positions[i][1] - 130);
    ctx.closePath();
    
  }
    this.ctx.globalAlpha = 1; // fade rate
}

function bodyblock(i){

  for(j=0;j<positions.length;j++){
    var dstc=distance(positions[i][0],positions[i][1],positions[j][0],positions[j][1]);
    if(i!=j && health[j]>0 && dstc<=20){
      var ang=calcAng(positions[i][0],positions[i][1],positions[j][0],positions[j][1]);
      var v =Math.abs(15-dstc);
      v=10;
      if (
        canvas.width > positions[j][0] + Math.cos(ang) * v &&
        positions[j][0] + Math.cos(ang) * v > 0
      ) {
        positions[j][0] += Math.cos(ang) * v;
        if(coop[j]>-100)
          coop[j]-=7.5;
      }

      if (
        canvas.height > positions[j][1] + Math.sin(ang) * v &&
        positions[j][1] + Math.sin(ang) * v > 0
      ) {
        positions[j][1] += Math.sin(ang) * v;
        if(coop[j]>-100)
          coop[j]-=7.5;
      }
    }
  }
}




function movementImproved() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < positions.length; i++) {
    var stay = Math.floor(Math.random() * 10);

    if (health[i] > 0) {
      var x1 = Math.random() * canvas.width;
      var y1 = Math.random() * canvas.height;
      var dtc = distance(positions[i][0], positions[i][1], x1, y1);
      ang = lastAng[i];
      var probchangedir = Math.floor(Math.random() * 100);
      if (stay > 1) {
        
        if (probchangedir <= 1) ang = Math.random() * 2 * Math.PI;

        var probremind = Math.floor(Math.random() * 100);
        if (probremind <= 3)
          ang = calcAng(
            positions[i][0],
            positions[i][1],
            coordsFood[i][0],
            coordsFood[i][1]
          );

        nf = true;
        for (j = 0; nf && j < food.length; j++) {
          if (supply[i]!=100 && food[j][2] > 0 && distanceFood(i, j) < rangeVision[i]) {
            nf = false;
            ang = calcAng(
              positions[i][0],
              positions[i][1],
              food[j][0],
              food[j][1]
            );
          }
        }

        np = true;
        for (j = 0; np && i != j && j < positions.length; j++) {
          if (
            supply[i] > 50 &&
            supply[j] > 50 &&
            health[j] > 0 &&
            distancePeople(i, j) < 200
          ) {
            np = false;
            ang = calcAng(
              positions[i][0],
              positions[i][1],
              positions[j][0],
              positions[j][1]
            );
            var probchangedir = Math.floor(Math.random() * 100);
            if (probchangedir < coop[j]) ang += Math.random() * (Math.PI);
          }
        }

        //lord tributos
        if(health[i]>0 && genes[i]!=lord){

          for(j=0;j<positions.length;j++){
            if(genes[j]==lord && supply[i]>30 && supply[j]<50 && distance(positions[i][0],positions[i][1],positions[j][0],positions[j][1])<200){
              ang=calcAng(positions[i][0],positions[i][1],positions[j][0],positions[j][1]);

              if(distance(positions[i][0],positions[i][1],positions[j][0],positions[j][1])<40){
                supply[j]+=supply[i];
                supply[i]=0;
              }

            }
          }
        }

        if(totalwar && (genes[i]==inwar[0] || genes[i]==inwar[1])){
          var arr=war(i);
          ang=arr[0];
          var select=arr[1];
          if(health[select]>0 && health[i]>0 && distance(positions[i][0],positions[i][1],positions[select][0],positions[select][1])<30){
            health[select]-=powerAttack[i];
          }
          
        }


        lastAng[i] = ang;
        var v = stamina[i]/100;
        if (stamina[i]>0 && 
          canvas.width > positions[i][0] + Math.cos(ang) * v &&
          positions[i][0] + Math.cos(ang) * v > 0
        ) {
          positions[i][0] += Math.cos(ang) * v;
          if(stamina[i]-Math.cos(ang) * v>2)
            stamina[i]-=Math.cos(ang) * v
        }

        if (stamina[i]>0 &&
          canvas.height > positions[i][1] + Math.sin(ang) * v &&
          positions[i][1] + Math.sin(ang) * v > 0
        ) {
          positions[i][1] += Math.sin(ang) * v;
          if(stamina[i]-Math.sin(ang) * v>2)
            stamina[i]-=Math.sin(ang) * v
        }
        bodyblock(i);
        
      }

      drawPositions(i, ang);
    }
    else if (health[i]<=0){
      this.ctx.globalCompositeOperation = "source-over"
      this.ctx.globalAlpha = 0.5; // reset alpha
      var img = new Image();
      img.src = "icons/tombstone.png";
      ctx.drawImage(img, positions[i][0]-25, positions[i][1]-25,50,50);
      ctx.stroke();
      this.ctx.globalAlpha = 1; // reset alpha
    }
  }
}


function asignLord(){
  this.lord=genes[Math.floor(Math.random()*genes.length-1)];

}

function drawLord(){
  
  for(i=0;i<positions.length;i++){
    if(health[i]>0 && genes[i]==lord){
      this.ctx.globalAlpha = 1; // reset alpha
      var img = new Image();
      img.src = "icons/corona.png";
      ctx.drawImage(img, positions[i][0]-12.5, positions[i][1]-35,25,25);
      ctx.stroke();
    }
  }
}

function drawWar(){

  for(i=0;i<positions.length;i++){

    if(health[i]>0 && (genes[i]==inwar[0] || genes[i]==inwar[1])){
      ctx.globalAlpha =1; // fade rate
      ctx.globalCompositeOperation = "source-over";
      var img = new Image();
      img.src = "icons/espada.png";
      ctx.drawImage(img, positions[i][0]+Math.cos(lastAng[i]-Math.PI/6)*10, positions[i][1]+Math.sin(lastAng[i]-Math.PI/6)*10,25,25);
    }

  }

}








var niebla=false;
var neb=[];
var aux=[];
var durationfog=0;
function drawWaves(){ 

  this.ctx.globalAlpha = Math.random()*0.5+0.4; // fade rate
  this.ctx.globalCompositeOperation = "source-over";
  for(j=0;niebla && j<neb.length;j++){
    var i=j;
    drawcircle("gray",neb[j][2],neb[j][0],neb[j][1]);

      //viajar
  switch(neb[i][3]){

    case 0:
        neb[i][0]+=0.5;
      break;
    case 1:
        neb[i][0]-=0.5;
      break;
    case 2:
        neb[i][1]+=0.5;
      break;
    case 3:
        neb[i][0]+=0.5;neb[i][1]+=0.5;
      break;
    case 4:
        neb[i][0]+=0.5;neb[i][1]-=0.5;
      break;
    case 5:
        neb[i][0]-=0.5;neb[i][1]-=0.5;
      break;
    case 6:
        neb[i][0]-=0.5;neb[i][1]+=0.5;
      break;
    default:
        neb[i][1]-=0.5;
      break;

  }

  }
  this.ctx.globalAlpha = 1; // reset alpha


  for(i=0;niebla && i<positions.length;i++){
    if(health[i]>0){
      for(j=0;j<neb.length;j++){
        if(distance(positions[i][0],positions[i][1],neb[j][0],neb[j][1])<=neb[j][2]){
          rangeVision[i]=Math.floor(Math.random()*(aux[i]-neb[j][2]%10));
        }
        if(Math.floor(Math.random()*2)==0)
          neb[j][2]++;
        else if(neb[j][2]>0) neb[j][2]--;
        //neb[j][3]=Math.floor(Math.random()*10);
      }
    }
  }
 
  if(cold){
    var f=Math.random()*0.35+0.3;
    this.ctx.globalAlpha = f; // fade rate
    this.ctx.globalCompositeOperation = "source-over"
    this.ctx.fillStyle="#97DCE8";
    this.ctx.fillRect(0, 0, canvas.width,canvas.height)
    this.ctx.globalAlpha = 1; // reset alpha
  }
  if(heat){
    var f=Math.random()*0.3+0.2;
    this.ctx.globalAlpha = f; // fade rate
    this.ctx.globalCompositeOperation = "source-over"
    this.ctx.fillStyle="#EFA35E";
    this.ctx.fillRect(0, 0, canvas.width,canvas.height)
    this.ctx.globalAlpha = 1; // reset alpha
  }
  
}


var heat=false;
var cold=false;
var t;
function temperature() {
  var num = Math.random() * 100;
  if (num > 40 + era) return;

  canvas.style.borderWidth = "1px";
  canvas.style.borderStyle = "solid";
  t = Math.floor(Math.random() * 50 + -25);
  //console.log(t);
  var duration=Math.random()*10000+1500;

  if (t < 0 && !cold && !heat){
    cold=true;
    //getInfoIncident();
    var music = document.getElementById("cold");
    const promise = music.play();
    music.volume=0.3;
    //canvas.style.borderColor = "#97DCE8";
    setTimeout(()=>{cold=false;music.pause();music.currentTime = 0;food=[];},duration);
  }
  else if(t<10 && !niebla){
    niebla=true;
    //getInfoIncident();
    var times=Math.floor(Math.random()*50)+20;

    for(j=0;j<times;j++){
      neb.push([Math.floor(Math.random()*canvas.width),Math.floor(Math.random()*canvas.height),Math.floor(Math.random()*100),Math.floor(Math.random()*10)]);
    }
    for(i=0;i<rangeVision.length;i++){
      aux[i]=rangeVision[i];
    }

    var music = document.getElementById("fog");
    const promise = music.play();
    music.volume=0.3;
    setTimeout(()=>{for(i=0;i<rangeVision.length;i++){rangeVision[i]=aux[i];}},duration); 
    setTimeout(()=>{niebla=false;neb=[];music.pause();music.currentTime = 0;},duration);
  }
  else if (t > 20 && !heat && !cold){
    //canvas.style.borderColor = "#EFA35E";
    heat=true;
    //getInfoIncident();
    var music = document.getElementById("heat");
    const promise = music.play();
    music.volume=0.3;
    
    setTimeout(()=>{heat=false;music.pause();music.currentTime = 0;house=[];},duration);
  } 
  else canvas.style.borderColor = "black";

  for (i = 0; i < positions.length; i++) {
    if (maxTemp[i] < t || t < minTemp[i]) {
      health[i] -= Math.floor(Math.random() * 40 + 10);
    }
  }

  setTimeout(() => {
    canvas.style.borderColor = "black";
  }, 2000);
}

function starve() {
  for (i = 0; i < positions.length; i++) {
    if (health[i] > 0 && supply[i] == 0) {
      health[i] -= Math.floor(Math.random() * 5);
    }
    if (supply[i] > 0) supply[i]--;
  }
}

function heal() {
  ctx.strokeStyle = "lime";
  for (i = 0; i < positions.length; i++) {
    if (health[i] > 0 && health[i] < 100 && supply[i] > 0) {

        var music = document.getElementById("heal");
        const promise = music.play();
        music.volume=0.2;
        //setTimeout(()=>{music.pause();music.currentTime = 0;},Math.random()*1000);

        this.ctx.globalAlpha = 0.5; // fade rate
        this.ctx.globalCompositeOperation = "source-over"
        drawcircle("lime",30,positions[i][0],positions[i][1]);
        this.ctx.globalAlpha = 1; // reset alpha
        health[i]+=supply[i];
        if (health[i] > 100) health[i]=100;
        supply[i]=0;
      
    }
  }
}

function spendStamina(){

  for(i=0;i<stamina.length;i++){

    if(stamina[i]==undefined||stamina[i]<1.1){
      stamina[i]=1.1;
    }
    if (1==Math.floor(Math.random()*20)){
      var desc=Math.floor(Math.random()*supply[i]);
      stamina[i]+=desc;
      supply[i]-=desc;
      if(stamina[i]>100)
        stamina[i]=100;
    }
  }

}


var quakes=[];
function earthquake(){
  if(era<4)return;

  if(Math.floor(Math.random()*300)!=1){

    for(i=0;i<quakes.length;i++){
      ctx.strokeStyle = "cyan";//#00F5F3
      ctx.linewidth = 100;
      ctx.beginPath();
      ctx.arc(Math.floor(quakes[i][0]), Math.floor(quakes[i][1]), quakes[i][2], 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(Math.floor(quakes[i][0]), Math.floor(quakes[i][1]), quakes[i][2]+15, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(Math.floor(quakes[i][0]), Math.floor(quakes[i][1]), quakes[i][2]+30, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(Math.floor(quakes[i][0]), Math.floor(quakes[i][1]), quakes[i][2]+45, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(Math.floor(quakes[i][0]), Math.floor(quakes[i][1]), quakes[i][2]+60, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      quakes[i][2]+=1;
      if(quakes[i][2]==300)quakes[i][2]=0;
  
      for(j=0;j<positions.length;j++){
        if(distance(positions[j][0],positions[j][1],quakes[i][0],quakes[i][1])<quakes[i][2]+60 && distance(positions[j][0],positions[j][1],quakes[i][0],quakes[i][1])>quakes[i][2]-60){
          stamina[j]=0;
          lastAng[j]=Math.random()*(2*Math.PI);
        }
      }
  
    }
  }
  else{

    var music = document.getElementById("space");
    var x=Math.floor(Math.random()*canvas.width);
    var y=Math.floor(Math.random()*canvas.height);
    quakes.push([x,y,0]);

    music.play();
    music.volume=0.8;
    setTimeout(()=>{
      music.pause();
      music.currentTime = 0;
      quakes=[];
    },Math.random()*4000+1000);
  }
}






var windwaves=[];
function wind(){

  if(Math.floor(Math.random()*200)==1){
    var music = document.getElementById("wind");
    const promise = music.play();
    music.volume=0.1;
    setTimeout(()=>{windwaves=[];music.pause();music.currentTime = 0;},Math.random()*3500);
    var x=Math.floor(Math.random()*canvas.width);
    var y=Math.floor(Math.random()*canvas.height);
    windwaves.push([x,y,1]);
    //getInfoIncident();
  }

  for(i=0;i<windwaves.length;i++){
    this.ctx.globalAlpha = 1; // fade rate
    this.ctx.globalCompositeOperation = "source-over"
    ctx.strokeStyle = "white";
    ctx.linewidth = 100;
    ctx.beginPath();
    ctx.arc(Math.floor(windwaves[i][0]), Math.floor(windwaves[i][1]), windwaves[i][2], 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();

    //drawcircle("#00F5F3",lightnings[i][2],lightnings[i][0],lightnings[i][1]);
    windwaves[i][2]+=1;

    for(j=0;j<positions.length;j++){
      if(health[j]>0 && distance(positions[j][0],positions[j][1],windwaves[i][0],windwaves[i][1])<windwaves[i][2]+10 && distance(positions[j][0],positions[j][1],windwaves[i][0],windwaves[i][1])>windwaves[i][2]-10){
        var ang=calcAng(windwaves[i][0],windwaves[i][1],positions[j][0],positions[j][1]);
        if (
          canvas.width > positions[j][0] + Math.cos(ang) * 1 &&
          positions[j][0] + Math.cos(ang) * 1 > 0
        ) {
          positions[j][0] += Math.cos(ang) * 1;
        }

        if (
          canvas.height > positions[j][1] + Math.sin(ang) * 1 &&
          positions[j][1] + Math.sin(ang) * 1 > 0
        ) {
          positions[j][1] += Math.sin(ang) * 1;
        }
      }
    }

    for(j=0;j<food.length;j++){
      if(food[j][2]>0 && distance(food[j][0],food[j][1],windwaves[i][0],windwaves[i][1])<windwaves[i][2]+1  && distance(food[j][0],food[j][1],windwaves[i][0],windwaves[i][1])>windwaves[i][2]-1){
        var ang=calcAng(windwaves[i][0],windwaves[i][1],food[j][0],food[j][1]);
        if (
          canvas.width > food[j][0] + Math.cos(ang) * 1 &&
          food[j][0] + Math.cos(ang) * 1 > 0
        ) {
          food[j][0] += Math.cos(ang) * 1;
        }

        if (
          canvas.height > food[j][1] + Math.sin(ang) * 1 &&
          food[j][1] + Math.sin(ang) * 1 > 0
        ) {
          food[j][1] += Math.sin(ang) * 1;
        }
      }
    }
  
  }

  this.ctx.globalAlpha = 1; // reset alpha


}



var storms=[];
function storm(){

  if(era<2)return;

  if(Math.floor(Math.random()*200)==1){
    var music = document.getElementById("tornado");
    const promise = music.play();
    music.volume=0.1;
    setTimeout(()=>{storms=[];music.pause();music.currentTime = 0;},Math.random()*7500+1500);
    var x=Math.floor(Math.random()*canvas.width);
    var y=Math.floor(Math.random()*canvas.height);
    storms.push([x,y,200]);
    //getInfoIncident();
  }

  for(i=0;i<storms.length;i++){
    this.ctx.globalAlpha = 1; // fade rate
    this.ctx.globalCompositeOperation = "source-over"
    /*ctx.strokeStyle = "lightblue";
    ctx.linewidth = 100;
    ctx.beginPath();
    ctx.arc(Math.floor(storms[i][0]), Math.floor(storms[i][1]),storms[i][2], 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();*/

    var img = new Image();
    img.src = "icons/tornado.png";
    ctx.drawImage(img, storms[i][0]-50, storms[i][1]-50,100,100);

    //drawcircle("#00F5F3",lightnings[i][2],lightnings[i][0],lightnings[i][1]);
    storms[i][2]-=1;
    if(storms[i][2]==0)storms[i][2]=200;

    for(j=0;j<positions.length;j++){
      if(health[j]>0 && distance(positions[j][0],positions[j][1],storms[i][0],storms[i][1])<storms[i][2]+10 && distance(positions[j][0],positions[j][1],storms[i][0],storms[i][1])>storms[i][2]-10){
        var ang=calcAng(positions[j][0],positions[j][1],storms[i][0],storms[i][1]);

        if(distance(positions[j][0],positions[j][1],storms[i][0],storms[i][1])<20)
          health[j]-=10;
        
        if (
          canvas.width > positions[j][0] + Math.cos(ang) * 2 &&
          positions[j][0] + Math.cos(ang) * 2 > 0
        ) {
          positions[j][0] += Math.cos(ang) * 2;
        }

        if (
          canvas.height > positions[j][1] + Math.sin(ang) * 2 &&
          positions[j][1] + Math.sin(ang) * 2 > 0
        ) {
          positions[j][1] += Math.sin(ang) * 2;
        }
      }
    }

    for(j=0;j<food.length;j++){
      if(food[j][2]>0 && distance(food[j][0],food[j][1],storms[i][0],storms[i][1])<storms[i][2]+1  && distance(food[j][0],food[j][1],storms[i][0],storms[i][1])>storms[i][2]-1){
        var ang=calcAng(food[j][0],food[j][1],storms[i][0],storms[i][1]);
        if (
          canvas.width > food[j][0] + Math.cos(ang) * 2 &&
          food[j][0] + Math.cos(ang) * 2 > 0
        ) {
          food[j][0] += Math.cos(ang) * 2;
        }

        if (
          canvas.height > food[j][1] + Math.sin(ang) * 2 &&
          food[j][1] + Math.sin(ang) * 2 > 0
        ) {
          food[j][1] += Math.sin(ang) * 2;
        }
      }
    }
  
  }

  this.ctx.globalAlpha = 1; // reset alpha


}





var txz=[];
function toxicZone(){

  if(era>6 && Math.floor(Math.random()*300)==1){
    var music = document.getElementById("acid");
    const promise = music.play();
    music.volume=0.25;

    setTimeout(()=>{txz=[];music.pause();music.currentTime = 0;},Math.random()*10000+2000);
    txz.push([Math.floor(Math.random()*canvas.width),Math.floor(Math.random()*canvas.height),Math.floor(Math.random()*250),Math.floor(Math.random()*7)]);
    //getInfoIncident();
  
  }

  for(i=0;i<txz.length;i++){
    this.ctx.globalAlpha = 0.5; // fade rate
    this.ctx.globalCompositeOperation = "source-over"
    drawcircle("#EDE05A",txz[i][2],txz[i][0],txz[i][1])
    this.ctx.globalAlpha = 1; // reset alpha


  for(j=0;j<positions.length;j++){
    if(health[j]>0 && distance(positions[j][0],positions[j][1],txz[i][0],txz[i][1])<txz[i][2]){
        health[j]-=1;
    }
  }

  for(j=0;j<food.length;j++){
    if(food[j][2]>0 && distance(food[j][0],food[j][1],txz[i][0],txz[i][1])<txz[i][2]){
      food[j][2]--;
    }
  }


  //viajar
  switch(txz[i][3]){

    case 0:
        txz[i][0]+=0.5;
      break;
    case 1:
        txz[i][0]-=0.5;
      break;
    case 2:
        txz[i][1]+=0.5;
      break;
    case 3:
        txz[i][0]+=0.5;txz[i][1]+=0.5;
      break;
    case 4:
        txz[i][0]+=0.5;txz[i][1]-=0.5;
      break;
    case 5:
        txz[i][0]-=0.5;txz[i][1]-=0.5;
      break;
    case 6:
        txz[i][0]-=0.5;txz[i][1]+=0.5;
      break;
    default:
        txz[i][1]-=0.5;
      break;

  }

  


  }



}


function calcAng(x0, y0, x1, y1) {
  //ESTA FUNCION DEVUELVE DESDE UN PUNTO, EL ANGULO CON SENTIDO HACIA UNA DIRECCION (OTRO PUNTO x1y1) (en sentido antihorario)

  //NOTAS CANVAS JS
  //EL ANGULO LO MIDE SENTIDO HORARIO 60 GRADOS SON PARA ABAJO NO PARA ARRIBA, SE ARREGLA CON LA RESTA DE 2PI-ANG
  //para calcular el angulo ANTIHORARIO que se requiere a veces es mejor usar ca/co y otras co/ca en atan()
  //SI EL OBJET ESTA MAS ABAJO VER POSI, SI ESTA A LA IZQ HOR NEG

  //identificar izq o der arriba o abajo
  var hor = x1 - x0;
  var ver = y1 - y0;
  var ang = 0;

  //primer cuadrante
  if (hor > 0 && ver <= 0) {
    ang = Math.abs(Math.atan(ver / hor));
  }

  //segundo cuadrante
  else if (hor <= 0 && ver < 0) {
    ang = Math.abs(Math.atan(hor / ver));
    ang += Math.PI / 2;
    //console.log("P/2");
  }
  //3 cuadrante
  else if (hor < 0 && ver >= 0) {
    ang = Math.abs(Math.atan(ver / hor));
    ang += Math.PI;
    //console.log("P");
  }
  //4to cuadrante
  else if (hor >= 0 && ver > 0) {
    ang = Math.abs(Math.atan(hor / ver));
    ang += (Math.PI * 3) / 2;
    //console.log("P*3/2");
  }

  //revertir a sentido antihorario
  ang = 2 * Math.PI - ang;

  /*
  console.log(ver,hor,ang,ang/(Math.PI/180));
  drawcircle("green",20,x0,y0);
  drawcircle("pink",20,x1,y1);
  ctx.strokeStyle="white";
  ctx.moveTo(x0,y0);
  ctx.lineTo(x0+Math.cos(ang)*1000,y0+Math.sin(ang)*1000);
  ctx.stroke();
*/

  return ang;
}

function drawcircle(color, size, x, y) {
  ctx.fillStyle = color;
  ctx.strokeStyle = "black";
  ctx.linewidth = 100;
  ctx.beginPath();
  ctx.arc(Math.floor(x), Math.floor(y), size, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function compare(a, b) {
  if (a.length != b.length) return false;

  for (i = 0; i < a.length; i++) {
    if (a.charAt(i) != b.charAt(i)) return false;
  }

  return true;
}


var era=0;
function newEra(){

  canvas.style.borderWidth = "1px";
  canvas.style.borderStyle = "solid";
  canvas.style.borderColor = "#EBD601";
  var music = document.getElementById("era");
  const promise = music.play();
  music.volume=0.5;
  setTimeout(()=>{music.pause();music.currentTime = 0;canvas.style.borderColor = "black";},Math.random()*10000+4000);
  food=[];

  for(i=0;i<positions.length;i++){
    age[i]++
    if(health[i]>0){
      health[i]+=100;
      supply[i]+=100-age[i];
      coop[i]++;
    }
  }
  era++;

}

var pand=false;
function comprobationPandemia(){

  var contlives=0;
  for(i=0;i<health.length && contlives<101;i++){
    if(health[i]>0)contlives++;
  }
  if(contlives<100 || Math.floor(Math.random()*100)>98)
    return;
  

  sick=genes[Math.floor(Math.random()*(genes.length))];

  var music=document.getElementById("cough");
  music.play();
  music.volume=0.5;
  pand=true;
  setTimeout(()=>{pand=false},Math.random()*8000+3000);
  
}


var sick="";
function pandemia(){
  if(!pand) return;
  for(i=0;i<positions.length;i++){

    if(health[i]>0 && sick.charAt(1)==genes[i].charAt(1)){
      this.ctx.globalAlpha = 0.8; // fade rate
      this.ctx.globalCompositeOperation = "source-over"
      var img = new Image();
      img.src = "icons/sick.png";
      ctx.drawImage(img, positions[i][0]-25, positions[i][1]-25,25,25);
      this.ctx.globalAlpha = 1; // fade rate

      for(j=0;j<positions.length;j++)
      {
      if(j!=i && distancePeople(i,j)<150)
        health[j]-=0.5;
      }
    }

  }
}

var nightmare=false;
var trotamundos=[];

function actiFear(){

  if(era>7 && Math.floor(Math.random()*100)<30 && !gameOver){

    var num=Math.floor(Math.random()*4+1);
    for(i=0;i<num;i++){
      trotamundos.push([Math.floor(Math.random()*canvas.width),Math.floor(Math.random()*canvas.height),3])
    }
    for(k=1;k>0;k-=0.005){
      musicb.volume=k;
    }
    this.t=-10;
    temperature();
    
    nightmare=true;
    var musicc=document.getElementById("fear");
    musicc.play();
    musicc.volume=0.8;
    setTimeout(()=>{musicc.pause();musicc.currentTime=0;trotamundos=[];nightmare=false;
      musicb.volume=0.5;
    },15000);
  }
}



function war(i){

  var buscar="";

  if(genes[i]==inwar[0])
    buscar=inwar[1];
  else
    buscar=inwar[0];

  

  var mindtc=10000;
  var select=Math.floor(Math.random()*positions.length);
  for(j=0;j<positions.length;j++){
    if(health[j]>0 && i!=j && genes[j]==buscar && distance(positions[i][0],positions[i][1],positions[j][0],positions[j][1])<mindtc){
      select=j;
      mindtc=distance(positions[i][0],positions[i][1],positions[j][0],positions[j][1]);
    }
  }

  var arr=[calcAng(positions[i][0],positions[i][1],positions[select][0],positions[select][1]),select];
  return arr;

}


function startWar(){

  if(!gameOver && era>1 && medcop<0){
    totalwar=true;
    inwar=[];
    inwar.push(genes[Math.floor(Math.random()*genes.length)]);
    inwar.push(genes[Math.floor(Math.random()*genes.length)]);

    for(k=1;k>0;k-=0.005){
      musicb.volume=k;
    }

    var musicc=document.getElementById("war");
    musicc.play();
    musicc.volume=0.8;

    setTimeout(()=>{totalwar=false;inwar=[];musicc.pause();musicc.currentTime=0;musicb.volume=0.5;},Math.random()*25000+10000);
  }

}








function fear(){
  if(!nightmare) return;
  
  this.t=-10;

  //canvas.style.backgroundColor="white";
  
  for(i=0;i<trotamundos.length;i++){
    var v=6/trotamundos[i][2];
    var ang;
    var minDist=10000;
    var select=0;
  //calcular angulo
  for(j=0;j<positions.length;j++){
    if(health[j]>0 && distance(trotamundos[i][0],trotamundos[i][1],positions[j][0],positions[j][1])<minDist){
      minDist=(distance(trotamundos[i][0],trotamundos[i][1],positions[j][0],positions[j][1]));
      select=j;
    }
    if(distance(trotamundos[i][0],trotamundos[i][1],positions[j][0],positions[j][1])<trotamundos[i][2]/3){
      health[j]-=2;
      var music=document.getElementById("whisper");
      music.play();
      music.volume=0.5;

      if(trotamundos[i][2]<15)
        trotamundos[i][2]+=0.05;

    }
  }

  ang=calcAng(trotamundos[i][0],trotamundos[i][1],positions[select][0],positions[select][1]);


  //dibujar
  this.ctx.globalAlpha = Math.random()*0.8+0.1; // fade rate
  this.ctx.globalCompositeOperation = "source-over"
  ctx.shadowBlur=15;
  ctx.shadowColor="rgb(255, 255, 255,10)";//rgb(0, 58, 107,5)
  drawcircle("#3E3E3E", trotamundos[i][2], trotamundos[i][0], trotamundos[i][1]);
  drawcircle(
    "#B70000",
    trotamundos[i][2]/3,
    trotamundos[i][0] + Math.cos(ang - Math.PI / 6) * 10,
    trotamundos[i][1] + Math.sin(ang - Math.PI / 6) * 10
  );ctx.shadowColor="rgb(0, 58, 107,5)";
  drawcircle(
    "white",
    trotamundos[i][2]/7.5,
    trotamundos[i][0] + Math.cos(ang - Math.PI / 8) * 12,
    trotamundos[i][1] + Math.sin(ang - Math.PI / 8) * 12
  );

  drawcircle(
    "#B70000",
    trotamundos[i][2]/3,
    trotamundos[i][0] + Math.cos(ang + Math.PI / 6) * 10,
    trotamundos[i][1] + Math.sin(ang + Math.PI / 6) * 10
  );
  drawcircle(
    "white",
    trotamundos[i][2]/7.5,
    trotamundos[i][0] + Math.cos(ang + Math.PI / 8) * 12,
    trotamundos[i][1] + Math.sin(ang + Math.PI / 8) * 12
  );

  drawcircle(
    "red",
    trotamundos[i][2]/3,
    trotamundos[i][0] + Math.cos(ang - Math.PI / 4) * 18,
    trotamundos[i][1] + Math.sin(ang - Math.PI / 4) * 18
  );
  drawcircle(
    "red",
    trotamundos[i][2]/3,
    trotamundos[i][0] + Math.cos(ang + Math.PI / 4) * 18,
    trotamundos[i][1] + Math.sin(ang + Math.PI / 4) * 18
  );

  drawcircle(
    "red",
    trotamundos[i][2]/3,
    trotamundos[i][0] + Math.cos(ang - Math.PI / 2.5) * 18,
    trotamundos[i][1] + Math.sin(ang - Math.PI / 2.5) * 18
  );
  drawcircle(
    "red",
    trotamundos[i][2]/3,
    trotamundos[i][0] + Math.cos(ang + Math.PI / 2.5) * 18,
    trotamundos[i][1] + Math.sin(ang + Math.PI / 2.5) * 18
  );

  drawcircle(
    "white",
    trotamundos[i][2]/5,
    trotamundos[i][0] + Math.cos(ang + Math.PI / 15) * 18,
    trotamundos[i][1] + Math.sin(ang + Math.PI / 15) * 18
  );

  drawcircle(
    "white",
    trotamundos[i][2]/5,
    trotamundos[i][0] + Math.cos(ang - Math.PI / 15) * 18,
    trotamundos[i][1] + Math.sin(ang - Math.PI / 15) * 18
  );


  this.ctx.globalAlpha = 1; // fade rate
  this.ctx.globalCompositeOperation = "source-over"
  ctx.shadowBlur=0;
    //mover 

  if (
    canvas.width > trotamundos[i][0] + Math.cos(ang) * v &&
    trotamundos[i][0] + Math.cos(ang) * v > 0
  ) {
    trotamundos[i][0] += Math.cos(ang) * v;
  }

  if (
    canvas.height > trotamundos[i][1] + Math.sin(ang) * v &&
    trotamundos[i][1] + Math.sin(ang) * v > 0
  ) {
    trotamundos[i][1] += Math.sin(ang) * v;

  }


  }

}



var godchoose=[];
var god=false;
function godselectionCreate(){
  var option=Math.floor(Math.random()*100);
  if(era>9 && option<20 && !gameOver){
    var x=Math.floor(Math.random()*canvas.width);
    var y=Math.floor(Math.random()*canvas.height);
    godchoose.push([x,y]);
    god=true;
    var music=document.getElementById("monk");
    music.play();
    music.volume=0.2;
    setTimeout(()=>{godchoose=[];music.pause();music.currentTime=0;god=false;},4000);
  }

}

function godSelection(){
  if(!god)return;
  for(i=0;i<godchoose.length;i++){
    for(j=0;j<positions.length;j++){


      if(distance(godchoose[i][0],godchoose[i][1],positions[j][0],positions[j][1])<150){
        if(health[j]<=0)health[j]=100;
        else health[j]+=0.5;
        ctx.globalAlpha =1; // fade rate
        ctx.globalCompositeOperation = "source-over";
        var img = new Image();
        img.src = "icons/biblia.png";
        ctx.drawImage(img, positions[j][0]-25, positions[j][1]-25,25,25);
      
      }
      ctx.globalAlpha =0.4; // fade rate
      ctx.globalCompositeOperation = "source-over";

      // Centro del círculo
      var radius = 150; // Radio del círculo
      var centerX=godchoose[i][0];
      var centerY=godchoose[i][1];

      // Dibujar el círculo
      ctx.strokeStyle="white";
      ctx.beginPath();
      ctx.globalAlpha = Math.random()*0.2+0.1; // fade rate
      ctx.arc(godchoose[i][0], godchoose[i][1], radius, 0, 2 * Math.PI, false);
      //ctx.lineWidth = 2;
      ctx.closePath();
      ctx.stroke();

      ctx.globalAlpha =0.3; // fade rate
      // Dibujar el pentagrama
      var numPoints = 5; // Número de puntas del pentagrama
      var angle = Math.PI / numPoints;
      var innerRadius = radius * Math.sin(angle) / (1 + Math.cos(angle));
      ctx.beginPath();
      ctx.strokeStyle="#DDE800";
      for (var k = 0; k < numPoints; k++) {
          var theta = k * 2 * Math.PI / numPoints;
          var x = centerX + Math.cos(theta) * radius;
          var y = centerY + Math.sin(theta) * radius;
          ctx.lineTo(x, y);
          
          theta += angle;
          x = centerX + Math.cos(theta) * innerRadius;
          y = centerY + Math.sin(theta) * innerRadius;
          ctx.lineTo(x, y);
      }

      ctx.closePath();
      //ctx.lineWidth = 2;
      ctx.stroke();

      
    }
  }

  //ctx.lineWidth = 0.5;
  ctx.shadowBlur = 0; // Tamaño del difuminado de la sombra
  ctx.globalAlpha = 1; // fade rate

}



function cleaner(){

  var positions1 = [];
  var maxTemp1 = [];
  var minTemp1 = [];
  var genes1 = [];
  var coordsFood1 = [];
  var supply1 = [];
  var coop1 = []; //%
  var health1 = [];
  var powerAttack1 = [];
  var lastAng1 = [];
  var rangeVision1=[];
  var stamina1=[];
  var age1=[];

  for(i=0;i<positions.length;i++){

    if(health[i]>0){
      positions1.push(positions[i]);
      maxTemp1.push(maxTemp[i])
      minTemp1.push(minTemp[i]);
      genes1.push(genes[i]);
      coordsFood1.push(coordsFood[i]);
      supply1.push(supply[i])
      coop1.push(coop[i]);
      health1.push(health[i]);
      powerAttack1.push(powerAttack[i]);
      lastAng1.push(lastAng[i]);
      rangeVision1.push(rangeVision[i]);
      stamina1.push(stamina[i]);
      age1.push(age[i]);
    }
  }

  positions = [];
  maxTemp = [];
  minTemp = [];
  genes = [];
  coordsFood = [];
  supply = [];
  coop = []; //%
  health = [];
  powerAttack = [];
  lastAng = [];
  rangeVision=[];
  stamina=[];
  age=[];

  for(i=0;i<positions1.length;i++){
    positions.push(positions1[i]);
    maxTemp.push(maxTemp1[i]);
    minTemp.push(minTemp1[i]);
    genes.push(genes1[i]);
    coordsFood.push(coordsFood1[i]);
    supply.push(supply1[i]);
    coop.push(coop1[i]); //%
    health.push(health1[i]);
    powerAttack.push(powerAttack1[i]);
    lastAng.push(lastAng1[i]);
    rangeVision.push(rangeVision1[i]);
    stamina.push(stamina1[i]);
    age.push(age1[i]);
  }

}



var intro;
function run() {
  clearInterval(intro);
  displaymusic();
  createPopulation(Maxpopulation);
  asignLord();
  setInterval(temperature, 7500);
  setInterval(starve, 2000);
  setInterval(heal, 500);
  setInterval(newEra,60000);
  setInterval(setData,1000);
  setInterval(comprobationPandemia,10000);
  setInterval(cleaner,60000);
  setInterval(godselectionCreate,3000);
  setInterval(actiFear,15500);
  setInterval(startWar,45000);

  setInterval(() => {
    createfood();
    movementImproved();
    spendStamina();
    drawFood();
    search();
    drawWaves();
    toxicZone();
    earthquake();
    wind();
    drawBuilding();
    storm();
    functionbuildings();
    pandemia();
    godSelection();
    fear();
    drawLord();
    drawWar();

    if(gameOver){
      ctx.font = "100px Italic";
      ctx.globalAlpha = Math.random()*0.8+0.6; // fade rate
      ctx.fillStyle="darkred";
      ctx.shadowColor = "cyan"; // Color de la sombra
      ctx.shadowBlur = 50; // Tamaño del difuminado de la sombra
      ctx.fillText("Fallen", canvas.width/2-100, canvas.height/2);
      ctx.shadowBlur = 0; // Tamaño del difuminado de la sombra
      ctx.globalAlpha = 1; // fade rate
    }

  }, 10);
}


window.onload= ()=>{
  intro = setInterval(() => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font = "100px Italic";
    ctx.globalAlpha = Math.random()*0.8+0.6; // fade rate
    ctx.fillStyle="darkred";
    ctx.shadowColor = "cyan"; // Color de la sombra
    ctx.shadowBlur = 50; // Tamaño del difuminado de la sombra
    ctx.fillText("CIVILIZATION", canvas.width/2-310, canvas.height/2);
    ctx.shadowBlur = 0; // Tamaño del difuminado de la sombra
    ctx.globalAlpha = 1; // fade rate
  }, 10);

}





function displaymusic(){
  
  var option=Math.floor(Math.random()*10);

  var contlives=0;
  for(i=0;i<health.length && contlives<5;i++){
    if(health[i]>0)contlives++;
  }

  if(contlives<=5 && contlives>=1){
    musicb.pause();musicb.currentTime=0;
    if(option>4){
      musicb=document.getElementById("hl1");
      musicb.play();
      musicb.volume=0.2;
      setTimeout(()=>{musicb.pause();musicb.currentTime=0;musicb.volume=0.5;displaymusic()},103000);
    }
    else{
      musicb=document.getElementById("hl2");
      musicb.play();
      musicb.volume=0.2;
      setTimeout(()=>{musicb.pause();musicb.currentTime=0;musicb.volume=0.5;displaymusic()},255000);
    }
    return;
  }

  if(contlives==0 && era>1){
    musicb.pause();musicb.currentTime=0;
    musicb=document.getElementById("go");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},241000);
    return;
  }


  //console.log("op: "+option)
  if(option==0){
    musicb=document.getElementById("f1");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},180000);
  }
  else if(option==1){
    musicb=document.getElementById("f2");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},182000);
  }
  else if(option==2){
    musicb=document.getElementById("f3");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},154000);
  }
  else if(option==3){
    musicb=document.getElementById("f4");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},165000);
  }
  else if(option==4){
    musicb=document.getElementById("f5");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},162000);
  }
  var conthous=0;
  for(i=0;i<house.length && conthous<=0;i++){
    if(house[i][2]==true)conthous++;
  }

  if(option==5 || (option>5 && conthous==0) ){
    musicb=document.getElementById("f6");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},157000);
  }


  if(conthous>0 && option>=6){
    musicb=document.getElementById("pg");
    musicb.play();
    setTimeout(()=>{musicb.pause();musicb.currentTime=0;displaymusic()},191000);
  }

  musicb.volume=0.2;

};




var ctxp = document.getElementById('grafico').getContext('2d');
var populationData = {
  labels: [],
  datasets: [{
      label: "Población",
      data: [], // Datos de población en millones
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
  },{
    label: "Incidentes",
      data: [], // Datos de población en millones
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(248, 244, 16, 1)",
      borderWidth: 1
  },{
    label: "Comida",
      data: [], // Datos de población en millones
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(239, 44, 255, 1)",
      borderWidth: 1
  },{
    label: "Cooperacion",
      data: [], // Datos de población en millones
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(62, 255, 0 , 1)",
      borderWidth: 1
  }]
};

var chartOptions = {
  scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          },
          scaleLabel: {
              display: true,
              labelString: 'Población (en millones)' // Etiqueta del eje Y
          }
      }]
  }
};

var populationChart = new Chart(ctxp, {
  type: 'line',
  data: populationData,
  options: chartOptions
});




function setData(){


  if(tempo++%5!=0)return;

  var lives=0;
  for(i=0;i<positions.length;i++){
    if(health[i]>0){
      lives++
      medcop+=coop[i];
    };
  }
  medcop=medcop/lives;
  
  if(lives==0){
    gameOver=true;
  }

  var fd=0;
  for(i=0;i<food.length;i++){
    if(food[i][2]>0)fd++;
  }
  

  populationData.labels.push(tempo);
  populationData.datasets[0].data.push(lives);

  //getInfoIncident();

  var incidents=0;

  if(niebla)incidents++;

  if(heat)incidents++;

  if(cold)incidents++; 

  if(txz.length>0)incidents++; 

  if(quakes.length>0)incidents++; 
  
  if(windwaves.length>0)incidents++;

  if(storms.length>0)incidents++;

  populationData.datasets[1].data.push(incidents);
  populationData.datasets[2].data.push(fd);
  populationData.datasets[3].data.push(medcop);
  populationChart.update();
}
