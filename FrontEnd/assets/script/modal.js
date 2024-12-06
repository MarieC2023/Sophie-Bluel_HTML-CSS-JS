// Fonction pour récupérer les oeuvres depuis l'API pour la mini Galerie
async function fetchWorksForModal() {
    try {
        // Requête pour récupérer les données depuis l'API
        const response = await fetch("http://localhost:5678/api/works")
        const data = await response.json()

        // Générer les éléments HTML pour la galerie
        let display = ""
        for (let figure of data) {
            display += `
                <figure id="modal-figure-${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <i class="fa-solid fa-trash-can delete-btn"></i>
                </figure>
            `
        }

        // Injecter le contenu dans la galerie modale
        document.querySelector(".modal-gallery").innerHTML = display;
    } catch (err) {
        console.error("Une erreur est survenue lors du chargement des images : ", err)
    }
}


//const modalContent = document.getElementById("modal")
const modalContent = document.querySelector(".modal-container")
const modalTriggers = document.querySelectorAll(".modal-trigger")

// Ouverture et fermeture de la modale
modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal(){
    modalContent.classList.toggle("active")

    if (modalContent.classList.contains("active")) {
        // Charger la galerie photo dans la modale
        fetchWorksForModal()
    }
}

