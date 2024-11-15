let a = fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => {
        console.log("dans le catch")
        console.log(err)
    })
console.log (a)