let products = null;

// Get data from JSON file
async function fetchData() {
    try {
        const response = await fetch('js/products.json');
        const data = await response.json();
        products = data;
        addDataToHTML();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();

function addDataToHTML() {
    let listProductHTML = document.querySelector('.listProduct');

    // Add new data
    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('a');
            newProduct.href = 'detail.html?id=' + product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2><br>
                <div class="product_sub">
                  <h4>${product.productType}</h4><br>
                  </div>
                  <div class="product_sub">
                  <h4>${product.color}</h4><br>
                  </div>
                <div class="product_price">
                    <h4>R${product.price}</h4><br>
                </div>
             `;
            listProductHTML.appendChild(newProduct);
        });
    }
}