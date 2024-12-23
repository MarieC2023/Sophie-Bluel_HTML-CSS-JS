//////////////////////////////////////
///// Gestion des appels à l'API /////
//////////////////////////////////////

const URL = "http://localhost:5678/api"

    ////////////////////////////////////
    ///// Récupération des oeuvres /////
    ////////////////////////////////////

export const APIWorks = async () => {
    try {
        const response = await fetch(`${URL}/works`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`)
        const data = await response.json();            
        return data
    } catch (err) {
        console.log("Erreur lors de la récupération des projets : ", err.message);
        throw err
    }
}