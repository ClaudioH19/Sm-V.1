var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 700;

//data
var positions = [];
var velocities = [];
var color = [];
var size = [];
var puntos=[];
var distances=[];

//chaos
var colisionsCount=0;
var colisions=[[0,0]];

//ADJUST PARTICLES
var maxpart = 10;
var maxsize = 15;
maxsize=5;
var minsize = 5;
var regulador=100;

//force
var k = 0.01;
var potency=1; //2 for gravity 1 for electricity

//path
var probabilidadguardar=100;

//friccion borde
var beta = 1.7; //controla el rebote 2 elastico
var maxV=100;
var fr=0.0001;//friccion campo 
//fr=1;       ;

//range density
var clouster=100;

//inner repulsion
var alfa=1.7;


//view
var draw=false;
var chaos=false;
//##############################################################################################################################
//##############################################################################################################################
//##############################################################################################################################
//##############################################################################################################################
//##############################################################################################################################


function createPart() {
  
  var arr=[];
  if(chaos)
    arr = ["white","red"];
  else
    arr = ["red","blue"];

  for (let index = 0; index < maxpart; index++) {
    positions[index] = [
      Math.floor(Math.random() * (canvas.width-regulador)+regulador),
      Math.floor(Math.random() * (canvas.height-regulador)+regulador),
    ];
    velocities[index] = [0, 0];
    color[index] = arr[Math.floor(Math.random() * arr.length)];
    size[index] = Math.floor(Math.random() * maxsize) + minsize;

  }
  distances=[];
  for(i=0;i<positions.length;i++){
    distances.push([[]*positions.length-1]);
  }

}

function createQ(event){

  var x=event.clientX-165;
  var y=event.clientY-10;
  var arr=[]

  if(chaos)
    arr = ["blue"];
  else
    arr = ["red","blue"];

    positions.push([x,y]);
    velocities.push([0,0]);
    color.push(arr[Math.floor(Math.random() * arr.length)]);

    if(potency==1)
      size.push(minsize);
    else
      size.push(Math.floor(Math.random() * maxsize) + minsize);


      distances=[];
      for(i=0;i<positions.length;i++){
        distances.push([[]*positions.length-1]);
      }
    

}

function foton(caso,x,y){

  var ratio=0.35;
  positions.push([x,y]);
  velocities.push([velocities[caso][0]*ratio,velocities[caso][0]*ratio]);

  color.push("yellow");
  size.push(2);


  distances=[];
  for(i=0;i<positions.length;i++){
    distances.push([[]*positions.length-1]);
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

function drawPart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < positions.length; index++) {
    drawcircle(
      color[index],
      size[index],
      positions[index][0],
      positions[index][1]
    );
  }
}


