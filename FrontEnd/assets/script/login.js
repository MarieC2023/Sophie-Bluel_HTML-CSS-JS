//page login

// Ajoute un écouteur d'événement sur submit
document.getElementById("submit").addEventListener("click", async (event) => {
    
    // Empêche le rechargement de la page après la soumission du formulaire
    event.preventDefault()

    // Récupère la valeur du champ email
    const email = document.getElementById("email").value

    // Récupère la valeur du champ mot de passe
    const password = document.getElementById("password").value

    // Supprime les anciens messages d'erreur s'ils existent
    const oldError = document.querySelector(".error-message")
    if (oldError) {
        oldError.remove()
    }

    try {
        // Envoie une requête POST à l'API pour tenter de se connecter
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST", // Méthode HTTP utilisée
            headers: {
                "Content-Type": "application/json" // Type des données envoyées
            },
            body: JSON.stringify({ email, password }) // Corps de la requête en JSON
        })

        // Si la réponse n'est pas correcte, on va directement dans catch, sinon le code ce poursuit
        
        console.log("Début de la tentative de connexion")

        if (!response.ok) {
            throw new Error("Erreur lors de la connexion")
        }

        console.log("La réponse est OK, traitement des données")

        // Récupère les données de la réponse sous forme JSON
        const data = await response.json()
        console.log("Données récupérées :", data)

        // Récupère le token d'authentification depuis la réponse
        const token = data.token
        console.log("Token récupéré :", token)

        // Stocke le token dans le localStorage pour une utilisation ultérieure
        localStorage.setItem("accessToken", token)
        console.log("Token stocké avec succès")

        // Affiche un message de succès dans la console
        console.log("Connexion réussie")

        // Redirige l'utilisateur vers la page principale
        window.location.href = "index.html"

    } catch (error) {
        // Affiche l'erreur dans la console pour débogage
        console.error(error)

        // Crée dynamiquement un paragraphe pour afficher un message d'erreur
        const errorMessage = document.createElement("p")
        errorMessage.textContent = "Erreur lors de la connexion. Veuillez réessayer."
        errorMessage.classList.add("error-message") // Ajoute une classe pour le style

        // Ajoute le message d'erreur à la fin du formulaire
        const form = document.querySelector("#login form")
        form.appendChild(errorMessage)
    }
})
