# Product Management System - Challenge 3

A complete CRUD (Create, Read, Update, Delete) application built with HTML, CSS, and JavaScript for managing products.

## Features

### Core CRUD Operations
- **CREATE**: Add new products with name, description, and price (POST /api/items)
- **READ**: View all products in a card-based layout (GET /api/items)
- **READ BY ID**: Get specific product by ID (GET /api/items/{id})
- **UPDATE**: Edit existing products inline (PUT /api/items/{id})
- **DELETE**: Remove products with confirmation dialog (DELETE /api/items/{id})

### Additional Features
- **Search & Filter**: Real-time product filtering by name or description
- **Data Persistence**: Uses localStorage to save data between sessions
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Client-side validation with error handling
- **Success/Error Messages**: Toast notifications for user feedback

### Exception Handling
- Form validation (required fields, price validation)
- Error messages for invalid operations
- Try-catch blocks for all CRUD operations
- User-friendly error notifications
- Graceful handling of localStorage failures

## API-like Structure

The JavaScript implementation follows REST API patterns:

```javascript
// GET /api/items - Retrieve all items
getAllProducts()

// GET /api/items/{id} - Retrieve an item by its ID
getProductById(id)

// POST /api/items - Create a new item
createProduct(productData)

// PUT /api/items/{id} - Update an existing item
updateProduct(id, productData)

// DELETE /api/items/{id} - Delete an item
deleteProduct(id)
```

## Project Structure

```
Challenge3/
├── index.html      # Main HTML file with form and product display
├── styles.css      # Modern CSS styling with gradients and animations
├── script.js       # JavaScript functionality with ProductManager class
└── README.md       # This documentation file
```

## How to Run

1. **Open in Browser:**
   ```bash
   cd /home/robomaven/IITB_eYantra_7th_June_25/Challenge3
   xdg-open index.html
   ```

2. **Using Local Server (Optional):**
   ```bash
   cd /home/robomaven/IITB_eYantra_7th_June_25/Challenge3
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. The application will load with sample product data
4. Start managing products using the interface

## Sample Data

The application comes pre-loaded with 5 sample products:
- **Laptop** - $1200.00 - A high-performance laptop suitable for gaming and work
- **Smartphone** - $800.00 - A latest-generation smartphone with a large display and powerful camera
- **Wireless Headphones** - $200.00 - Noise-cancelling wireless headphones with long battery life
- **Smartwatch** - $150.00 - A smartwatch with fitness tracking and customizable watch faces
- **Tablet** - $300.00 - A lightweight tablet with a sharp display, ideal for reading and browsing

## Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: ES6+ features, classes, and modern DOM manipulation
- **localStorage**: Client-side data persistence

## Key Components

### ProductManager Class
The main class that handles all CRUD operations:

```javascript
class ProductManager {
    constructor()           // Initialize with sample data
    createProduct(data)     // Add new product
    getAllProducts()        // Get all products
    getProductById(id)      // Get specific product
    updateProduct(id, data) // Update existing product
    deleteProduct(id)       // Remove product
    renderProducts()        // Display products in UI
    filterProducts()        // Search functionality
    // ... and more methods
}
```

### Form Validation
- Required field validation
- Price must be greater than 0
- Sanitized input to prevent XSS
- Error handling with user feedback

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Touch-friendly buttons
- Optimized for various screen sizes

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development Features

- Clean, modular code structure
- Comprehensive error handling
- Modern ES6+ JavaScript
- CSS custom properties
- Semantic HTML markup
- Accessibility considerations

## Usage Instructions

### Adding a Product
1. Fill in the "Add New Product" form
2. Enter product name, description, and price
3. Click "Add Product" button
4. Product will appear in the products list

### Editing a Product
1. Click "Edit" button on any product card
2. Form will populate with existing data
3. Modify the fields as needed
4. Click "Update Product" to save changes
5. Click "Cancel" to abort editing

### Deleting a Product
1. Click "Delete" button on any product card
2. Confirm deletion in the popup dialog
3. Product will be removed from the list

### Searching Products
1. Use the search box above the products list
2. Type product name or description keywords
3. Results filter in real-time

## Future Enhancements

- [ ] Import/Export data as JSON
- [ ] Product categories and tags
- [ ] Advanced sorting options (price, name, date)
- [ ] Bulk operations (select multiple, bulk delete)
- [ ] Image upload support
- [ ] Backend API integration
- [ ] User authentication
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Sales analytics

## Error Handling Examples

The application handles various error scenarios:

```javascript
// Form validation
if (!formData.name || !formData.description || !formData.price) {
    throw new Error('All fields are required');
}

// Product not found
if (!product) {
    throw new Error(`Product with ID ${id} not found`);
}

// Price validation
if (formData.price <= 0) {
    throw new Error('Price must be greater than 0');
}
```

## Contributing

To extend this application:

1. Follow the existing code structure
2. Add proper error handling for new features
3. Update this README with new functionality
4. Test thoroughly across different browsers
5. Maintain responsive design principles
