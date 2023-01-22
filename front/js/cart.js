//Récupèration du localStorage
let articleLocalStorage = JSON.parse(localStorage.getItem("article"));
console.table(articleLocalStorage);
let totalProductsPrice = 0;
let totalProductsArticle = 0;

if (articleLocalStorage === null) {
  arrayEmpty();
}
//Si l'array contient des articles alors on recupere l'id et on fetch et ca pour chaque produit dans le local storage
if (Array.isArray(articleLocalStorage) && articleLocalStorage.length === 0) {
  arrayEmpty();
}else {
 
  for (let produit of articleLocalStorage) {

    const id = produit.id;
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(function (reponse) {
        if (reponse.ok) {
          return reponse.json();
        }
      })
      .then(function (getCart) {
        //insertion d'un article , d'une class et des attributs
        let cartItem = document.createElement("article");
        cartItem.className = "cart__item";
        document.querySelector("#cart__items").appendChild(cartItem);
        cartItem.setAttribute("data-id", produit.id);
        cartItem.setAttribute("data-color", produit.color);

        let cartItemImg = document.createElement("div");
        cartItemImg.className = "cart__item__img";
        cartItem.appendChild(cartItemImg);

        let addImg = document.createElement("img");
        cartItemImg.appendChild(addImg);
        addImg.src = getCart.imageUrl;
        addImg.alt = getCart.altTxt;

        let cartItemContent = document.createElement("div");
        cartItemContent.className = "cart__item__content";
        cartItem.appendChild(cartItemContent);

        let cartItemContentDescription = document.createElement("div");
        cartItemContentDescription.className ="cart__item__content__description";
        cartItemContent.appendChild(cartItemContentDescription);

        let titleCartItem = document.createElement("h2");
        cartItemContentDescription.appendChild(titleCartItem);
        titleCartItem.innerHTML = getCart.name;

        let colorCartItem = document.createElement("p");
        cartItemContentDescription.appendChild(colorCartItem);
        colorCartItem.innerHTML = produit.color;

        let priceCartItem = document.createElement("p");
        cartItemContentDescription.appendChild(priceCartItem);

        let getPriceTotal = getCart.price * produit.nombre;
        priceCartItem.innerHTML = `<span class="price">${getPriceTotal}</span>€`;
        totalProductsPrice = totalProductsPrice + getPriceTotal;

        let cartItemContentSettings = document.createElement("div");
        cartItemContentSettings.className = "cart__item__content__settings";
        cartItem.appendChild(cartItemContentSettings);

        let cartItemContentSettingsQuantity = document.createElement("div");
        cartItemContentSettingsQuantity.className ="cart__item__content__settings__quantity";
        cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

        let quantityCartItem = document.createElement("p");
        cartItemContentSettingsQuantity.appendChild(quantityCartItem);
        quantityCartItem.innerHTML = "Qté : ";

        let inputQuantity = document.createElement("input");
        inputQuantity.className = "itemQuantity";
        cartItemContentSettingsQuantity.appendChild(inputQuantity);
        inputQuantity.value = produit.nombre;
        inputQuantity.setAttribute("type", "number");
        inputQuantity.setAttribute("min", "1");
        inputQuantity.setAttribute("max", "100");
        inputQuantity.setAttribute("name", "inputQuantity");
        totalProductsArticle = totalProductsArticle + produit.nombre;
        //Quand il y a un element qui change on utilise la fonction updatePrice qui permet de mettre a jour le prix
        inputQuantity.addEventListener("change", updatePrice);

        let cartItemContentSettingsDelete = document.createElement("div");
        cartItemContentSettingsDelete.className ="cart__item__content__settings__delete";

        cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

        let deleteCartitem = document.createElement("p");
        deleteCartitem.className = "deleteItem";
        cartItemContentSettingsDelete.appendChild(deleteCartitem);
        deleteCartitem.innerHTML = "Supprimer";
        //Au clic on utilise la fonction deleteItem qui permet de supprimer l'élément du panier
        deleteCartitem.addEventListener("click", deleteItem);
      })
      .then(function () {
        let productTotalPrice = document.getElementById("totalPrice");
        productTotalPrice.innerHTML = totalProductsPrice;
        let productTotalQuantity = document.getElementById("totalQuantity");
        productTotalQuantity.innerHTML = totalProductsArticle;
      })
      .catch(function (erreur) {
        alert("error" + erreur);
      });
  }
}


//fonction servant a supprimer un item du panier
function deleteItem(e) {
  //On cible l'element du DOM a supprimer
  let boutonSuprimer = e.target;
  let article = boutonSuprimer.closest(".cart__item");
  //on update l'article avec une valeur de 0 
  updateAll(article, "delete", 0);
  //Si l'array est vide apres manipulation alors on affiche que le panier est vide
  if (Array.isArray(articleLocalStorage) && articleLocalStorage.length === 0) {
    arrayEmpty();
  }
}

function updatePrice(e) {
   //Ici on met  a jour la valeur de l'element ciblé
  let updateButtun = e.target;
  let update = updateButtun.closest(".cart__item");

  updateAll(update, "update", e.target.value);
}

