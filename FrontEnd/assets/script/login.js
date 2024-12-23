////////////////////////////
///// Gestion du login /////
////////////////////////////

    /////////////////////////////////
    ///// Récupération de l'API /////
    /////////////////////////////////

    import { APIConnection } from './API.js';

    //////////////////////////////////
    ///// Fonction de connection /////
    //////////////////////////////////

document.getElementById("submit").addEventListener("click", async (event) => {
    event.preventDefault();

    // Récupèration des valeurs de connection
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Suppression des anciens messages d'erreur s'ils existent
    const oldError = document.querySelector(".error-message");
    if (oldError) {
        oldError.remove();
    }

    try {
        const data = await APIConnection({ email, password });
        // Récupèration et stockage du token d'authentification depuis la réponse
        const token = data.token;
        console.log("Token récupéré :", token);
        sessionStorage.setItem("accessToken", token);
        console.log("Token stocké avec succès");

        console.log("Connexion réussie");

        // Redirection vers la page principale en mode édition
        window.location.href = "index.html";

    } catch (error) {
        // Affichage de l'erreur dans la console pour débogage
        console.error(error);

        // Création d'un message d'erreur s'il y a un problème d'identifiant
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Erreur lors de la connexion. Veuillez réessayer.";
        errorMessage.classList.add("error-message"); 

        const form = document.querySelector("#login form");
        form.appendChild(errorMessage);
    }
});
