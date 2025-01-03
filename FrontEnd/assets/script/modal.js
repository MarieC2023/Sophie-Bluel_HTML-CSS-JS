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

        document.querySelector(".modal-gallery").innerHTML = display;

    } catch (err) {
    }
}

    ///////////////////////////////////////////////////////
    ///// Gestion ouverture / fermeture de la modale 1 ////
    ///////////////////////////////////////////////////////

const modal = document.querySelector("[data-modal1]");

const openButton = document.querySelector("[data-open-modal]");
openButton.addEventListener("click", () => {
    modal.showModal();
    fetchWorksForModal(); 
});

const closeButton = document.querySelector("[data-close-modal]");
closeButton.addEventListener("click", () => {
    modal.close();
});


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

const modal2 = document.querySelector("[data-modal2]");

const openButton2 = document.querySelector("[data-open-modal2]");
openButton2.addEventListener("click", () => {
    modal.close();
    modal2.showModal();
});

const closeButton2 = document.querySelector("[data-close-modal2]");
closeButton2.addEventListener("click", () => {
    modal2.close();
});

modal2.addEventListener("click", (e) => {
    if (e.target === modal2) {
        modal2.close();
    }
});

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
    const userToken = sessionStorage.getItem("accessToken");
    if (!userToken) {
        return;
    }

    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const figureId = e.target.getAttribute("data-id");
            if (!figureId) {
                return;
            }

            try {
                const isDeleted = await APIDeletePicture(figureId, userToken);
                if (isDeleted) {
                    const modalFigure = document.querySelector(`#modal-figure-${figureId}`);
                    if (modalFigure) {
                        modalFigure.remove();
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

const setupCategoryDropdown = async () => {
    const categorySelect = document.getElementById("category");

    const emptyOption = document.createElement("option");
    emptyOption.value = ""; 
    emptyOption.textContent = "Veuillez choisir une catégorie"; 
    emptyOption.disabled = true; 
    emptyOption.selected = true; 
    categorySelect.appendChild(emptyOption);

    try {
        const categories = await APICategories();
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
    }
}

const setupAddPhotoForm = () => {
    const form = document.querySelector(".modal-form"); 
    const pictureInput = document.getElementById("picture"); 
    const titleInput = document.getElementById("title"); 
    const categorySelect = document.getElementById("category"); 
    const addPictureDiv = document.querySelector(".add-picture"); 
    const submitButton = form.querySelector("input[type='submit']"); 

    const updateSubmitButtonState = () => {
        if (pictureInput.files[0] && titleInput.value.trim() && categorySelect.value) {
            submitButton.classList.add("add-btnActive"); 
            submitButton.disabled = false; 
        } else {
            submitButton.classList.remove("add-btnActive");
            submitButton.disabled = true; 
        }
    };

    pictureInput.addEventListener("change", updateSubmitButtonState);
    titleInput.addEventListener("input", updateSubmitButtonState);
    categorySelect.addEventListener("change", updateSubmitButtonState);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!pictureInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
            alert("Veuillez remplir tous les champs du formulaire.");
            return;
        } else {
            submitButton.classList.add("add-btnActive");
            submitButton.disabled = false;
        }

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
            alert("Une erreur s'est produite lors de l'ajout de la photo.");
        }
    });

    pictureInput.addEventListener("change", () => {
        const file = pictureInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                addPictureDiv.style.backgroundImage = `url(${e.target.result})`; 
                addPictureDiv.style.backgroundSize = "cover";
                addPictureDiv.style.backgroundPosition = "center";

                addPictureDiv.querySelector("label").style.opacity = "0";
                addPictureDiv.querySelector("i").style.opacity = "0";
                addPictureDiv.classList.add("image-loaded");
            };
            reader.readAsDataURL(file);
        }
    });
};


const resetForm = (form, addPictureDiv) => {
    form.reset(); 
    addPictureDiv.style.backgroundImage = ""; 
    addPictureDiv.querySelector("label").style.opacity = "1"; 
    addPictureDiv.querySelector("i").style.opacity = "1"; 
    addPictureDiv.classList.remove("image-loaded");
    
    const categorySelect = form.querySelector("#category");
    categorySelect.value = "";
}

