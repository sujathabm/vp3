
var dog;
var happyDog;
var database;
var foodS=0;
var foodStock;
var assign=0;
var button;
var fedTime;
var lastFed;
var readState;
var gameState=0;
var bedroom,garden,washroom;
var Playing;
var Sleeping;
var Bathing;

function preload()
{
  dogImage=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/Happy.png");
  bedroom=loadImage("Images/Bed Room.png");
  garden=loadImage("Images/Garden.png");
  washroom=loadImage("Images/Wash Room.png");
}

function setup() {
  database=firebase.database();

  createCanvas(400,500);

  foodStock=database.ref("food");
  foodStock.on("value",function(data){
    foodS=data.val();
  });

  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  
  dog=createSprite(200,400,150,150);
  dog.addImage(dogImage);
  dog.scale=0.15
  

  foodObj=new Food();

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods)

  



  
}


function draw() { 
 

  //if(keyWentDown(UP_ARROW))
  //{
  // assign=assign+20;
  //  writeStock(assign);
  //  dog.addImage(happyDog);
  //}


 //foodObj.display();

 
 currentTime=hour();
 if(currentTime==(lastFed+1))
 {
   update("Playing");
   foodObj.garden();
 }else if(currentTime==(lastFed+2))
 {
   update("Sleeping");
   foodObj.bedroom();

 }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4))
 {
   update("Bathing");
   foodObj.washroom();
 }else{
   update("Hungry");
   foodObj.display();
 }

 if(gameState!="Hungry")
 {
   feed.hide();
   addFood.hide();
   dog.remove();

 }
 else{
   feed.show();
   addFood.show();
   dog.addImage(dogImage);
 }

 

  drawSprites();
  

}

function readStock(data)
{
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.red('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),

  })


}

function writeStock(data)
{
  database.ref("/").set({
    food:data,

  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS,
    
  })
}

function update(state)
{
  database.ref('/').update({
    gameState:state,
  });
}





