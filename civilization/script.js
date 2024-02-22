var canvas = document.getElementById("canvas");
var wallpaper = document.getElementById("wallpaper");
var ctx = canvas.getContext("2d");

var Maxpopulation = 5;
var maxTempSupported = 40;
var minTempSupported = -15;

var food = [];

//individuos
var positions = [];
var maxTemp = [];
var minTemp = [];
var genes = [];
var coordsFood = [];
var supply=[];
var coop = []; //%
var health = [];
var powerAttack = [];

var lastAng=[];

canvas.width = 1200;
canvas.height = 700;

var draw=true;

function createPopulation(n) {
  for (i = 0; i < n; i++) {
    positions.push([
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height),
    ]);
    maxTemp.push(
      Math.floor(Math.random() * maxTempSupported + 0)
    );
    minTemp.push(
      Math.floor(Math.random() * maxTempSupported + minTempSupported)
    );
    supply.push(0);
    //genes.push([Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)]);
    genes.push(Math.floor(Math.random()*9));
    coop.push(Math.floor(Math.random() * 100));
    coordsFood.push([0,0]);
    health.push(100);
    powerAttack.push(Math.floor(Math.random() * 10));
    lastAng.push(0);
  }
}

function setChild(i,j){
  positions.push([
    Math.floor((positions[i][0]+positions[j][0])/2),
    Math.floor((positions[i][1]+positions[j][1])/2)
  ]);
  maxTemp.push(
    Math.floor(Math.random() * maxTemp[i] + minTemp[j])
  );
  minTemp.push(
    Math.floor(Math.random() * maxTemp[i] + minTemp[j])
  );
  supply.push(0);
  //genes.push([genes[i][0],genes[j][1],genes[i][2]+genes[j][2]%255]);
  genes.push((genes[i]+genes[j])%9);
  coop.push(Math.floor(Math.random() * coop[j]+coop[i]));
  coordsFood.push([0,0]);
  health.push(100);
  powerAttack.push(Math.floor(Math.random() * powerAttack[j]+powerAttack[i]));
  lastAng.push(0);
}






function distancePeople(i,j){
  return Math.sqrt(Math.pow(positions[i][0]-positions[j][0],2)+Math.pow(positions[i][1]-positions[j][1],2))
}

function distanceFood(i,j){
  return Math.sqrt(Math.pow(positions[i][0]-food[j][0],2)+Math.pow(positions[i][1]-food[j][1],2))
}


function createfood(){

  var proba=Math.floor(Math.random()*100);
  if(proba>80){

    food.push([Math.floor(Math.random()*canvas.width),Math.floor(Math.random()*canvas.height),Math.floor(Math.random()*100)])
  }


}


function drawFood(){
  var colors;
  for(i=0;i<food.length;i++){
    if(food[i][2]>0)colors="red";
    if(food[i][2]>30)colors="yellow";
    if(food[i][2]>50)colors="blue";
    if(food[i][2]>80)colors="white";

    if(food[i][2]>0){
      drawcircle(colors,5,food[i][0],food[i][1]);
    }
  }

}


