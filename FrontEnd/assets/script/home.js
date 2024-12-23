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

        // Parcours chaque projet (figure) et création du contenu pour chaque œuvre
        for (let figure of data) {
            display += `
                <figure id="${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <figcaption>${figure.title}</figcaption>
                </figure>
            `;
        }

        // Gestion de la galerie (initialisation du contenue + insertion des éléments)
        const gallery = document.querySelector(".gallery");

        for (let i = gallery.children.length - 1; i >= 0; i--) {
            gallery.removeChild(gallery.children[i]);
        };

        gallery.insertAdjacentHTML("beforeend", display);

        // Gestion des boutons de filtre (sélection, événement au clique et appel de la fonction)
        const buttons = document.querySelectorAll(".btn-filter");

        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                btnFilter(event, data, buttons);
            });
        });

    } catch (err) {
        console.error("Une erreur est survenue :", err);
    }
}

fetchWorks();


    ////////////////////////////////////////////////////////
    ///// Gestion de l'affichage des oeuvres - Filtres /////
    ////////////////////////////////////////////////////////

// Fonction qui gère le filtrage des œuvres en fonction de la catégorie
const btnFilter = (event, data, buttons) => {
    const button = event.target;
    const categoryId = parseInt(button.id);

    buttons.forEach(btn => btn.classList.remove("btn-filterActive"));
    button.classList.add("btn-filterActive");


    if (categoryId === 0) {
        displayAllImages(data);
    } else {
        displayImagesByCategory(categoryId, data);
    }
}

// Fonction pour afficher toutes les images
const displayAllImages = (data) => {
    let display = "";
    for (let figure of data) {
        display += `
            <figure id="${figure.id}">
                <img src="${figure.imageUrl}" alt="${figure.title}">
                <figcaption>${figure.title}</figcaption>
            </figure>
        `;
    }
    document.querySelector(".gallery").innerHTML = display;
}

// Fonction pour afficher les images d'une catégorie spécifique
const displayImagesByCategory = (categoryId, data) => {
    const filteredData = data.filter(item => item.categoryId === categoryId);
    let display = "";
    for (let figure of filteredData) {
        display += `
            <figure id="${figure.id}">
                <img src="${figure.imageUrl}" alt="${figure.title}">
                <figcaption>${figure.title}</figcaption>
            </figure>
        `;
    }
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
