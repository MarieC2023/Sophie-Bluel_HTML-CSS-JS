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

export const fetchWorks = async () => {
    try {
        let data = await APIWorks();
        let display = "";

        for (let figure of data) {
            display += `
                <figure id="${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <figcaption>${figure.title}</figcaption>
                </figure>
            `;
        }

        const gallery = document.querySelector(".gallery");

        for (let i = gallery.children.length - 1; i >= 0; i--) {
            gallery.removeChild(gallery.children[i]);
        };

        gallery.insertAdjacentHTML("beforeend", display);

        const buttons = document.querySelectorAll(".btn-filter");

        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                btnFilter(event, data, buttons);
            });
        });

    } catch (err) {
    }
}

fetchWorks();


    ////////////////////////////////////////////////////////
    ///// Gestion de l'affichage des oeuvres - Filtres /////
    ////////////////////////////////////////////////////////

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

const editMode = () => {
    const editBanner = document.getElementById("edit-banner");
    const logintLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const filter = document.getElementById("buttons");
    const changeButton = document.querySelector("[data-open-modal");

    const userToken = sessionStorage.getItem("accessToken");

    const isTokenValide = !!userToken;

    if (isTokenValide) {
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

const logoutUser = () => {
    sessionStorage.removeItem("accessToken");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();
            logoutUser();
        });
    }
});