function search(){

  for (i = 0; i < positions.length; i++) {

    if(supply[i]==0){
      coordsFood[i][0]=0;
      coordsFood[i][1]=0;
    }

    for (j = 0; j < food.length; j++) {

      if(health[i]>0 && food[j][2]>0 && distanceFood(i,j)<100){

        if(draw){
          ctx.strokeStyle="white";
          ctx.beginPath();
          ctx.moveTo(positions[i][0],positions[i][1]);
          ctx.lineTo(food[j][0],food[j][1]);
          ctx.stroke();
          ctx.closePath();
        }
        coordsFood[i]=[food[j][0],food[j][1]];
        food[j][2]--;
        supply[i]++;
      }
    }

    for (j = 0;i!=j && j < positions.length; j++) {

      if(health[j]>0 && health[i]>0 && distancePeople(i,j)<100){

        
        var num=Math.floor(Math.random()*100);
        if(num>coop[i] || supply[i]==0){ //eliminar 

          health[j]-=powerAttack[i];
          if(draw){
            ctx.strokeStyle="red";
            ctx.beginPath();
            ctx.moveTo(positions[i][0],positions[i][1]);
            ctx.lineTo(positions[j][0],positions[j][1]);
            ctx.stroke();
            ctx.closePath();
          }

        }else if(num<=coop[i] || genes[i]==genes[j]){//cooperar
          coordsFood[j][0]=coordsFood[i][0];
          coordsFood[j][1]=coordsFood[i][1];


          if(supply[i]>50 && supply[j]>50 && (genes[i]!=genes[j]) ){
            setChild(i,j);
            supply[i]-=50;
            supply[j]-=50;

          }
          //fijarse en este orden primero buscaran procrear
          if(supply[i]>0 && health[j]<100){
            var help=Math.floor(Math.random()*supply[i]);  
            health[j]+=help;
            supply[i]-=help;
           }
          if(draw){
            ctx.strokeStyle="blue";
            ctx.beginPath();
            ctx.moveTo(positions[i][0],positions[i][1]);
            ctx.lineTo(positions[j][0],positions[j][1]);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }



  }


}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < positions.length; i++) {
    if(health[i]>0){

      var color=["#4DEB88","#49AAEB","#EBD84D","#D7EBBD","#EB5B4D","#EBAC4D","#EB3934","#EB4DA4","#3D34EB","white"];
      
      //var colors=genes[i][0]+","+genes[i][1]+","+genes[i][2];

      drawcircle(color[genes[i]%9], 15, positions[i][0], positions[i][1]);
      
      ctx.font="14pt Verdana";
      ctx.fillStyle = "white";
      if(draw){
        ctx.beginPath();
        ctx.fillText("Ht:"+health[i],positions[i][0]+10,positions[i][1]-10);
        ctx.fillText("Fo:"+supply[i],positions[i][0]+10,positions[i][1]-25);
        ctx.fillText("Ge:"+genes[i],positions[i][0]+10,positions[i][1]-40);
        ctx.fillText("MT:"+maxTemp[i],positions[i][0]+10,positions[i][1]-55);
        ctx.fillText("mT:"+minTemp[i],positions[i][0]+10,positions[i][1]-70);
        ctx.fillText("At:"+powerAttack[i],positions[i][0]+10,positions[i][1]-85);
        ctx.closePath();
      }
    }
      
  }
}

function movementImproved() {
  

  for (i = 0; i < positions.length; i++) {
  
    var ang=Math.random()*(Math.PI*3/2)+lastAng[i];
    lastAng[i]=ang;
    var v=Math.floor(Math.random()*20);
    

    if(canvas.width>positions[i][0]+Math.cos(ang)*v && positions[i][0]+Math.cos(ang)*v>0){
      positions[i][0]+=Math.cos(ang)*v;}

    if(canvas.height>positions[i][1]+Math.sin(ang)*v && positions[i][1]+Math.sin(ang)*v>0){
      positions[i][1]+=Math.sin(ang)*v;}


  }
}



function temperature(){
  canvas.style.borderWidth="5px";
  canvas.style.borderStyle="solid";
  var t=Math.floor(Math.random()*40-25);
  console.log(t);
  if(t<0)
    canvas.style.borderColor="#97DCE8";
  else if(t>30)
    canvas.style.borderColor="#EFA35E";
  else
    canvas.style.borderColor="black";
  
  for(i=0;i<positions.length;i++){

    if(maxTemp[i]<t || t<minTemp[i]){
      health[i]-=Math.floor(Math.random()*80+10);
    }
  }

}

function starve(){

  for(i=0;i<positions.length;i++){
    if(health[i]>0 && supply[i]==0){
      health[i]-=Math.floor(Math.random()*5);
    }
  }

}

function heal(){

  for(i=0;i<positions.length;i++){
    if(health[i]>0 && health[i]<100 && supply[i]>0){
      health[i]+=supply[i];
      if(health[i]>100)health[i]=100;
      supply[i]=0;
    }
  }

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

function run() {
  //displaymusic();
  createPopulation(Maxpopulation);

  setInterval(temperature,10000);
  setInterval(starve,5000);
  setInterval(heal,15000);

  setInterval(() => {
    
    
    createfood();
    drawScene();
    drawFood();
    search();
    movementImproved();

    
  }, 10);
}

var displaymusic = () => {
  var music = document.getElementById("music");
  const promise = music.play();

  if (promise !== undefined) {
    promise
      .then(() => {
        // Autoplay started
      })
      .catch((error) => {
        // Autoplay was prevented.
        music.muted = true;
        music.play();
      });
  }
};
