(async function () {
	const products = await getProducts();
	products.forEach((product) => {
		displayProduct(product);
	});
})();


function getProducts() {
	return fetch("http://localhost:3000/api/products")
		.then((response) => response.json())
}


function displayProduct(product) {
	document.getElementById("items").innerHTML += 
    `
    <a href=./product.html?id=${product._id}>
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    </a>
    `;
}