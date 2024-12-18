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
                    <i class="fa-solid fa-trash-can delete-btn" data-id="${figure.id}"></i>
                </figure>
            `;
        }

        // Injecter le contenu dans la galerie modale
        document.querySelector(".modal-gallery").innerHTML = display;

        // Rattacher les événements de suppression (lors de la suppression d'image)
        deleteMode();
    } catch (err) {
        console.error("Une erreur est survenue lors du chargement des images : ", err);
    }
}

    ///////////////////////////////////////////////////////
    ///// Gestion ouverture / fermeture de la modale 1 ////
    ///////////////////////////////////////////////////////

// Sélectionne la première modale
const modal = document.querySelector("[data-modal1]");

// Ouverture de la modale et chargement de la galerie
const openButton = document.querySelector("[data-open-modal]");
openButton.addEventListener("click", () => {
    modal.showModal();
    fetchWorksForModal(); // Chargement de la galerie à chaque ouverture
});

// Fermeture de la modale
const closeButton = document.querySelector("[data-close-modal]");
closeButton.addEventListener("click", () => {
    modal.close();
});

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

// Ouverture de la modale 2 et fermeture de la modale 1
const openButton2 = document.querySelector("[data-open-modal2]");
openButton2.addEventListener("click", () => {
    modal.close();
    modal2.showModal();
});

// Fermeture de la modale 2
const closeButton2 = document.querySelector("[data-close-modal2]");
closeButton2.addEventListener("click", () => {
    modal2.close();
});

// Fermer la modale en cliquant sur l'overlay
modal2.addEventListener("click", (e) => {
    if (e.target === modal2) {
        modal2.close();
    }
});

// Retour sur la modale 1 et fermeture de la modale 2
const returnButton = document.querySelector("[data-return-modal1]");
returnButton.addEventListener("click", () => {
    modal2.close();
    modal.showModal();
    fetchWorksForModal(); // Recharge la galerie pour refléter les modifications
});

    /////////////////////////////////////////////
    ///// Gestion de la suppression d'image /////
    /////////////////////////////////////////////

function deleteMode() {
    // Récupération du token
    const userToken = sessionStorage.getItem("accessToken");

    // Vérification de la validité du token
    if (!userToken) {
        console.error("Erreur : token non valide ou manquant.");
        return;
    }

    // Sélection des boutons pour la suppression d'image
    const deleteBtns = document.querySelectorAll(".delete-btn");

    // Pour chaque bouton delete, on ajoute un écouteur d'événements
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            // Récupère directement l'ID de l'image depuis le bouton
            const figureId = e.target.getAttribute("data-id");
            if (!figureId) {
                console.error("Erreur : ID introuvable sur le bouton.");
                return;
            }

            // Fonction pour supprimer une image via l'API
            try {
                const response = await fetch(`http://localhost:5678/api/works/${figureId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                if (response.ok) {
                    console.log(`Image ${figureId} supprimée avec succès.`);
                    document.querySelector(`#modal-figure-${figureId}`).remove();
                } else {
                    console.error(`Erreur lors de la suppression : ${response.status} ${response.statusText}`);
                }
            } catch (err) {
                console.error("Erreur API lors de la suppression :", err);
            }
        });
    });
}

    //////////////////////////////////////
    ///// Gestion de l'ajout d'image /////
    //////////////////////////////////////



document.addEventListener("DOMContentLoaded", () => {
    setupCategoryDropdown();
    setupAddPhotoForm();
});

// Ajout des catégories dans le formulaire
async function setupCategoryDropdown() {
    const categorySelect = document.getElementById("category");

    // Ajout d'une première option vide
    const emptyOption = document.createElement("option");
    emptyOption.value = ""; // Valeur vide pour cette option
    emptyOption.textContent = "Veuillez choisir une catégorie"; // Texte visible
    emptyOption.disabled = true; // Empêche la sélection de cette option après soumission
    emptyOption.selected = true; // Rend cette option sélectionnée par défaut
    categorySelect.appendChild(emptyOption);

    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        categories.forEach((category) => {
            // Création d'une option pour chaque catégorie
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}

// Fonction pour configurer le formulaire permettant l'ajout de photo
function setupAddPhotoForm() {
    const form = document.querySelector(".modal-form"); // Formulaire d'ajout d'image
    const pictureInput = document.getElementById("picture"); // Input pour l'image
    const titleInput = document.getElementById("title"); // Input pour le titre
    const categorySelect = document.getElementById("category"); // Input pour les catégories
    const addPictureDiv = document.querySelector(".add-picture"); // Zone d'aperçu de l'image

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!pictureInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
            alert("Veuillez remplir tous les champs du formulaire.");
            return;
        }

        // Crée un objet FormData avec les données du formulaire
        const formData = new FormData();
        formData.append("image", pictureInput.files[0]);
        formData.append("title", titleInput.value.trim());
        formData.append("category", categorySelect.value);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
            }

            const newWork = await response.json();
            alert("Nouvelle photo ajoutée avec succès !");
            fetchWorksForModal(); // Recharge la galerie après ajout
            fetchWorks();
            resetForm(form, addPictureDiv);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la photo :", error);
            alert("Une erreur s'est produite lors de l'ajout de la photo.");
        }
    });

    // Gestion de l'aperçu de l'image téléchargée
    pictureInput.addEventListener("change", () => {
        const file = pictureInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                addPictureDiv.style.backgroundImage = `url(${e.target.result})`; // Permet l'affichage d'un aperçu de l'image
                addPictureDiv.style.backgroundSize = "cover";
                addPictureDiv.style.backgroundPosition = "center";

                // Masque les éléments de texte pour un effet propre
                addPictureDiv.querySelector("label").style.opacity = "0";
                addPictureDiv.querySelector("i").style.opacity = "0";
                addPictureDiv.classList.add("image-loaded");
            };
            reader.readAsDataURL(file);
        }
    });
}

// Réinitialise le formulaire après l'ajout d'une photo
function resetForm(form, addPictureDiv) {
    form.reset(); // Réinitialise les champs du formulaire
    addPictureDiv.style.backgroundImage = ""; // Supprime l'aperçu de l'image
    addPictureDiv.querySelector("label").style.opacity = "1"; // Rétablit le texte
    addPictureDiv.querySelector("i").style.opacity = "1"; // Rétablit l'icône
    addPictureDiv.classList.remove("image-loaded"); // Supprime la classe indiquant qu'une image est chargée
}