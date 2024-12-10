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

    const openButton = document.querySelector("[data-open-modal");
    const closeButton = document.querySelector("[data-close-modal");
    const modal = document.querySelector("[data-modal");
    
    // Ouverture de la modale et chargement de la galerie
    openButton.addEventListener("click", () => {
      modal.showModal();
      fetchWorksForModal();
    })
    
    // Fermeture de la modale
    closeButton.addEventListener("click", () => {
      modal.close();
    })

    
// Fermer la modale en cliquant sur l'overlay
    // Utilisation de la méthode "getBoundingClientRect()" 
    // qui retourne l'objet avec ses dimensions et les coordonnées de l'élément
modal.addEventListener("click", (e) => {
  const dialogDimensions = modal.getBoundingClientRect();
  if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
  ) {
      modal.close();
  }
});


    /////////////////////////////////////////////
    ///// Gestion de la suppression d'image /////
    /////////////////////////////////////////////


    // const deleteBtns = document.querySelectorAll('.delete-btn');
    // deleteBtns.forEach(btn => {
    //     btn.addEventListener('click', function(e) {
    //         const figureId = e.target.closest('figure').id.replace('modal-figure-', '');
    //         // Appel à l'API pour supprimer l'image, puis mise à jour de la galerie
    //         deleteImage(figureId);
    //     });
    // });
    
    // async function deleteImage(figureId) {
    //     try {
    //         const response = await fetch(`http://localhost:5678/api/works/${figureId}`, {
    //             method: 'DELETE',
    //         });
    //         if (response.ok) {
    //             document.querySelector(`#modal-figure-${figureId}`).remove();
    //         } else {
    //             console.error("Erreur lors de la suppression de l'image.");
    //         }
    //     } catch (err) {
    //         console.error("Erreur API lors de la suppression : ", err);
    //     }
    // }
    

    //////////////////////////////////////
    ///// Gestion de l'ajout d'image /////
    //////////////////////////////////////

// const addModal = document.getElementById("modal2").addEventListener("click", );
