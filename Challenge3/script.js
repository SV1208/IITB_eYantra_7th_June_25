class ProductManager {
    constructor() {
        this.products = [
            {
                "id": "1",
                "name": "Laptop",
                "description": "A high-performance laptop suitable for gaming and work.",
                "price": 1200.00
            },
            {
                "id": "2",
                "name": "Smartphone",
                "description": "A latest-generation smartphone with a large display and powerful camera.",
                "price": 800.00
            },
            {
                "id": "3",
                "name": "Wireless Headphones",
                "description": "Noise-cancelling wireless headphones with long battery life.",
                "price": 200.00
            },
            {
                "id": "4",
                "name": "Smartwatch",
                "description": "A smartwatch with fitness tracking and customizable watch faces.",
                "price": 150.00
            },
            {
                "id": "5",
                "name": "Tablet",
                "description": "A lightweight tablet with a sharp display, ideal for reading and browsing.",
                "price": 300.00
            }
        ];
        this.currentEditId = null;
        this.nextId = 6;
        this.editingRows = new Set();
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupKeyboardShortcuts();
        this.setupValidation();
        this.showKeyboardHint();
        this.renderProducts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to add new product
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.addNewProduct();
            }
            
            // Escape to cancel any editing
            if (e.key === 'Escape') {
                this.cancelAllEditing();
            }
        });

        // Add event delegation for Enter key in editable fields
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('editable') && e.key === 'Enter' && !e.shiftKey) {
                // For textarea, allow Shift+Enter for new lines
                if (e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                e.preventDefault();
                
                // Find the save button in the same row and click it
                const row = e.target.closest('tr');
                const saveBtn = row.querySelector('.save-btn');
                if (saveBtn) {
                    saveBtn.click();
                }
            }
        });
    }

    showKeyboardHint() {
        const hint = document.getElementById('keyboard-hint');
        if (hint) {
            setTimeout(() => {
                hint.classList.add('show');
                setTimeout(() => {
                    hint.classList.remove('show');
                }, 4000);
            }, 1000);
        }
    }

    setupValidation() {
        // Add real-time validation to editable fields
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('editable')) {
                this.validateField(e.target);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.dataset.field;
        
        // Remove previous validation classes
        field.classList.remove('valid', 'invalid');
        
        // Validate based on field type
        let isValid = false;
        
        switch(fieldType) {
            case 'name':
            case 'description':
                isValid = value.length > 0;
                break;
            case 'price':
                isValid = value > 0 && !isNaN(value);
                break;
        }
        
        // Add appropriate class
        field.classList.add(isValid ? 'valid' : 'invalid');
        
        return isValid;
    }

    cancelAllEditing() {
        // Cancel any new product being added
        const newProductRows = document.querySelectorAll('tr[data-id^="new-"]');
        newProductRows.forEach(row => {
            const tempId = row.getAttribute('data-id');
            this.cancelNewProduct(tempId);
        });
        
        // Cancel any existing product edits
        this.editingRows.forEach(id => {
            if (!id.startsWith('new-')) {
                this.cancelEdit(id);
            }
        });
    }

    // CREATE - Add new product
    createProduct(productData) {
        try {
            const newProduct = {
                id: this.nextId.toString(),
                name: productData.name,
                description: productData.description,
                price: parseFloat(productData.price)
            };
            
            this.products.push(newProduct);
            this.nextId++;
            this.saveToLocalStorage();
            this.showMessage('Product added successfully!', 'success');
            return newProduct;
        } catch (error) {
            this.showMessage('Error adding product: ' + error.message, 'error');
            throw error;
        }
    }

    // READ - Get all products
    getAllProducts() {
        return this.products;
    }

    // READ - Get product by ID
    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }

    // UPDATE - Update existing product
    updateProduct(id, productData) {
        try {
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error(`Product with ID ${id} not found`);
            }

            this.products[index] = {
                id: id,
                name: productData.name,
                description: productData.description,
                price: parseFloat(productData.price)
            };

            this.saveToLocalStorage();
            this.showMessage('Product updated successfully!', 'success');
            return this.products[index];
        } catch (error) {
            this.showMessage('Error updating product: ' + error.message, 'error');
            throw error;
        }
    }

    // DELETE - Remove product
    deleteProduct(id) {
        try {
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error(`Product with ID ${id} not found`);
            }

            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveToLocalStorage();
            this.showMessage('Product deleted successfully!', 'success');
            return deletedProduct;
        } catch (error) {
            this.showMessage('Error deleting product: ' + error.message, 'error');
            throw error;
        }
    }

    // Inline editing functions
    editProduct(id) {
        if (this.editingRows.has(id)) return;
        
        this.editingRows.add(id);
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const product = this.getProductById(id);
        
        row.innerHTML = `
            <td>${product.id}</td>
            <td><input type="text" class="editable" value="${this.escapeHtml(product.name)}" data-field="name"></td>
            <td class="description-col"><textarea class="editable textarea" data-field="description">${this.escapeHtml(product.description)}</textarea></td>
            <td><input type="number" class="editable" value="${product.price}" step="0.01" data-field="price"></td>
            <td>
                <div class="product-actions">
                    <button class="save-btn" onclick="productManager.saveProduct('${id}')">Save</button>
                    <button class="cancel-btn" onclick="productManager.cancelEdit('${id}')">Cancel</button>
                </div>
            </td>
        `;
    }

    saveProduct(id) {
        try {
            const row = document.querySelector(`tr[data-id="${id}"]`);
            const formData = {
                name: row.querySelector('[data-field="name"]').value.trim(),
                description: row.querySelector('[data-field="description"]').value.trim(),
                price: row.querySelector('[data-field="price"]').value
            };

            // Validation
            if (!formData.name || !formData.description || !formData.price) {
                throw new Error('All fields are required');
            }

            if (formData.price <= 0) {
                throw new Error('Price must be greater than 0');
            }

            this.updateProduct(id, formData);
            this.editingRows.delete(id);
            this.renderProducts();
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    addNewProduct() {
        try {
            // Create a temporary ID for the new product
            const tempId = `new-${Date.now()}`;
            
            // Check if we're already adding a new product
            if (this.editingRows.has(tempId) || document.querySelector(`tr[data-id^="new-"]`)) {
                this.showMessage('Please complete the current product entry first', 'error');
                return;
            }

            this.editingRows.add(tempId);
            
            // Check for saved draft
            const draft = this.loadDraft();
            
            // Add new row at the top of the table
            const tbody = document.getElementById('products-list');
            const newRow = document.createElement('tr');
            newRow.setAttribute('data-id', tempId);
            newRow.classList.add('new-product-row');
            
            newRow.innerHTML = `
                <td>-</td>
                <td><input type="text" class="editable" placeholder="Product name" data-field="name" value="${draft.name || ''}"></td>
                <td class="description-col"><textarea class="editable textarea" placeholder="Product description" data-field="description">${draft.description || ''}</textarea></td>
                <td><input type="number" class="editable" placeholder="0.00" step="0.01" data-field="price" value="${draft.price || ''}"></td>
                <td>
                    <div class="product-actions">
                        <button class="save-btn" onclick="productManager.saveNewProduct('${tempId}')">Save</button>
                        <button class="cancel-btn" onclick="productManager.cancelNewProduct('${tempId}')">Cancel</button>
                    </div>
                </td>
            `;
            
            tbody.insertBefore(newRow, tbody.firstChild);
            
            // Setup auto-save for draft
            this.setupDraftAutoSave(newRow);
            
            // Focus on the name field
            const nameInput = newRow.querySelector('[data-field="name"]');
            if (nameInput) {
                nameInput.focus();
                if (draft.name) {
                    nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
                }
            }
            
        } catch (error) {
            this.showMessage('Error creating new product: ' + error.message, 'error');
        }
    }

    setupDraftAutoSave(row) {
        const inputs = row.querySelectorAll('.editable');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveDraft(row);
            });
        });
    }

    saveDraft(row) {
        const draft = {
            name: row.querySelector('[data-field="name"]').value,
            description: row.querySelector('[data-field="description"]').value,
            price: row.querySelector('[data-field="price"]').value
        };
        localStorage.setItem('productDraft', JSON.stringify(draft));
    }

    loadDraft() {
        const saved = localStorage.getItem('productDraft');
        return saved ? JSON.parse(saved) : {};
    }

    clearDraft() {
        localStorage.removeItem('productDraft');
    }

    saveNewProduct(tempId) {
        try {
            const row = document.querySelector(`tr[data-id="${tempId}"]`);
            const formData = {
                name: row.querySelector('[data-field="name"]').value.trim(),
                description: row.querySelector('[data-field="description"]').value.trim(),
                price: row.querySelector('[data-field="price"]').value
            };

            // Validation
            if (!formData.name || !formData.description || !formData.price) {
                throw new Error('All fields are required');
            }

            if (formData.price <= 0) {
                throw new Error('Price must be greater than 0');
            }

            // Create the actual product
            this.createProduct(formData);
            this.editingRows.delete(tempId);
            this.clearDraft();
            this.renderProducts();
            this.showMessage('Product added successfully!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    cancelNewProduct(tempId) {
        this.editingRows.delete(tempId);
        const row = document.querySelector(`tr[data-id="${tempId}"]`);
        if (row) {
            row.remove();
        }
        this.clearDraft();
    }

    cancelEdit(id) {
        this.editingRows.delete(id);
        this.renderProducts();
    }

    confirmDelete(id) {
        const product = this.getProductById(id);
        const productName = product ? product.name : 'Unknown Product';
        
        if (confirm(`Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`)) {
            try {
                this.deleteProduct(id);
                this.editingRows.delete(id);
                this.renderProducts();
            } catch (error) {
                this.showMessage(error.message, 'error');
            }
        }
    }

    renderProducts(productsToRender = this.products) {
        const tbody = document.getElementById('products-list');
        const searchCount = document.getElementById('search-count');
        
        // Update search results count
        if (searchCount) {
            const searchTerm = document.getElementById('search').value.trim();
            if (searchTerm) {
                searchCount.textContent = `${productsToRender.length} found`;
                searchCount.style.display = 'block';
            } else {
                searchCount.style.display = 'none';
            }
        }
        
        if (productsToRender.length === 0) {
            const searchTerm = document.getElementById('search').value.trim();
            const message = searchTerm ? 'No products match your search' : 'No products found';
            tbody.innerHTML = `<tr><td colspan="5" class="no-products">${message}</td></tr>`;
            return;
        }

        tbody.innerHTML = productsToRender.map(product => `
            <tr data-id="${product.id}">
                <td>${product.id}</td>
                <td>${this.escapeHtml(product.name)}</td>
                <td class="description-col">${this.escapeHtml(product.description)}</td>
                <td class="price-cell">$${product.price.toFixed(2)}</td>
                <td>
                    <div class="product-actions">
                        <button class="edit-btn" onclick="productManager.editProduct('${product.id}')">Edit</button>
                        <button class="delete-btn" onclick="productManager.confirmDelete('${product.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    filterProducts() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        this.renderProducts(filteredProducts);
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.classList.add('show');

        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    }

    saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(this.products));
        localStorage.setItem('nextId', this.nextId.toString());
    }

    loadFromLocalStorage() {
        const savedProducts = localStorage.getItem('products');
        const savedNextId = localStorage.getItem('nextId');

        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        }

        if (savedNextId) {
            this.nextId = parseInt(savedNextId);
        }
    }
}

// Global functions for onclick handlers
let productManager;

function filterProducts() {
    productManager.filterProducts();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    productManager = new ProductManager();
});
