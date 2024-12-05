// Fonction principale qui récupère les œuvres depuis l'API
async function fetchWorks() {
    try {
        // Envoi de la requête pour récupérer les œuvres depuis l'API locale
        const response = await fetch("http://localhost:5678/api/works")

        // On parse la réponse JSON (données retournées par l'API)
        const data = await response.json()

        // Variable pour accumuler le code HTML qui sera inséré dans la page
        let display = ""

        // Parcours chaque projet (figure) et créer les balises HTML pour chaque œuvre
        for (let figure of data) {
            display += `
            <figure id="${figure.id}">
                  <img src="${figure.imageUrl}" alt="${figure.title}">
                  <figcaption>${figure.title}</figcaption>
              </figure>
            `
        }

        // Insère toutes les œuvres dans l'élément de la galerie
        document.querySelector(".gallery").innerHTML = display

        // Sélectionne tous les boutons de filtrage
        const buttons = document.querySelectorAll(".btn-filter")

        // Ajoute un événement "click" à chaque bouton de filtrage
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                // Lorsqu'un bouton est cliqué, on appelle la fonction de filtrage
                btnFilter(event, data, buttons)
            })
        })

    } catch (err) {
        // Si une erreur survient, elle est capturée ici
        console.log("dans le catch")
        console.log("une erreur est survenue : ", err)
    }
}

// Appel de la fonction pour récupérer et afficher les œuvres
fetchWorks()

// Fonction qui gère le filtrage des œuvres en fonction de la catégorie
function btnFilter(event, data, buttons) {
    // On récupère le bouton qui a été cliqué
    const button = event.target

    // On récupère l'ID de la catégorie depuis l'attribut "id" du bouton
    const categoryId = parseInt(button.id)

    // Gestion de la classe active pour le bouton filtré
    buttons.forEach(btn => btn.classList.remove("btn-filterActive")) // Retirer la classe "active" des autres boutons
    button.classList.add("btn-filterActive") // Ajouter la classe "active" au bouton cliqué

    // Si l'ID de catégorie est 0 --> on afficher toutes les images
    if (categoryId === 0) {
        displayAllImages(data) // Affiche toutes les images
    } else {
        // Sinon, on affiche les images correspondant à la catégorie sélectionnée
        displayImagesByCategory(categoryId, data)
    }
}

// Fonction pour afficher toutes les images
function displayAllImages(data) {
    let display = ""
    // On parcourt toutes les œuvres et on crée le code HTML
    for (let figure of data) {
        display += `
            <figure id="${figure.id}">
                <img src="${figure.imageUrl}" alt="${figure.title}">
                <figcaption>${figure.title}</figcaption>
            </figure>
        `
    }
    // On insère le code HTML dans la galerie
    document.querySelector(".gallery").innerHTML = display
}

// Fonction pour afficher les images d'une catégorie spécifique
function displayImagesByCategory(categoryId, data) {
    // On filtre les œuvres qui correspondent à la catégorie sélectionnée
    const filteredData = data.filter(item => item.categoryId === categoryId);

    let display = ""
    // On crée le code HTML pour chaque œuvre filtrée
    for (let figure of filteredData) {
        display += `
            <figure id="${figure.id}">
                <img src="${figure.imageUrl}" alt="${figure.title}">
                <figcaption>${figure.title}</figcaption>
            </figure>
        `
    }
    // On insère le code HTML filtré dans la galerie
    document.querySelector(".gallery").innerHTML = display
}


// Fonction pour afficher la bannière si le token est validé
function editMode() {
    // On va chercher les éléments qu'on souhaite modifier
    const editBanner = document.getElementById("edit-banner")
    const logintLink = document.getElementById("login-link")
    const logoutLink = document.getElementById("logout-link")
    const filter = document.getElementById("buttons")
    const changeButton = document.getElementById ("change-button")

    // On récupère le token depuis le localStorage
    const userToken = sessionStorage.getItem("accessToken")

    // On vérifie si le token est présent et valide
    const isTokenValide = !!userToken
    
    if(isTokenValide){
        // On applique les modification lié à la connexion admin
        editBanner.style.display = "flex"
        logintLink.style.display = "none"
        logoutLink.style.display = "flex"
        filter.style.display = "none"
        changeButton.style.display = "flex"
    } else{
        console.log ("erreur")
    }
}
editMode()

// Fonction de déconnexion
function logoutUser() {
    sessionStorage.removeItem("accessToken")
    window.location.href = "index.html"
}

// Ajoute un événement "click" au bouton logout
document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logout-link")
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault()
            logoutUser() 
        })
    }
})
