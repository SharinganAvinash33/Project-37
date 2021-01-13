var dog, happyDog, sadDog;
var foodstock;
var foodS;
var foodButton,feedButton,fedTime,lastFed,food;
var time;

function preload(){
  happyDog=loadImage("img/Happy.png");
  sadDog=loadImage("img/Dog.png");
  bedImg=loadImage("img/Bed Room.png");
  gardImg=loadImage("img/Garden.png");
  washImg=loadImage("img/Wash Room.png")

}

function setup() {
  createCanvas(800, 500);
  time=hour()
  dog=createSprite(600,200,50,50);
  dog.addImage(sadDog)
  dog.scale=0.5
  database=firebase.database();
  
  foodstock=database.ref('Dog/Food/Milk');
  foodstock.on("value",(data)=>{
    foodS=data.val();
    if(foodS<0){
      foodS=0
    }
    foodstock=foodS;
    console.log(foodS)
  });
  food=new Food();
  foodButton=createButton("Add Food");
  feedButton=createButton("Feed Dog")
  foodButton.position(200,15)
  feedButton.position(300,15)
  foodButton.mousePressed(addFood)
  feedButton.mousePressed(feedDog);
  fedTime=database.ref('Dog/Food/FedTime')
  fedTime.on("value",(data)=>{
    lastFed=data.val();
  })
  gameState=database.ref('Dog/Food/GameState');
  gameState.on("value",(data)=>{
    gameS=data.val();
    gameState=gameS;
    console.log(gameState);
  })
}


function draw() {  
  background(46,139,87)
  if(foodS!==undefined){
  textSize(20)
  text("Food:"+foodstock,20,20)

  food.display();
  fill(255)
  textSize(20);
  if(lastFed>=12){
    text("Last Fed:"+lastFed%12+"PM",350,30);
  }else if(lastFed===0){
    text("Last Fed:12 AM",350,30)
  }else{
    text("Last Feed:"+lastFed+"AM",350,30);
  }

  drawSprites();
  if(gameState!=="Hungry"){
    feedButton.hide();
    foodButton.hide();
    dog.remove();
  }else{
    feedButton.show();
    foodButton.show();
    dog.addImage(sadDog);
  }
  if(time===lastFed+1){
    gameState="Playing";
    food.garden();
    database.ref('Dog/Food').update({
      GameState:"Playing"
    })
  }else if(time===lastFed+2){
    food.bedroom();
    gameState="Sleeping";
    database.ref('Dog/Food').update({
      GameState:"Sleeping"
    })
  }else if(time>lastFed+2&&time<lastFed+4){
    food.washroom();
    gameState="Bathing";
    database.ref('Dog/Food').update({
      GameState:"Bathing"
    })
  }else{
    gameState="Hungry";
    database.ref('Dog/Food').update({
      GameState:"Hungry"
    })
    dog.addImage(sadDog);
    food.display();
  }
 
  }
}

function feedDog(){
  foodstock=foodstock-1;
  if(foodstock<0){
    foodstock=0
  }
  
  dog.addImage(happyDog);
  
  //time=hour();
  food.updateFoodStock(-1)
  database.ref('Dog/Food').update({
    'Milk':foodstock,
    'FedTime':time
  })
  
}
function addFood(){
  foodstock++;
  database.ref('Dog/Food').update({
    'Milk':foodstock
  })
 food.updateFoodStock(+1)

   database.ref('Dog/Food').update({
     'Milk':foodstock,
     'FedTime':time
   })
}