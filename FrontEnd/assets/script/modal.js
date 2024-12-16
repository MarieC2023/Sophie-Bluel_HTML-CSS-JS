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


    ///////////////////////////////////////////////////////
    ///// Gestion ouverture / fermeture de la modale 1 ////
    ///////////////////////////////////////////////////////

const modal = document.querySelector("[data-modal1]");
    
// Ouverture de la modale et chargement de la galerie
const openButton = document.querySelector("[data-open-modal]");
openButton.addEventListener("click", () => {
    modal.showModal();
    fetchWorksForModal();
})
    
// Fermeture de la modale
const closeButton = document.querySelector("[data-close-modal]");
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

    ///////////////////////////////////////////////////////
    ///// Gestion ouverture / fermeture de la modale 2 ////
    ///////////////////////////////////////////////////////


// Sélection du bouton de la modale 2
const modal2 = document.querySelector("[data-modal2]");

// Ouverture de la modale 
const openButton2 = document.querySelector("[data-open-modal2]");
openButton2.addEventListener("click", () => {
    modal.close();
    modal2.showModal();
})

// Fermeture de la modale
const closeButton2 = document.querySelector("[data-close-modal2]");
closeButton2.addEventListener("click", () => {
    modal2.close();
})


// Fermer la modale en cliquant sur l'overlay
// Utilisation de la méthode "getBoundingClientRect()" 
// qui retourne l'objet avec ses dimensions et les coordonnées de l'élément
modal2.addEventListener("click", (e) => {
    const dialogDimensions = modal2.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        modal2.close();
    }
});

// Retour sur la modal 1 
const returnButton = document.querySelector("[data-return-modal1]")
returnButton.addEventListener("click", () => {
    modal2.close();
    modal.showModal();
})

    /////////////////////////////////////////////
    ///// Gestion de la suppression d'image /////
    /////////////////////////////////////////////

function deleteMode() {
    // On récupère le token depuis le sessionStorage 
    const userToken = sessionStorage.getItem("accessToken");

    // Vérifie si le token est présent et valide
    if (!userToken) {
        console.log("Erreur : token non valide ou manquant.");
        return; // Arrête l'exécution si le token est invalide
    }

    // Sélectionne les boutons qui permettent de supprimer les images
    const deleteBtns = document.querySelectorAll(".delete-btn");

    // Pour chaque bouton, on ajoute un écouteur d'événements
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", async function (e) {
            console.log("click ok");

            // Trouve l'élément 'figure' le plus proche et récupère son ID
            const figureElement = e.target.closest("figure");
            if (!figureElement) {
                console.error("Erreur : élément 'figure' introuvable.");
                return;
            }

            // Récupère l'identifiant de la figure
            const figureId = figureElement.id.replace("modal-figure-", "");
            console.log(`ID de la figure à supprimer : ${figureId}`);

            // Appelle l'API pour supprimer l'image
            await deleteImage(figureId, userToken);
        });
    });

    // Fonction pour supprimer une image via l'API
    async function deleteImage(figureId, token) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${figureId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // Transmet le token d'authentification
                },
            });

            // Vérifie la réponse de l'API
            if (response.ok) {
                console.log(`Image ${figureId} supprimée avec succès.`);
                document.querySelector(`#modal-figure-${figureId}`).remove(); 
            } else {
                console.error(`Erreur lors de la suppression : ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.error("Erreur API lors de la suppression :", err);
        }
    }
}

// Appelle la fonction principale
deleteMode();  
    

    //////////////////////////////////////
    ///// Gestion de l'ajout d'image /////
    //////////////////////////////////////

// const addModal = document.getElementById("modal2").addEventListener("click", );
