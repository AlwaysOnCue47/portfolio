// portfolio website script

function showContactBox() { // this functions removes the "hide" class from the contact section making the element visable
  document.getElementById("contact-section").classList.remove("hide");
}

function hideContactBox() { // this function adds the hide element to the class of the contact section setting it's display to none
  document.getElementById("contact-section").classList.add("hide");
}