lastColisionsCounter=0;
function colisionsZone(){

  for(i=0;i<colisions.length;i++){

    if(colisionsCount-lastColisionsCounter>20) //danger
      ctx.fillStyle = "#a9000099";
    else if(colisionsCount-lastColisionsCounter<10) //good
      ctx.fillStyle="#1ac5007c";
    else 
      ctx.fillStyle = "#f5b1319d"; //possible danger

    ctx.linewidth = 100;
    ctx.beginPath();
    ctx.arc(colisions[i][0], colisions[i][1], clouster, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  colisions=[];
  lastColisionsCounter=colisionsCount;
}


function density(i,j){

  var errorRatio=0;

  if(chaos){

    var caso=0;
    var ccaso=false;
    var num=0;
    if((compare(color[i],"blue") && compare(color[j],"red") ) ||  (compare(color[i],"red") && compare(color[j],"blue") )){
      alfa=2;
      errorRatio=5;
      ccaso=true;
      num=Math.floor(Math.random()*100);
      
      if((compare(color[i],"blue")))
        caso=i;
      else
        caso=j;
    }
    else if(compare(color[i],"yellow") || compare(color[j],"yellow") || (compare(color[i],"blue") && compare(color[j],"white") ) ||  (compare(color[i],"white") && compare(color[j],"blue") )){
      alfa=2;
    }
    else{
      alfa=1.55;
    }

    var transfer=100000;
    if(distances[i][j]<=size[i]+errorRatio || distances[i][j]<=size[j]+errorRatio){
      if(ccaso && num>65)
        //foton(caso,(positions[i][0]+positions[j][0])/2,(positions[i][1]+positions[j][1])/2);

      velocities[j][0] += -alfa*velocities[j][0] - velocities[i][0]/transfer;
      velocities[j][1] += -alfa*velocities[j][1] - velocities[i][1]/transfer;
    
      velocities[i][0] += -alfa*velocities[i][0] - velocities[j][0]/transfer;
      velocities[i][1] += -alfa*velocities[i][1] - velocities[j][1]/transfer;

      colisionsCount++;
      //colisions[0]=[(positions[i][0]+positions[j][0])/2,(positions[i][1]+positions[j][1])/2];
      colisions.push([(positions[i][0]+positions[j][0])/2,(positions[i][1]+positions[j][1])/2]);
    }
    
    return;
  
  }

  

  if(distances[i][j]<=size[i]+errorRatio || distances[i][j]<=size[j]+errorRatio){

    velocities[j][0] += -alfa*velocities[j][0];
    velocities[j][1] += -alfa*velocities[j][1];
    
    velocities[i][0] += -alfa*velocities[i][0];
    velocities[i][1] += -alfa*velocities[i][1];

    if(draw){
      ctx.strokeStyle = "yellow";
      ctx.linewidth = 100;
      ctx.beginPath();
      ctx.arc(positions[i][0], positions[i][1], clouster, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(positions[j][0], positions[j][1], clouster, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }

    if(draw && distances[i][j]!=0 && distances[i][j]<clouster){

      ctx.strokeStyle = "white";
      ctx.linewidth = 100;
      ctx.beginPath();
      ctx.arc(positions[i][0], positions[i][1], clouster, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(positions[j][0], positions[j][1], clouster, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
    }
 
}



function CalcInner(i,j,radio){
  if(chaos){

    partinside=0;
    for(l=0;l<distances.length;l++){
      if(distances[i][l]<radio+size[i] && l==j){
        partinside++;
      }
    }

    if(partinside>=1){
      return true
    }

    return false;
  }
}







function stopMovement(i){
  if(velocities[i][0]==0 || velocities[i][1]==0)return;

  velocities[i][0]+=(velocities[i][0]/Math.abs(velocities[i][0]))*-fr;
  velocities[i][1]+=(velocities[i][1]/Math.abs(velocities[i][1]))*-fr;
}


function drawVector(i,j,ang,mod,d){
  var adj=1000/Math.sqrt(mod);

  ctx.strokeStyle = "white";
      ctx.beginPath();

      //part 1
      ctx.moveTo(positions[i][0], positions[i][1]);

      if(d  || potency==2 ){
        ctx.lineTo(positions[i][0]+adj*mod*Math.cos(ang), positions[i][1]-adj*mod*Math.sin(ang));
      }
      else{
        ctx.lineTo(positions[i][0]-adj*mod*Math.cos(ang), positions[i][1]+adj*mod*Math.sin(ang));
      }

      //part 2
        ctx.moveTo(positions[j][0], positions[j][1]);

        if(d  || potency==2){
          ctx.lineTo(positions[j][0]-adj*mod*Math.cos(ang), positions[j][1]+adj*mod*Math.sin(ang));
        }
        else{
          ctx.lineTo(positions[j][0]+adj*mod*Math.cos(ang), positions[j][1]-adj*mod*Math.sin(ang));
        }

      ctx.stroke();
      ctx.closePath();
}

function force() {
  
  for (let i = 0; i < positions.length ; i++) {
    for (let j = 0;j!=i && j < positions.length; j++) {
      var dtcx = positions[i][0] - positions[j][0];
      var dtcy = positions[i][1] - positions[j][1];
      var dtc=Math.sqrt(Math.pow(dtcx,2)+Math.pow(dtcy,2));
      var mod=(k*size[i]*size[j])/(Math.pow(dtc,potency));
      var ang=(Math.atan(Math.abs(dtcy/dtcx)));
      
      //guardar distancias
      distances[i][j]=dtc;
    
      ang=adjustAng(dtcx,dtcy,ang);
 
      if(draw)
        drawVector(i,j,ang,mod,Math.abs(color[i].localeCompare(color[j])));


      forceMod(i,j,mod,ang,CalcInner(i,j,100));
      density(i,j);

      positions[j][0] += velocities[j][0];
      positions[j][1] += velocities[j][1];
    
      validationB(j);
    }


      positions[i][0] += velocities[i][0];
      positions[i][1] += velocities[i][1];
    

      stopMovement(i);
      validationB(i);

      if(draw)
        drawPath(i);
  }

}


function forceMod(i,j,mod,ang,innerRad){

  if(potency==1 && !chaos){

    if(Math.abs(color[i].localeCompare(color[j]))){//1 distitnos atraccion
      velocities[i][0]+=mod*Math.cos(ang);
      velocities[i][1]+=-mod*Math.sin(ang);

      velocities[j][0]+=-mod*Math.cos(ang);
      velocities[j][1]+=mod*Math.sin(ang);
    }
    else{
      velocities[i][0]+=mod*Math.cos(ang)*-1;
      velocities[i][1]+=-mod*Math.sin(ang)*-1;

      velocities[j][0]+=mod*Math.cos(ang);
      velocities[j][1]+=-mod*Math.sin(ang);
    }

  }

  else if(potency==2){//gravity
  
    velocities[i][0]+=mod*Math.cos(ang);
    velocities[i][1]+=-mod*Math.sin(ang);

    velocities[j][0]+=-mod*Math.cos(ang);
    velocities[j][1]+=mod*Math.sin(ang);
  
  }

  else if(chaos){//chaos

    if(innerRad && ((compare(color[i],"white") && compare(color[j],"red")) || (compare(color[i],"red") && compare(color[j],"white")))){

      velocities[i][0]+=0.8*mod*Math.cos(ang);
      velocities[i][1]+=0.8*-mod*Math.sin(ang);

      velocities[j][0]+=0.8*-mod*Math.cos(ang);
      velocities[j][1]+=0.8*mod*Math.sin(ang);
    }

    if(innerRad && ((compare(color[i],"blue") && compare(color[j],"red")) || (compare(color[i],"red") && compare(color[j],"blue")))){

      velocities[i][0]+=0.9*mod*Math.cos(ang);
      velocities[i][1]+=0.9*-mod*Math.sin(ang);

      velocities[j][0]+=0.9*-mod*Math.cos(ang);
      velocities[j][1]+=0.9*mod*Math.sin(ang);
    }

    if(innerRad && ((compare(color[i],"white") && compare(color[j],"white")))){

      velocities[i][0]+=0.00*mod*Math.cos(ang);
      velocities[i][1]+=0.00*-mod*Math.sin(ang);

      velocities[j][0]+=0.00*-mod*Math.cos(ang);
      velocities[j][1]+=0.00*mod*Math.sin(ang);
    }

    else if(innerRad && (compare(color[i],color[j]) || compare(color[j],color[i])) ){
      //repulsion
      velocities[i][0]+=0.65*-mod*Math.cos(ang);
      velocities[i][1]+=0.65*mod*Math.sin(ang);

      velocities[j][0]+=0.65*mod*Math.cos(ang);
      velocities[j][1]+=0.65*-mod*Math.sin(ang);
    }


  }
}



function compare(a,b){

  if(a.length!=b.length) return false;

  for(i=0;i<a.length;i++){
    if(a.charAt(i)!=b.charAt(i)) return false;
  }

  return true;

}


function adjustAng(dtcx,dtcy,ang){
  if(dtcx<0 && dtcy>0){ //arriba derecha
      
  }
  else if(dtcx>0 && dtcy>0){ //arriba izq
    ang=Math.PI/2-ang;
    ang+=Math.PI/2;
  }
  else if(dtcx>0 && dtcy<0){ //abajo izq
    ang+= Math.PI;
  }
  else if(dtcx<0 && dtcy<0){ //abajo der
    ang=Math.PI/2-ang;
    ang+=Math.PI*3/2;
  }
  return ang;
}


//validation with borders
function validationB(i){
  if(positions[i][0]>=canvas.width || positions[i][0]<=0)
  velocities[i][0] += -beta*velocities[i][0];

  if(positions[i][1]>=canvas.height || positions[i][1]<=0)
    velocities[i][1] += -beta*velocities[i][1];

}


var cont=0;
function drawPath(x){

  if(cont+1==9007199254740991)cont=0;

  if(Math.floor(Math.random()*100+0)<probabilidadguardar)
      {
        puntos[cont%100]=[positions[x][0],positions[x][1]];
        //puntos.push([positions[x][0],positions[x][1]]);
      }

  for (let i = 0; i < puntos.length; i++) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.linewidth = 1;
    ctx.beginPath();
    ctx.arc(puntos[i][0], puntos[i][1], 1, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  cont++;
}


function reset(){
  positions = [];
  velocities = [];
  color = [];
  size = [];
  puntos=[];
  cont=0;
  distances=[];
  
}


function run(event) {

  var tecla=event.which || event.keyCode;
  console.log(tecla);
  if(tecla==99){
    if(chaos)chaos=false;
    else
      chaos=true;
    return;
  }
  if(tecla==100){
    if(draw)draw=false;
    else
      draw=true;
    return;
  }

  reset();
  createPart();
  displaymusic();
  
  setInterval(colisionsZone,50);

  setInterval(() => {
    drawPart();
    force();
  }, 10);
}






var displaymusic= ()=>{
  var music = document.getElementById("music");
  const promise = music.play();

  if(promise !== undefined){
      promise.then(() => {
          // Autoplay started
      }).catch(error => {
          // Autoplay was prevented.
          music.muted = true;
          music.play();
      });
  };
}
