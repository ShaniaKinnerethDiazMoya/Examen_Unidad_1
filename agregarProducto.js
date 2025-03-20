document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector(".formulario");
    const precioInput = document.getElementById("precio");
    const stockInput = document.getElementById("stock");

    formulario.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que la página se recargue
        
        // Obtener los valores del formulario
        const nombre = document.getElementById("nombre").value.trim();
        const precio = precioInput.value.trim();
        const stock = stockInput.value.trim();

        // Validaciones
        if (!nombre) {
            alert("El nombre no puede estar vacío.");
            return;
        }

        if (!/^\d+$/.test(stock) || parseInt(stock) < 0) {
            alert("El stock debe ser un número entero positivo.");
            return;
        }

        // Verificar si el producto ya existe (comprobación de nombre)
        try {
            const response = await fetch(`http://localhost:3000/productos?name=${encodeURIComponent(nombre)}`);
            const productosExistentes = await response.json();

            if (productosExistentes.length > 0) {
                alert("Este producto ya existe.");
                return;
            }

            // Construir el objeto del producto
            const nuevoProducto = {
                name: nombre,
                price: parseFloat(precio),
                stock: parseInt(stock)
            };

            // Enviar el nuevo producto al servidor
            const postResponse = await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto)
            });

            if (!postResponse.ok) {
                throw new Error("Error al agregar producto");
            }

            const data = await postResponse.json();
            alert("Producto agregado con éxito: " + data.name);

            // Limpiar formulario
            this.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo agregar el producto ya existe");
        }
    });

    // Validación en tiempo real para el campo de precio
    precioInput.addEventListener("keydown", function (event) {
        if (!/[\d.]/.test(event.key) && event.key !== "Backspace" && event.key !== "Tab") {
            event.preventDefault();
            alert("Solo se permiten números enteros en el precio.");
        }
    });

    // Validación en tiempo real para el campo de stock
    stockInput.addEventListener("keydown", function (event) {
        if (!/\d/.test(event.key) && event.key !== "Backspace" && event.key !== "Tab") {
            event.preventDefault();
            alert("Solo se permiten números enteros en el stock.");
        }
    });
});
