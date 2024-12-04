//const modalContent = document.getElementById("modal")
const modalContent = document.querySelector(".modal-container")
const modalTriggers = document.querySelectorAll(".modal-trigger")

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal(){
    modalContent.classList.toggle("active")
}