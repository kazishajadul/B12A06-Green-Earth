const plantsContainer = document.getElementById("plants-container");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
let cart = {};

// Load all plants
async function loadPlants() {
  plantsContainer.innerHTML = `<p class="col-span-full text-center text-gray-500">Loading plants...</p>`;
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  displayPlants(data.plants || data.data || []);
}

// Load plants by category
async function loadPlantsByCategory(id) {
  plantsContainer.innerHTML = `<p class="col-span-full text-center text-gray-500">Loading plants...</p>`;
  const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
  const data = await res.json();
  displayPlants(data.plants || []);
}

// Display plants
function displayPlants(plants) {
  plantsContainer.innerHTML = "";

  if (!plants || plants.length === 0) {
    plantsContainer.innerHTML = `<p class="col-span-full text-center text-red-500">No plants found!</p>`;
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className =
      "flex flex-col p-4 overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg";

    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="h-40 w-full object-cover rounded-md cursor-pointer">
      <h2 class="text-lg font-bold mt-3 text-gray-800">${plant.name}</h2>
      <p class="text-sm text-gray-600 mt-2">${plant.description?.slice(0, 60) || "No description"}...</p>
      <div class="flex justify-between items-center mt-4">
        <span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">${plant.category || "Plant"}</span>
        <span class="font-semibold text-gray-700">৳${plant.price || 500}</span>
      </div>
      <button 
        class="w-full bg-green-600 text-white py-2 mt-4 rounded-full hover:bg-green-700 transition">
        Add to Cart
      </button>
    `;

    // Image click → open modal
    card.querySelector("img").addEventListener("click", () =>
      openModal(plant.id)
    );

    // Add to cart
    card.querySelector("button").addEventListener("click", () =>
      addToCart(plant)
    );

    plantsContainer.appendChild(card);
  });
}

// Add to cart
function addToCart(plant) {
  if (cart[plant.id]) {
    cart[plant.id].qty += 1;
  } else {
    cart[plant.id] = { ...plant, qty: 1 };
  }
  displayCart();
}

// Remove from cart
function removeFromCart(id) {
  if (cart[id]) {
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) delete cart[id];
  }
  displayCart();
}

// Display cart
function displayCart() {
  cartList.innerHTML = "";
  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartList.innerHTML = `<li class="text-gray-500">Cart is empty</li>`;
  } else {
    for (let id in cart) {
      const item = cart[id];
      total += item.price * item.qty;

      const li = document.createElement("li");
      li.className =
        "flex items-center justify-between p-2 bg-gray-100 rounded";
      li.innerHTML = `
        <span>${item.name} (x${item.qty})</span>
        <div class="flex gap-2">
          <button class="px-2 bg-green-500 text-white rounded">+</button>
          <button class="px-2 bg-red-500 text-white rounded">-</button>
        </div>
      `;

      li.querySelector("button:nth-child(1)").addEventListener("click", () =>
        addToCart(item)
      );
      li.querySelector("button:nth-child(2)").addEventListener("click", () =>
        removeFromCart(item.id)
      );

      cartList.appendChild(li);
    }
  }

  cartTotal.textContent = total;
}

// Open modal
async function openModal(id) {
  const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
  const data = await res.json();
  const plant = data.plant;

  document.getElementById("modal-title").textContent = plant.name;
  document.getElementById("modal-image").src = plant.image;
  document.getElementById("modal-description").textContent =
    plant.description || "No description available";
  document.getElementById("modal-category").textContent = plant.category;
  document.getElementById("modal-price").textContent = plant.price;

  document.getElementById("plant-modal").showModal();
}

//  Initial load
loadPlants();
