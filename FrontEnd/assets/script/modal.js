////////////////////////////////
///// Gestion de la modale /////
////////////////////////////////

    /////////////////////////////////
    ///// Récupération de l'API /////
    /////////////////////////////////

import { APIWorks, APIDeletePicture, APICategories, APIAddPicture } from "./API.js";
import { fetchWorks } from "./home.js";

    ////////////////////////////////////
    ///// Récupération des oeuvres /////
    ////////////////////////////////////

// Fonction pour récupérer les oeuvres depuis l'API pour la mini Galerie
const fetchWorksForModal = async () => {
    try {
        let data = await APIWorks();
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
    fetchWorksForModal(); 
});

    //////////////////////////////////////////////
    ///// Gestion de la suppression d'images /////
    //////////////////////////////////////////////

const deleteMode = () => {
    // Récupération du token et vérification de sa validité
    const userToken = sessionStorage.getItem("accessToken");
    if (!userToken) {
        console.error("Erreur : token non valide ou manquant.");
        return;
    }

    // Récupération des boutons pour la suppression d'image et ajout d'un écouteur d'événement
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const figureId = e.target.getAttribute("data-id");
            if (!figureId) {
                console.error("Erreur : ID introuvable sur le bouton.");
                return;
            }

            try {
                const isDeleted = await APIDeletePicture(figureId, userToken);
                if (isDeleted) {
                    const modalFigure = document.querySelector(`#modal-figure-${figureId}`);
                    if (modalFigure) {
                        modalFigure.remove();
                        console.log(`Élément DOM pour l'image ${figureId} supprimé avec succès.`);
                    }
                }
            } catch (error) {
                alert("Une erreur s'est produite lors de la suppression de l'image.");
            }
        });
    });
};
deleteMode();

    //////////////////////////////////////
    ///// Gestion de l'ajout d'image /////
    //////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    setupCategoryDropdown();
    setupAddPhotoForm();
});

// Ajout des catégories dans le formulaire
const setupCategoryDropdown = async () => {
    const categorySelect = document.getElementById("category");

    // Ajout d'une première option vide
    const emptyOption = document.createElement("option");
    emptyOption.value = ""; 
    emptyOption.textContent = "Veuillez choisir une catégorie"; 
    emptyOption.disabled = true; 
    emptyOption.selected = true; 
    categorySelect.appendChild(emptyOption);

    try {
        const categories = await APICategories();
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
const setupAddPhotoForm = () => {
    const form = document.querySelector(".modal-form"); 
    const pictureInput = document.getElementById("picture"); 
    const titleInput = document.getElementById("title"); 
    const categorySelect = document.getElementById("category"); 
    const addPictureDiv = document.querySelector(".add-picture"); 
    const submitButton = form.querySelector("input[type='submit']"); 

    // Fonction pour mettre à jour le bouton "Valider" si tous les champs sont rempli
    const updateSubmitButtonState = () => {
        if (pictureInput.files[0] && titleInput.value.trim() && categorySelect.value) {
            submitButton.classList.add("add-btnActive"); 
            submitButton.disabled = false; 
        } else {
            submitButton.classList.remove("add-btnActive");
            submitButton.disabled = true; 
        }
    };

    // Vérification des champs à chaque changement
    pictureInput.addEventListener("change", updateSubmitButtonState);
    titleInput.addEventListener("input", updateSubmitButtonState);
    categorySelect.addEventListener("change", updateSubmitButtonState);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Alerte donnée si les champs ne sont pas remplis
        if (!pictureInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
            alert("Veuillez remplir tous les champs du formulaire.");
            return;
        } else {
            submitButton.classList.add("add-btnActive");
            submitButton.disabled = false;
        }

        // Crée un objet FormData avec les données du formulaire
        const formData = new FormData();
        formData.append("image", pictureInput.files[0]);
        formData.append("title", titleInput.value.trim());
        formData.append("category", categorySelect.value);

        try {
            await APIAddPicture(formData);
            fetchWorksForModal(); 
            fetchWorks();
            resetForm(form, addPictureDiv);
            updateSubmitButtonState(); 
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
                addPictureDiv.style.backgroundImage = `url(${e.target.result})`; 
                addPictureDiv.style.backgroundSize = "cover";
                addPictureDiv.style.backgroundPosition = "center";

                // Masque les éléments de texte pour un meilleur effet
                addPictureDiv.querySelector("label").style.opacity = "0";
                addPictureDiv.querySelector("i").style.opacity = "0";
                addPictureDiv.classList.add("image-loaded");
            };
            reader.readAsDataURL(file);
        }
    });
};


// Réinitialise le formulaire après l'ajout d'une photo
const resetForm = (form, addPictureDiv) => {
    form.reset(); 
    addPictureDiv.style.backgroundImage = ""; 
    addPictureDiv.querySelector("label").style.opacity = "1"; 
    addPictureDiv.querySelector("i").style.opacity = "1"; 
    addPictureDiv.classList.remove("image-loaded");
    
    const categorySelect = form.querySelector("#category");
    categorySelect.value = "";
}

