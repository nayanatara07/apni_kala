document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inventory-form');
    const tableBody = document.querySelector('#inventory-table tbody');
    const searchInput = document.getElementById('search-input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = document.getElementById('item-name').value;
        const itemQuantity = document.getElementById('item-quantity').value;
        const itemPrice = document.getElementById('item-price').value;

        if (itemName && itemQuantity && itemPrice) {
            addItemToTable(itemName, itemQuantity, itemPrice);
            form.reset();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterItems(searchTerm);
    });

    function addItemToTable(name, quantity, price) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="item-name">${name}</td>
            <td class="item-quantity">${quantity}</td>
            <td class="item-price">${price}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);

        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => {
            editItem(row);
        });

        deleteBtn.addEventListener('click', () => {
            row.remove();
        });
    }

    function editItem(row) {
        const nameCell = row.querySelector('.item-name');
        const quantityCell = row.querySelector('.item-quantity');
        const priceCell = row.querySelector('.item-price');

        const newName = prompt('Edit Item Name', nameCell.textContent);
        const newQuantity = prompt('Edit Item Quantity', quantityCell.textContent);
        const newPrice = prompt('Edit Item Price', priceCell.textContent);

        if (newName && newQuantity && newPrice) {
            nameCell.textContent = newName;
            quantityCell.textContent = newQuantity;
            priceCell.textContent = newPrice;
        }
    }

    function filterItems(searchTerm) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const name = row.querySelector('.item-name').textContent.toLowerCase();
            const quantity = row.querySelector('.item-quantity').textContent.toLowerCase();
            const price = row.querySelector('.item-price').textContent.toLowerCase();
            if (name.includes(searchTerm) || quantity.includes(searchTerm) || price.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
});
