// portfolio site script
// slide show

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "flex";
  dots[slideIndex-1].className += " active";
  
}


// canvas demos

function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) 
       + Math.pow(yDistance, 2));
};

// CANVAS 1 DEMO

const canvas1 = document.getElementById('canvas1');
canvas1.height = 210;
canvas1.width = 340;
canvas1.style.width = 210;
canvas1.style.height = 340;

const ctx1 = canvas1.getContext('2d');
let rect1 = canvas1.getBoundingClientRect();

class Circle{
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  };

  draw() {
    ctx1.beginPath();
    ctx1.fillStyle = this.color;
    ctx1.arc(this.x, this.y, this.radius, Math.PI*2, false);
    ctx1.fill();
    ctx1.closePath();
  }
};

let mouse1 = {x: 200, y: 200};
canvas1.addEventListener('mousemove', (event)=> { 
  rect1 = canvas1.getBoundingClientRect();
  mouse1.x = event.clientX - rect1.left;
  mouse1.y = event.clientY - rect1.top;
});

let circle1 = new Circle(canvas1.width/2, canvas1.height/2, 20, 'green');
let circle2 = new Circle(10, 10, 10, 'blue');
circle1.draw();
circle2.draw();

function animate1(){
  animRe1 = requestAnimationFrame(animate1);
  ctx1.clearRect(0,0,canvas1.width, canvas1.height);
  circle2.x = mouse1.x;
  circle2.y = mouse1.y;
  if  (getDistance(circle1.x, circle1.y, circle2.x, circle2.y)< (circle1.radius + circle2.radius)) {
    circle1.color = "darkred";
  }else {circle1.color = 'green'};
  circle1.draw();
  circle2.draw();
};

// CANVAS 2 DEMO

const canvas2 = document.getElementById('canvas2');
canvas2.height = 210;
canvas2.width = 340;
canvas2.style.width = 210;
canvas2.style.height = 340;

const ctx2 = canvas2.getContext('2d');
let rect2 = canvas2.getBoundingClientRect();

function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
  }
};

class CircleMaker2{
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {x:1, y:1};
    this.mass = 1;
  };

  draw() {
    ctx2.beginPath();
    ctx2.fillStyle = this.color;
    ctx2.arc(this.x, this.y, this.radius, Math.PI*2, false);
    ctx2.fill();
    ctx2.closePath();
  }

  update(circles) {
    for (let i = 0; i < 6; i++) {
      if (this === circles[i]) continue;
      if (getDistance(this.x, this.y, circles[i].x, circles[i].y) - this.radius * 2 < 0) {
        resolveCollision(this, circles[i]);
        this.color = colors[Math.floor(Math.random()*3)];
    }};
    if (this.x + this.radius >= canvas2.width || this.x - this.radius <= 0){
      this.velocity.x = -this.velocity.x
    };
    if (this.y + this.radius >= canvas2.height || this.y - this.radius <= 0) {
      this.velocity.y = -this.velocity.y
    };
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
};

let circles = [];
let colors = ['red', 'green', 'blue'];

for (let i = 0; i < 6; i++) {
  let x = (Math.random()*100) + 30;
  let y = (Math.random()*60) +20;
  let color = colors[Math.floor(Math.random()*3)];
  circles.push(new CircleMaker2(x, y, 15, color));
  circles[i].draw();
}

function animate2() {
  animRe2 = requestAnimationFrame(animate2);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  for (let i = 0; i < circles.length; i++) {
    circles[i].update(circles);
  }
}

animate1();
animate2();
