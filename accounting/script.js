document.addEventListener("DOMContentLoaded", function() {
    const balanceDisplay = document.getElementById("balance");
    const transactionList = document.getElementById("transaction-list");
    const transactionForm = document.getElementById("transaction-form");
    const filterCategory = document.getElementById("filter-category");
    const sortSelect = document.getElementById("sort-select");
    const searchInput = document.getElementById("search-input");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const exportBtn = document.getElementById("export-btn");
    const undoBtn = document.getElementById("undo-btn");

    let balance = 0;
    let transactions = [];
    let lastTransaction = null;

    function updateBalance() {
        balance = transactions.reduce((total, transaction) => {
            if (transaction.category === "income") {
                return total + transaction.amount;
            } else {
                return total - transaction.amount;
            }
        }, 0);
        balanceDisplay.textContent = `Balance: ₹${balance.toFixed(2)}`;
        balanceDisplay.classList.toggle("negative", balance < 0);
    }

    function renderTransactions() {
        const filteredTransactions = filterCategory.value === "all" ?
            transactions :
            transactions.filter(transaction => transaction.category === filterCategory.value);

        const sortedTransactions = sortSelect.value === "amount" ?
            filteredTransactions.sort((a, b) => a.amount - b.amount) :
            filteredTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const searchQuery = searchInput.value.toLowerCase();
        const searchedTransactions = sortedTransactions.filter(transaction =>
            transaction.description.toLowerCase().includes(searchQuery)
        );

        transactionList.innerHTML = "";
        searchedTransactions.forEach((transaction, index) => {
            const item = document.createElement("div");
            item.innerHTML = `
                <span>${transaction.description}: ₹${transaction.amount.toFixed(2)} (${transaction.category}) - ${transaction.date}</span>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            transactionList.appendChild(item);
        });

        attachEditDeleteListeners();
    }

    function attachEditDeleteListeners() {
        const editButtons = document.querySelectorAll(".edit-btn");
        const deleteButtons = document.querySelectorAll(".delete-btn");

        editButtons.forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(button.dataset.index);
                editTransaction(index);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(button.dataset.index);
                deleteTransaction(index);
            });
        });
    }

    function editTransaction(index) {
        const editedDescription = prompt("Enter new description:");
        const editedAmount = parseFloat(prompt("Enter new amount:"));
        const editedCategory = prompt("Enter new category (income/expense):");
        
        if (!isNaN(editedAmount) && (editedCategory === "income" || editedCategory === "expense")) {
            transactions[index].description = editedDescription;
            transactions[index].amount = editedAmount;
            transactions[index].category = editedCategory;
            renderTransactions();
            updateBalance();
        } else {
            alert("Invalid input. Please enter a valid amount and category.");
        }
    }

    function deleteTransaction(index) {
        if (confirm("Are you sure you want to delete this transaction?")) {
            transactions.splice(index, 1);
            renderTransactions();
            updateBalance();
        }
    }

    // Event listener for transaction form submission
    transactionForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const category = document.getElementById("category").value;
        if (!isNaN(amount)) {
            const timestamp = new Date().toLocaleString();
            const date = new Date().toLocaleDateString();
            const transaction = { description, amount, category, timestamp, date };
            transactions.push(transaction);
            lastTransaction = transaction;
            renderTransactions();
            updateBalance();
            transactionForm.reset();
        } else {
            alert("Please enter a valid amount.");
        }
    });

    // Event listener for filter category change
    filterCategory.addEventListener("change", function() {
        renderTransactions();
    });

    // Event listener for sort select change
    sortSelect.addEventListener("change", function() {
        renderTransactions();
    });

    // Event listener for search input change
    searchInput.addEventListener("input", function() {
        renderTransactions();
    });

    // Event listener for clear all transactions button
    clearAllBtn.addEventListener("click", function() {
        if (confirm("Are you sure you want to clear all transactions?")) {
            transactions = [];
            lastTransaction = null;
            renderTransactions();
            updateBalance();
        }
    });

    // Event listener for export button
    exportBtn.addEventListener("click", function() {
        const csvContent = transactions.map(transaction => `${transaction.description},${transaction.amount},${transaction.category},${transaction.date},${transaction.timestamp}`).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transactions.csv";
        link.click();
    });

    // Event listener for undo button
    undoBtn.addEventListener("click", function() {
        if (lastTransaction) {
            transactions.pop();
            lastTransaction = null;
            renderTransactions();
            updateBalance();
        } else {
            alert("No transaction to undo.");
        }
    });

    // Initial rendering
    renderTransactions();
    updateBalance();
});
