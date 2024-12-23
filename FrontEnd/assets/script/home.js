////////////////////////////////////////
///// Gestion de la page d'accueil /////
////////////////////////////////////////

    /////////////////////////////////
    ///// Récupération de l'API /////
    /////////////////////////////////

import { APIWorks } from "./API.js";

    ////////////////////////////////////
    ///// Récupération des oeuvres /////
    ////////////////////////////////////

// Fonction principale qui récupère les œuvres depuis l'API et les injectent dans la galerie
const fetchWorks = async () => {
    try {
        let data = await APIWorks();
        let display = "";

        // Parcours chaque projet (figure) et crée les balises HTML pour chaque œuvre
        for (let figure of data) {
            display += `
                <figure id="${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <figcaption>${figure.title}</figcaption>
                </figure>
            `;
        }

        // Sélectionne l'élément de la galerie
        const gallery = document.querySelector(".gallery");

        // Réinitialise le contenu de la galerie
        for (let i = gallery.children.length - 1; i >= 0; i--) {
            gallery.removeChild(gallery.children[i]);
        };

        // Insère toutes les œuvres dans l'élément de la galerie
        gallery.insertAdjacentHTML("beforeend", display);

        // Sélectionne tous les boutons de filtrage
        const buttons = document.querySelectorAll(".btn-filter");

        // Ajoute un événement "click" à chaque bouton de filtrage
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                // Lorsqu'un bouton est cliqué, on appelle la fonction de filtrage
                btnFilter(event, data, buttons);
            });
        });

    } catch (err) {
        // Si une erreur survient, elle est capturée ici
        console.error("Une erreur est survenue :", err);
    }
}

// Appel de la fonction pour récupérer et afficher les œuvres
fetchWorks();


    ////////////////////////////////////////////////////////
    ///// Gestion de l'affichage des oeuvres - Filtres /////
    ////////////////////////////////////////////////////////


// Fonction qui gère le filtrage des œuvres en fonction de la catégorie
const btnFilter = (event, data, buttons) => {
    // On récupère le bouton qui a été cliqué
    const button = event.target;

    // On récupère l'ID de la catégorie depuis l'attribut "id" du bouton
    const categoryId = parseInt(button.id);

    // Gestion de la classe active pour le bouton filtré
    buttons.forEach(btn => btn.classList.remove("btn-filterActive")); 
    button.classList.add("btn-filterActive"); 

    // Si l'ID de catégorie est 0 --> on afficher toutes les images
    if (categoryId === 0) {
        displayAllImages(data); 
    } else {
        // Sinon, on affiche les images correspondant à la catégorie sélectionnée
        displayImagesByCategory(categoryId, data);
    }
}

// Fonction pour afficher toutes les images
const displayAllImages = (data) => {
    let display = "";
    // On parcourt toutes les œuvres et on crée le code HTML
    for (let figure of data) {
        display += `
            <figure id="${figure.id}">
                <img src="${figure.imageUrl}" alt="${figure.title}">
                <figcaption>${figure.title}</figcaption>
            </figure>
        `;
    }
    // On insère le code HTML dans la galerie
    document.querySelector(".gallery").innerHTML = display;
}

// Fonction pour afficher les images d'une catégorie spécifique
const displayImagesByCategory = (categoryId, data) => {
    // On filtre les œuvres qui correspondent à la catégorie sélectionnée
    const filteredData = data.filter(item => item.categoryId === categoryId);

    let display = "";
    // On crée le code HTML pour chaque œuvre filtrée
    for (let figure of filteredData) {
        display += `
            <figure id="${figure.id}">
                <img src="${figure.imageUrl}" alt="${figure.title}">
                <figcaption>${figure.title}</figcaption>
            </figure>
        `;
    }
    // On insère le code HTML filtré dans la galerie
    document.querySelector(".gallery").innerHTML = display;
}


    //////////////////////////////////////////////
    ///// Gestion de la page en mode édition /////
    //////////////////////////////////////////////

// Fonction pour afficher la bannière si le token est validé
const editMode = () => {
    // On va chercher les éléments qu'on souhaite modifier
    const editBanner = document.getElementById("edit-banner");
    const logintLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const filter = document.getElementById("buttons");
    const changeButton = document.querySelector("[data-open-modal");

    // On récupère le token depuis le localStorage
    const userToken = sessionStorage.getItem("accessToken");

    // On vérifie si le token est présent et valide
    const isTokenValide = !!userToken;

    if (isTokenValide) {
        // On applique les modification lié à la connexion admin
        editBanner.style.display = "flex";
        logintLink.style.display = "none";
        logoutLink.style.display = "flex";
        filter.style.display = "none";
        changeButton.style.display = "flex";
    } else {
        console.log("erreur");
    }
}
editMode();

// Fonction de déconnexion
const logoutUser = () => {
    sessionStorage.removeItem("accessToken");
    window.location.href = "index.html";
}

// Ajoute un événement "click" au bouton logout
document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();
            logoutUser();
        });
    }
});
