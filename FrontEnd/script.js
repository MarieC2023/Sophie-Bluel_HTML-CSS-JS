let works = fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        let display = ""
        //console.log("données récupérées : ", data)
        for(let figure of data){
            display += `
            <figure "${figure.id}">
                  <img src="${figure.imageUrl}" alt="${figure.title}">
                  <figcaption>${figure.title}</figcaption>
              </figure>
         `
         //console.log(figure)
        }
        //console.log(display)
        document.querySelector(".gallery").innerHTML = display
})

    .catch(err => {
        console.log("dans le catch")
        console.log("une erreur est survenue : ", err)
    })
console.log (works)