// Initialize PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090');

// Select the app container
const app = document.getElementById("app");

// Function to render the login page
function renderLoginPage() {
  app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-4">Login</h2>
        <form id="login-form">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" class="block w-full mt-1 p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" class="block w-full mt-1 p-2 border rounded" required />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  `;

  // Add login form submission functionality
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // Authenticate with PocketBase
      const authData = await pb.collection('users').authWithPassword(username, password);

      // If successful, load the receipt app
      loadReceiptApp();
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// Function to render the receipt management app
function loadReceiptApp() {
  app.innerHTML = `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold text-center mb-6">Receipt Upload App</h1>

      <!-- Logout Button -->
      <div class="text-right mb-4">
        <button
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onclick="logout()"
        >
          Logout
        </button>
      </div>

      <!-- Upload Form -->
      <form id="upload-form" class="bg-white p-6 rounded shadow-md mb-6">
        <label class="block mb-4">
          <span class="text-gray-700">Receipt Name:</span>
          <input
            type="text"
            id="receipt-name"
            class="block w-full mt-1 p-2 border rounded"
            placeholder="Enter receipt name"
            required
          />
        </label>

        <label class="block mb-4">
          <span class="text-gray-700">Upload Receipt:</span>
          <input
            type="file"
            id="receipt-file"
            class="block w-full mt-1 p-2 border rounded"
            accept=".jpg,.jpeg,.png,.pdf"
            required
          />
        </label>

        <label class="block mb-4">
          <span class="text-gray-700">Category:</span>
          <select id="receipt-category" class="block w-full mt-1 p-2 border rounded">
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <button
          type="submit"
          class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>

      <!-- Uploaded Receipts List -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Uploaded Receipts</h2>
        <ul id="receipt-list" class="space-y-4"></ul>
      </div>
    </div>
  `;

  // Load receipts and add upload functionality
  loadReceipts();

  const uploadForm = document.getElementById("upload-form");
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const receiptName = document.getElementById("receipt-name").value;
    const receiptFile = document.getElementById("receipt-file").files[0];
    const receiptCategory = document.getElementById("receipt-category").value;

    if (!receiptFile) {
      alert("Please select a file to upload.");
      return;
    }

    const receiptId = Date.now();
    const receipt = {
      id: receiptId,
      name: receiptName,
      fileName: receiptFile.name,
      category: receiptCategory,
    };

    saveReceiptToLocalStorage(receipt);
    addReceiptToDOM(receipt);
    uploadForm.reset();
  });
}

// Logout function
function logout() {
  pb.authStore.clear();
  renderLoginPage();
}

// Save receipt to localStorage
function saveReceiptToLocalStorage(receipt) {
  const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
  receipts.push(receipt);
  localStorage.setItem("receipts", JSON.stringify(receipts));
}

// Add receipt to the DOM
function addReceiptToDOM(receipt) {
  const receiptList = document.getElementById("receipt-list");
  const li = document.createElement("li");
  li.className = "p-4 bg-white rounded shadow-md flex justify-between items-center";
  li.innerHTML = `
    <span>${receipt.name} (${receipt.fileName}) - ${receipt.category}</span>
    <div>
      <button
        class="text-blue-500 hover:text-blue-700 mr-4"
        onclick="viewDetails(${receipt.id})"
      >
        View Details
      </button>
      <button
        class="text-red-500 hover:text-red-700"
        onclick="deleteReceipt(${receipt.id})"
      >
        Delete
      </button>
    </div>
  `;
  receiptList.appendChild(li);
}

// View receipt details
function viewDetails(receiptId) {
  const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
  const receipt = receipts.find((r) => r.id === receiptId);

  if (receipt) {
    alert(`
      Receipt Name: ${receipt.name}
      File Name: ${receipt.fileName}
      Category: ${receipt.category}
      Date Uploaded: ${new Date(receipt.id).toLocaleString()}
    `);
  } else {
    alert("Receipt not found.");
  }
}

// Delete receipt
function deleteReceipt(receiptId) {
  let receipts = JSON.parse(localStorage.getItem("receipts")) || [];
  receipts = receipts.filter((receipt) => receipt.id !== receiptId);
  localStorage.setItem("receipts", JSON.stringify(receipts));

  const receiptList = document.getElementById("receipt-list");
  receiptList.innerHTML = "";
  loadReceipts();
}

// Load receipts from localStorage
function loadReceipts() {
  const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
  receipts.forEach((receipt) => addReceiptToDOM(receipt));
}

// Initialize the app
if (pb.authStore.isValid) {
  loadReceiptApp();
} else {
  renderLoginPage();
}
