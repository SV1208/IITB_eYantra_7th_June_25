// Test setup file for Jest
// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock window.confirm for delete operations
global.confirm = jest.fn();

// Mock alert for some operations
global.alert = jest.fn();

// Setup DOM elements that the ProductManager expects
beforeEach(() => {
  document.body.innerHTML = `
    <div class="container">
      <div class="search-container">
        <input type="text" id="search" placeholder="Search products...">
        <div class="search-results-count" id="search-count"></div>
      </div>
      <div class="products-container">
        <div class="products-header">
          <h2>Products</h2>
          <button class="add-product-btn" onclick="productManager.addNewProduct()">
            <span class="plus-icon">+</span>
            Add Product
          </button>
        </div>
        <div class="table-container">
          <table id="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="products-list">
            </tbody>
          </table>
        </div>
      </div>
      <div id="message" class="message"></div>
      <div id="keyboard-hint" class="keyboard-hint">
        <kbd>Ctrl</kbd>+<kbd>Enter</kbd> Add Product | <kbd>Enter</kbd> Save | <kbd>Esc</kbd> Cancel
      </div>
    </div>
  `;
  
  // Clear mocks
  jest.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  document.body.innerHTML = '';
});
