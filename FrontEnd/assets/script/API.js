//////////////////////////////////////
///// Gestion des appels à l'API /////
//////////////////////////////////////

const URL = "http://localhost:5678/api";

    ////////////////////////////////////
    ///// Récupération des oeuvres /////
    ////////////////////////////////////

export const APIWorks = async () => {
    try {
        const response = await fetch(`${URL}/works`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("Erreur lors de la récupération des projets : ", err.message);
        throw err;
    }
};

    ////////////////////////////
    ///// Gestion du login /////
    ////////////////////////////

export const APIConnection = async ({ email, password }) => {
    try {
        const response = await fetch(`${URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("Erreur lors de la connection : ", err.message);
        throw err;
    }
};

    //////////////////////////////////
    ///// Supression des oeuvres /////
    //////////////////////////////////

export const APIDelete = async (figureId, userToken) => {
    try {
        const response = await fetch(`${URL}/${figureId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${userToken}`,
            },

        });
        if (response.ok) {
            console.log(`Image ${figureId} supprimée avec succès.`);
            const modalFigure = document.querySelector(`#modal-figure-${figureId}`).remove();
            console.log(modalFigure)
        } else {
            console.error(`Erreur lors de la suppression : ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.error("Erreur API lors de la suppression :", err);
    }

};

    ///////////////////////////////////////
    ///// Récupération des catégories /////
    ///////////////////////////////////////  

export const APICategories = async () => {
    try {
        const response = await fetch(`${URL}/categories`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("Erreur lors de la récupération des catégories : ", err.message);
        throw err;
    }
};


    ///////////////////////////////////////
    ///// Récupération des catégories /////
    ///////////////////////////////////////  

export const APIAddPicture = async (formData) => {
    try {
        const response = await fetch(`${URL}/works`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            body: formData,
        });
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
        const data = await response.json();
        alert("Nouvelle photo ajoutée avec succès !");
        return data;
    } catch (err) {
        console.log("Erreur lors de la récupération des catégories : ", err.message);
        throw err;
    }
};