//Cette fonction sert a update le prix total
function updateAll(element, type, value) {
  element.dataset.id === "";
  element.dataset.color === "";
  let totalNombre = 0;
  for (let [i, produit] of articleLocalStorage.entries()) {
    const id = produit.id;
    if (
      produit.id === element.dataset.id &&
      produit.color === element.dataset.color
    ) {
      let oldPrice = element.querySelector(".price").textContent;
      produit.nombre = parseInt(value);
      totalProductsArticle = produit.nombre;
      localStorage.setItem("article", JSON.stringify(articleLocalStorage));
      fetch(`http://localhost:3000/api/products/${id}`)
        .then(function (reponse) {
          if (reponse.ok) {
            return reponse.json();
          }
        })
        .then(function (getArticle) {
          let getPriceTotal = getArticle.price * totalProductsArticle;
          let PriceTotal = element.querySelector(".price");
          PriceTotal.innerHTML = getPriceTotal;
          let difference = getPriceTotal - parseInt(oldPrice); 
          totalProductsPrice = totalProductsPrice + difference;
          let productTotalPrice = document.getElementById("totalPrice");
          productTotalPrice.innerHTML = totalProductsPrice;
        })
        .catch(function (erreur) {
          alert("error" + erreur);
        });
    }
    totalNombre = totalNombre + produit.nombre;
  }
  //Ici on verifie que la quantité total ne soit pas a 0 sinon on supprime l'article
  let totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = totalNombre;
  console.log(parseInt(value) === 0);
  if (type === "delete" || (type === "update" && parseInt(value) === 0)) {
    for (let [i, produit] of articleLocalStorage.entries()) {
      console.log(i);
      if (
        produit.id === element.dataset.id &&
        produit.color === element.dataset.color
      ) {
        articleLocalStorage.splice(i, 1);
        localStorage.setItem("article", JSON.stringify(articleLocalStorage));
        element.remove();
      }
    }

  }
}

// cette fonction sert a vérifier si le panier est vide , si il l'est alors il l'affiche a l'utilisateur
function arrayEmpty() {
  let artNull = document.createElement("p");
  artNull.innerHTML = "Votre panier est vide";
  document.querySelector("#cart__items").appendChild(artNull);
  let totalArticle = document.getElementById("totalQuantity");
  totalArticle.innerHTML = " 0 ";
  let totalPrice = document.getElementById("totalPrice");
  totalPrice.innerHTML = `<span class="price"> 0 </span>`;
}
//Ici on vérifie que l'utilisateur remplie le formulaire correctement
let textRegExp = new RegExp(
  "^[a-zA-Z -,]{2,}$"
);
let adresseRegExp = new RegExp(
  "^[a-zA-Z0-9 -,]{2,}$"
);
let emailRegExp = new RegExp(
  "^[a-zA-Z0-9.-_]{2,}[@]{1}[a-zA-Z0-9.-_]{2,}[.]{1}[a-z]{2,5}$"
);
let commander = document.getElementById("order");
commander.addEventListener("click", postCommand);
function postCommand(e) {
  e.preventDefault();
  let contact = {};
  let textFirstName = document.getElementById("firstName");
  let textLastName = document.getElementById("lastName");
  let textAddress = document.getElementById("address");
  let textCity = document.getElementById("city");
  let textEmail = document.getElementById("email");
  let errorFirstName = document.getElementById("firstNameErrorMsg");
  let errorLastName = document.getElementById("lastNameErrorMsg");
  let errorAdresse = document.getElementById("addressErrorMsg");
  let errorCity = document.getElementById("cityErrorMsg");
  let errorEmail = document.getElementById("emailErrorMsg");
  let valide = true;
  if (textRegExp.test(textFirstName.value)) {
    errorFirstName.innerHTML = "Formulaire valide";
    errorFirstName.setAttribute("style", "color:#11D01F");
  } else {
    errorFirstName.innerHTML = "Formulaire invalide";
    valide = false;
  }
  if (textRegExp.test(textLastName.value)) {
    errorLastName.innerHTML = "Formulaire valide";
    errorLastName.setAttribute("style", "color:#11D01F");
  } else {
    errorLastName.innerHTML = "Formulaire invalide";
    valide = false;
  }
  if (adresseRegExp.test(textAddress.value)) {
    errorAdresse.innerHTML = "Formulaire valide";
    errorAdresse.setAttribute("style", "color:#11D01F");
  } else {
    errorAdresse.innerHTML = "Formulaire invalide";
    valide = false;
  }
  if (textRegExp.test(textCity.value)) {
    errorCity.innerHTML = "Formulaire valide";
    errorCity.setAttribute("style", "color:#11D01F");
  } else {
    errorCity.innerHTML = "Formulaire invalide";
    valide = false;
  }
  if (emailRegExp.test(textEmail.value)) {
    errorEmail.innerHTML = "Adresse email valide";
    errorEmail.setAttribute("style", "color:#11D01F");
  } else {
    errorEmail.innerHTML = "Adresse email invalide";
    valide = false;
  }
  if (valide != true) {
    alert(`erreur de saisie`);
    return false;
  }
  contact = {
    firstName: textFirstName.value,
    lastName: textLastName.value,
    address: textAddress.value,
    city: textCity.value,
    email: textEmail.value,
  };
  console.log(contact);
  let products = [];
  for (let produits of articleLocalStorage) {
    let id = produits.id;
    products.push(id);
  }
  // on POST le formulaire
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify({
      contact,
      products,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(function (reponse) {
      if (reponse.ok) {
        return reponse.json();
      }
    })
    //on renvoie vers la page de confirmation
    .then(function (reponse) {
      const orderId = reponse.orderId;
      location.href = `./confirmation.html?commande=${orderId}`;
    })
    .catch(function (erreur) {
      alert("error" + erreur);
    });
}