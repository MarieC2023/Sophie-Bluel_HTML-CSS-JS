////////////////////////////////
///// Gestion de la modale /////
////////////////////////////////

    ////////////////////////////////////
    ///// Récupération des oeuvres /////
    ////////////////////////////////////

// Fonction pour récupérer les oeuvres depuis l'API pour la mini Galerie
async function fetchWorksForModal() {
    try {
        // Requête pour récupérer les données depuis l'API
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();

        // Générer les éléments HTML pour la galerie
        let display = "";
        for (let figure of data) {
            display += `
                <figure id="modal-figure-${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <i class="fa-solid fa-trash-can delete-btn"></i>
                </figure>
            `;
        }

        // Injecter le contenu dans la galerie modale
        document.querySelector(".modal-gallery").innerHTML = display;
    } catch (err) {
        console.error("Une erreur est survenue lors du chargement des images : ", err);
    }
}


    //////////////////////////////////////////////////////
    ///// Gestion ouverture / fermeture de la modale /////
    //////////////////////////////////////////////////////

const modalContent = document.getElementById("modal-dialog");
const modalTriggers = document.querySelectorAll(".modal-trigger"); 

// Fonction pour ouvrir/fermer la modale
modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

// Fonction pour fermer la modale via l'overlay en complément de la fonction toogleModal
document.querySelector('dialog').addEventListener('click', function(e) {
    if(e.target === this) {
      this.close();
    }
  });

function toggleModal(event) {
  event.preventDefault(); // Empêche les comportements par défaut des liens
  
  // Vérifie si la modale est déjà ouverte
  if (modalContent.hasAttribute("open")) {
    modalContent.close(); 
  } else {
    modalContent.showModal(); 
    // Charger la galerie photo dans la modale
    fetchWorksForModal();
  }
}

    /////////////////////////////////////////////
    ///// Gestion de la suppression d'image /////
    /////////////////////////////////////////////




    //////////////////////////////////////
    ///// Gestion de l'ajout d'image /////
    //////////////////////////////////////
