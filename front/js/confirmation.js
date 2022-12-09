let numCommande = new URLSearchParams(document.location.search).get("commande");
let numeroCommand = document.getElementById("orderId");
numeroCommand.innerHTML = numCommande;
localStorage.clear();