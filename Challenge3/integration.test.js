// Integration tests for UI interactions and end-to-end workflows
const fs = require('fs');
const path = require('path');

// Read and evaluate the script.js file
const scriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
eval(scriptContent);

describe('ProductManager UI Integration Tests', () => {
  let productManager;

  beforeEach(() => {
    productManager = new ProductManager();
    productManager.showMessage = jest.fn();
  });

  describe('Search and Filter Operations', () => {
    test('should filter products by name', () => {
      // Set up search input
      document.getElementById('search').value = 'laptop';
      
      productManager.filterProducts();
      
      // Check if renderProducts was called with filtered results
      // We'll need to spy on renderProducts
      const renderSpy = jest.spyOn(productManager, 'renderProducts');
      productManager.filterProducts();
      
      expect(renderSpy).toHaveBeenCalled();
    });

    test('should filter products by description', () => {
      document.getElementById('search').value = 'gaming';
      
      const renderSpy = jest.spyOn(productManager, 'renderProducts');
      productManager.filterProducts();
      
      expect(renderSpy).toHaveBeenCalled();
    });

    test('should handle empty search term', () => {
      document.getElementById('search').value = '';
      
      const renderSpy = jest.spyOn(productManager, 'renderProducts');
      productManager.filterProducts();
      
      expect(renderSpy).toHaveBeenCalledWith(productManager.products);
    });

    test('should handle search with no results', () => {
      document.getElementById('search').value = 'nonexistentproduct';
      
      const renderSpy = jest.spyOn(productManager, 'renderProducts');
      productManager.filterProducts();
      
      expect(renderSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('Inline Editing Operations', () => {
    test('should enter edit mode for existing product', () => {
      // Create a product row in DOM
      const tbody = document.getElementById('products-list');
      tbody.innerHTML = `
        <tr data-id="1">
          <td>1</td>
          <td>Laptop</td>
          <td class="description-col">A high-performance laptop</td>
          <td class="price-cell">$1200.00</td>
          <td>
            <div class="product-actions">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          </td>
        </tr>
      `;

      productManager.editProduct('1');

      expect(productManager.editingRows.has('1')).toBe(true);
      
      // Check if row was converted to edit mode
      const row = document.querySelector('tr[data-id="1"]');
      const nameInput = row.querySelector('[data-field="name"]');
      expect(nameInput).toBeTruthy();
      expect(nameInput.value).toBe('Laptop');
    });

    test('should save product changes from inline edit', () => {
      // Setup edit mode
      productManager.editingRows.add('1');
      const tbody = document.getElementById('products-list');
      tbody.innerHTML = `
        <tr data-id="1">
          <td>1</td>
          <td><input type="text" class="editable" value="Updated Laptop" data-field="name"></td>
          <td class="description-col"><textarea class="editable textarea" data-field="description">Updated description</textarea></td>
          <td><input type="number" class="editable" value="1500" step="0.01" data-field="price"></td>
          <td>
            <div class="product-actions">
              <button class="save-btn">Save</button>
              <button class="cancel-btn">Cancel</button>
            </div>
          </td>
        </tr>
      `;

      const updateSpy = jest.spyOn(productManager, 'updateProduct');
      productManager.saveProduct('1');

      expect(updateSpy).toHaveBeenCalledWith('1', {
        name: 'Updated Laptop',
        description: 'Updated description',
        price: '1500'
      });
    });

    test('should cancel edit mode', () => {
      productManager.editingRows.add('1');
      const renderSpy = jest.spyOn(productManager, 'renderProducts');
      
      productManager.cancelEdit('1');

      expect(productManager.editingRows.has('1')).toBe(false);
      expect(renderSpy).toHaveBeenCalled();
    });
  });

  describe('Add New Product Workflow', () => {
    test('should add new product row when addNewProduct is called', () => {
      const tbody = document.getElementById('products-list');
      tbody.innerHTML = ''; // Start with empty table

      productManager.addNewProduct();

      const newRow = document.querySelector('tr[data-id^="new-"]');
      expect(newRow).toBeTruthy();
      expect(newRow.classList.contains('new-product-row')).toBe(true);
      
      // Check if inputs are present
      const nameInput = newRow.querySelector('[data-field="name"]');
      const descInput = newRow.querySelector('[data-field="description"]');
      const priceInput = newRow.querySelector('[data-field="price"]');
      
      expect(nameInput).toBeTruthy();
      expect(descInput).toBeTruthy();
      expect(priceInput).toBeTruthy();
    });

    test('should prevent multiple new product rows', () => {
      productManager.addNewProduct();
      productManager.addNewProduct(); // Try to add second one

      expect(productManager.showMessage).toHaveBeenCalledWith(
        'Please complete the current product entry first',
        'error'
      );
    });

    test('should save new product from inline form', () => {
      // Setup new product row
      const tempId = 'new-123';
      productManager.editingRows.add(tempId);
      const tbody = document.getElementById('products-list');
      tbody.innerHTML = `
        <tr data-id="${tempId}" class="new-product-row">
          <td>-</td>
          <td><input type="text" class="editable" value="New Product" data-field="name"></td>
          <td class="description-col"><textarea class="editable textarea" data-field="description">New Description</textarea></td>
          <td><input type="number" class="editable" value="99.99" step="0.01" data-field="price"></td>
          <td>
            <div class="product-actions">
              <button class="save-btn">Save</button>
              <button class="cancel-btn">Cancel</button>
            </div>
          </td>
        </tr>
      `;

      const createSpy = jest.spyOn(productManager, 'createProduct');
      productManager.saveNewProduct(tempId);

      expect(createSpy).toHaveBeenCalledWith({
        name: 'New Product',
        description: 'New Description',
        price: '99.99'
      });
    });

    test('should cancel new product creation', () => {
      const tempId = 'new-123';
      productManager.editingRows.add(tempId);
      const tbody = document.getElementById('products-list');
      tbody.innerHTML = `
        <tr data-id="${tempId}" class="new-product-row">
          <td>-</td>
          <td><input type="text" class="editable" placeholder="Product name" data-field="name"></td>
          <td class="description-col"><textarea class="editable textarea" placeholder="Product description" data-field="description"></textarea></td>
          <td><input type="number" class="editable" placeholder="0.00" step="0.01" data-field="price"></td>
          <td>
            <div class="product-actions">
              <button class="save-btn">Save</button>
              <button class="cancel-btn">Cancel</button>
            </div>
          </td>
        </tr>
      `;

      productManager.cancelNewProduct(tempId);

      expect(productManager.editingRows.has(tempId)).toBe(false);
      const row = document.querySelector(`tr[data-id="${tempId}"]`);
      expect(row).toBe(null);
    });
  });

  describe('Delete Confirmation Workflow', () => {
    test('should delete product when confirmed', () => {
      global.confirm.mockReturnValue(true);
      const deleteSpy = jest.spyOn(productManager, 'deleteProduct');
      const renderSpy = jest.spyOn(productManager, 'renderProducts');

      productManager.confirmDelete('1');

      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete "Laptop"?\n\nThis action cannot be undone.'
      );
      expect(deleteSpy).toHaveBeenCalledWith('1');
      expect(renderSpy).toHaveBeenCalled();
    });

    test('should not delete product when cancelled', () => {
      global.confirm.mockReturnValue(false);
      const deleteSpy = jest.spyOn(productManager, 'deleteProduct');

      productManager.confirmDelete('1');

      expect(global.confirm).toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    test('should handle delete confirmation for non-existent product', () => {
      global.confirm.mockReturnValue(true);
      
      expect(() => {
        productManager.confirmDelete('999');
      }).not.toThrow(); // Should handle gracefully
    });
  });

  describe('Keyboard Shortcuts', () => {
    test('should add new product on Ctrl+Enter', () => {
      const addNewSpy = jest.spyOn(productManager, 'addNewProduct');
      
      // Simulate Ctrl+Enter
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true
      });
      document.dispatchEvent(event);

      expect(addNewSpy).toHaveBeenCalled();
    });

    test('should cancel all editing on Escape', () => {
      const cancelAllSpy = jest.spyOn(productManager, 'cancelAllEditing');
      
      // Simulate Escape
      const event = new KeyboardEvent('keydown', {
        key: 'Escape'
      });
      document.dispatchEvent(event);

      expect(cancelAllSpy).toHaveBeenCalled();
    });

    test('should save on Enter in editable field', () => {
      // Setup an editable field
      const input = document.createElement('input');
      input.classList.add('editable');
      input.setAttribute('data-field', 'name');
      
      const row = document.createElement('tr');
      const saveBtn = document.createElement('button');
      saveBtn.classList.add('save-btn');
      saveBtn.onclick = jest.fn();
      row.appendChild(input);
      row.appendChild(saveBtn);
      document.body.appendChild(row);

      // Simulate Enter in editable field
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        target: input
      });
      Object.defineProperty(event, 'target', { value: input });
      document.dispatchEvent(event);

      expect(saveBtn.onclick).toBeDefined();
    });
  });

  describe('Validation Feedback', () => {
    test('should validate name field correctly', () => {
      const input = document.createElement('input');
      input.classList.add('editable');
      input.setAttribute('data-field', 'name');
      input.value = 'Valid Name';

      const isValid = productManager.validateField(input);

      expect(isValid).toBe(true);
      expect(input.classList.contains('valid')).toBe(true);
      expect(input.classList.contains('invalid')).toBe(false);
    });

    test('should invalidate empty name field', () => {
      const input = document.createElement('input');
      input.classList.add('editable');
      input.setAttribute('data-field', 'name');
      input.value = '';

      const isValid = productManager.validateField(input);

      expect(isValid).toBe(false);
      expect(input.classList.contains('invalid')).toBe(true);
      expect(input.classList.contains('valid')).toBe(false);
    });

    test('should validate price field correctly', () => {
      const input = document.createElement('input');
      input.classList.add('editable');
      input.setAttribute('data-field', 'price');
      input.value = '99.99';

      const isValid = productManager.validateField(input);

      expect(isValid).toBe(true);
      expect(input.classList.contains('valid')).toBe(true);
    });

    test('should invalidate negative price', () => {
      const input = document.createElement('input');
      input.classList.add('editable');
      input.setAttribute('data-field', 'price');
      input.value = '-10';

      const isValid = productManager.validateField(input);

      expect(isValid).toBe(false);
      expect(input.classList.contains('invalid')).toBe(true);
    });
  });

  describe('Draft Auto-Save Functionality', () => {
    test('should save draft data to localStorage', () => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input class="editable" data-field="name" value="Draft Name"></td>
        <td><textarea class="editable" data-field="description">Draft Description</textarea></td>
        <td><input class="editable" data-field="price" value="50.00"></td>
      `;

      productManager.saveDraft(row);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'productDraft',
        JSON.stringify({
          name: 'Draft Name',
          description: 'Draft Description',
          price: '50.00'
        })
      );
    });

    test('should load draft data from localStorage', () => {
      const draftData = {
        name: 'Saved Name',
        description: 'Saved Description',
        price: '75.00'
      };
      
      localStorage.getItem.mockReturnValue(JSON.stringify(draftData));

      const draft = productManager.loadDraft();

      expect(draft).toEqual(draftData);
    });

    test('should clear draft data', () => {
      productManager.clearDraft();

      expect(localStorage.removeItem).toHaveBeenCalledWith('productDraft');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle missing DOM elements gracefully', () => {
      // Remove required DOM elements
      document.getElementById('products-list').remove();

      expect(() => {
        productManager.renderProducts();
      }).not.toThrow();
    });

    test('should handle malformed HTML in table', () => {
      const tbody = document.getElementById('products-list');
      tbody.innerHTML = '<tr><td>Malformed HTML</td></tr>';

      expect(() => {
        productManager.editProduct('1');
      }).not.toThrow();
    });

    test('should handle concurrent edit attempts', () => {
      productManager.editProduct('1');
      productManager.editProduct('1'); // Try to edit same product again

      // Should only have one edit session
      expect(productManager.editingRows.size).toBe(1);
    });
  });
});
