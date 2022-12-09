const url = new URL(window.location.href);
const id = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (reponse) {
    if (reponse.ok) {
      return reponse.json();
    }
  })
  .then(function (produit) {

    const image = document.createElement("img");
    image.src = produit.imageUrl;
    image.alt = produit.altTxt;
    document.querySelector(".item__img").appendChild(image);


    const title = document.getElementById("title");
    title.innerHTML = produit.name;
    const price = document.querySelector("#price");
    price.innerHTML = produit.price;
    const description = document.querySelector("#description");
    description.innerHTML = produit.description;


    for (let color of produit.colors) {
      const couleur = document.createElement("option");
      couleur.value = color;
      couleur.innerHTML = color;
      document.querySelector("#colors").appendChild(couleur);
    }
  })
  .catch(function (erreur) {
    alert("Une erreur est survenue" + erreur);
  });


const button = document.getElementById("addToCart");
button.addEventListener("click", addToCart);

function addToCart(e) {

  const colorValue = document.querySelector("#colors");
  let color = colorValue.value;

  if (color === "") {
    alert("Aucune couleur choisie, veuillez choisir une couleur!");
    return false;
  }

  const quantityValue = document.querySelector("#quantity");
  let nombreValue = quantityValue.value;

  let article = {
    id: id,
    color: color,
    nombre: Number(nombreValue),
  };

  let articleLocalStorage = JSON.parse(localStorage.getItem("article"));

  if (articleLocalStorage == null) {
    articleLocalStorage = [];
    articleLocalStorage.push(article);
    localStorage.setItem("article", JSON.stringify(articleLocalStorage));
    console.table(articleLocalStorage);
  } else {

    let find = false;

   
    for (let produit of articleLocalStorage) {

      if (produit.id === article.id && produit.color === article.color) {
        produit.nombre = article.nombre + produit.nombre;

        if (produit.nombre > 100) {
          produit.nombre = 100;
          alert("il y à déja 100 articles dans votre panier");
        }

        localStorage.setItem("article", JSON.stringify(articleLocalStorage));
        find = true;
        console.table(articleLocalStorage);
      }
    }

    if (find === false) {
      articleLocalStorage.push(article);
      localStorage.setItem("article", JSON.stringify(articleLocalStorage));
      console.table(articleLocalStorage);
    }
  }
}