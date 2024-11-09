// SLOT MACHINE GAME CREATED BY ME!!!

var items = ["cherry.jpg", "lemon.png", "lime.jpg", "star.jpg", "mushroom.jpg", "banana.jpg", "dollar.jpg"]
var slot1, slot2, slot3;
var X, Y, Z;
var credits = 100;
const gameMessage = document.getElementById("gameMessage");

function updateImage(elemId, newSrc, timeout) {
  const slot = document.getElementById(elemId);

  slot.classList.add("fade-out");

  setTimeout(() => {
    slot.src ="./images/"+ newSrc; 
    slot.classList.remove("fade-out"); 
  }, timeout); 
}
 
function restoreCredits() {
  credits = 100;
  updateImage("slot1", "insertcoin.jpg", 200);
  updateImage("slot2", "insertcoin.jpg", 200);
  updateImage("slot3", "insertcoin.jpg", 200);
  document.getElementById("credits").innerHTML = credits;
  document.getElementById("newGame").classList.add("hide");
  gameMessage.innerHTML = "&#128526"

}

function spin() {
  gameMessage.innerHTML = "&#128565;"
  if (credits == 0 ) {
    console.log("no more spins");
  }
  
  else {
    credits -= 25;
    document.getElementById("credits").innerHTML = credits;
    X = Math.floor(Math.random() * 7);
    Y = Math.floor(Math.random() * 7);
    Z = Math.floor(Math.random() * 7);
    slot1 = items[X];
    slot2 = items[Y];
    slot3 = items[Z];
    updateImage("slot1", slot1, 200);
    updateImage("slot2", slot2, 400);
    updateImage("slot3", slot3, 600);
    
    if ((slot1 == slot2) && (slot1 == slot3)) {
      console.log("WINNER WINNER CHICKEN DINNER!");
      setTimeout(() => {
        gameMessage.innerHTML = "&#128514; winner winner chicken dinner!!"

      },1000);
      
      credits += 300;

    }

    else if ((slot1 == slot2) || (slot2 == slot3) || (slot1 == slot3)) {
      console.log("winner");
      setTimeout(() => {
        gameMessage.innerHTML = "&#128513; Winner!"

      },1000);
      
      credits += 50;
    }

    else {
      setTimeout(() => {
        gameMessage.innerHTML = "&#128534"
    
      },1000);
    }
      

    console.log(items);
    console.log(X, Y, Z);
    console.log(slot1, slot2, slot3);

    setTimeout(() => {
      document.getElementById("credits").innerHTML = credits;
      if (credits == 0) {
        gameMessage.innerHTML = "&#128550;"
        alert("Better Luck Next Time");
        const newGame = document.getElementById("newGame");
        newGame.classList.remove("hide");

      }
      
    },1000);

  }

}