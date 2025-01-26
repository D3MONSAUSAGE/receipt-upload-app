// Select DOM elements
const uploadForm = document.getElementById("upload-form");
const receiptList = document.getElementById("receipt-list");

// Handle form submission
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const receiptName = document.getElementById("receipt-name").value;
  const receiptFile = document.getElementById("receipt-file").files[0];

  if (!receiptFile) {
    alert("Please select a file to upload.");
    return;
  }

  // Create a unique identifier for the receipt
  const receiptId = Date.now();

  // Create a receipt object
  const receipt = {
    id: receiptId,
    name: receiptName,
    fileName: receiptFile.name,
  };

  // Save receipt data to localStorage
  saveReceiptToLocalStorage(receipt);

  // Add receipt to the DOM
  addReceiptToDOM(receipt);

  // Reset form
  uploadForm.reset();
});

// Save receipt to localStorage
function saveReceiptToLocalStorage(receipt) {
  const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
  receipts.push(receipt);
  localStorage.setItem("receipts", JSON.stringify(receipts));
}

// Add receipt to the DOM
function addReceiptToDOM(receipt) {
    const li = document.createElement("li");
    li.className = "p-4 bg-white rounded shadow-md flex justify-between items-center";
    li.innerHTML = `
      <span>${receipt.name} (${receipt.fileName})</span>
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
  

// Load receipts from localStorage
function loadReceipts() {
  const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
  receipts.forEach((receipt) => addReceiptToDOM(receipt));
}
// View receipt details
function viewDetails(receiptId) {
    const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
    const receipt = receipts.find((r) => r.id === receiptId);
  
    if (receipt) {
      alert(`
        Receipt Name: ${receipt.name}
        File Name: ${receipt.fileName}
        Date Uploaded: ${new Date(receipt.id).toLocaleString()}
      `);
    } else {
      alert("Receipt not found.");
    }
  }

  function viewDetails(receiptId) {
    const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
    const receipt = receipts.find((r) => r.id === receiptId);
  
    if (receipt) {
      alert(`
        Receipt Name: ${receipt.name}
        File Name: ${receipt.fileName}
        Date Uploaded: ${new Date(receipt.id).toLocaleString()}
      `);
    } else {
      alert("Receipt not found.");
    }
  }
  
  
// Delete receipt
function deleteReceipt(receiptId) {
  // Remove from localStorage
  let receipts = JSON.parse(localStorage.getItem("receipts")) || [];
  receipts = receipts.filter((receipt) => receipt.id !== receiptId);
  localStorage.setItem("receipts", JSON.stringify(receipts));

  // Remove from DOM
  const receiptItems = document.querySelectorAll("#receipt-list li");
  receiptItems.forEach((item) => {
    if (item.textContent.includes(receiptId)) {
      item.remove();
    }
  });
}

// Initialize app
loadReceipts();
