document.addEventListener("DOMContentLoaded", () => {
    const productListContainer = document.getElementById("product-list");
    const searchInput = document.getElementById("search");

    async function cargarProductos(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("No se pudieron cargar los productos");
            const productos = await response.json();
            mostrarProductos(productos);
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema al cargar los productos");
        }
    }

    function mostrarProductos(productos) {
        productListContainer.innerHTML = "";

        if (productos.length === 0) {
            productListContainer.innerHTML = "<p>No hay productos disponibles</p>";
            return;
        }

        productos.forEach(producto => {
            const productCard = document.createElement("div");
            productCard.classList.add("card");

            const productTitle = document.createElement("h3");
            productTitle.classList.add("card-title");
            productTitle.textContent = producto.name;

            const productStock = document.createElement("p");
            productStock.classList.add("card-stock");
            productStock.textContent = `Stock: ${producto.stock}pz`;

            const productPrice = document.createElement("span");
            productPrice.classList.add("card-precio");
            productPrice.textContent = `$${producto.price.toFixed(2)}`;

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("card-button", "card-button_delete");
            deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
            deleteButton.dataset.id = producto._id; // Guardamos el ID del producto

            deleteButton.addEventListener("click", async () => {
                const confirmDelete = confirm(`¿Seguro que quieres eliminar "${producto.name}"?`);
                if (confirmDelete) {
                    console.log("Intentando eliminar el producto con ID:", producto._id);
                    await eliminarProducto(producto._id); // Usamos el ID correcto para eliminar
                }
            });

            productCard.appendChild(productTitle);
            productCard.appendChild(productStock);
            productCard.appendChild(deleteButton);
            productCard.appendChild(productPrice);
            productListContainer.appendChild(productCard);
        });
    }

    async function eliminarProducto(id) {
        try {
            console.log(`Eliminando producto con ID: ${id}`);

            const response = await fetch(`http://localhost:3000/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
            }

            alert("Producto eliminado correctamente");
            buscarProductos(); // Refrescar la lista de productos después de eliminar
        } catch (error) {
            console.error("Error eliminando producto:", error);
            alert("Hubo un problema al eliminar el producto");
        }
    }

    async function buscarProductos() {
        const query = searchInput.value.trim();
        const url = query === "" 
            ? "http://localhost:3000/" 
            : `http://localhost:3000/search?name=${query}`;
        cargarProductos(url);
    }

    searchInput.addEventListener("input", buscarProductos);
    cargarProductos("http://localhost:3000/");
});
