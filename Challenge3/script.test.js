// Import the ProductManager class
// Since we're using ES5 in script.js, we need to load it differently
const fs = require('fs');
const path = require('path');

// Read and evaluate the script.js file
const scriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
eval(scriptContent);

describe('ProductManager CRUD Operations', () => {
  let productManager;

  beforeEach(() => {
    // Create a fresh instance for each test
    productManager = new ProductManager();
    
    // Mock the showMessage method to avoid DOM manipulation in tests
    productManager.showMessage = jest.fn();
  });

  describe('CREATE Operations (POST equivalent)', () => {
    describe('Valid product creation', () => {
      test('should create a product with valid data', () => {
        const productData = {
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99
        };

        const result = productManager.createProduct(productData);

        expect(result).toMatchObject({
          id: '6', // Next ID after initial 5 products
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99
        });
        expect(productManager.products).toHaveLength(6);
        expect(productManager.showMessage).toHaveBeenCalledWith('Product added successfully!', 'success');
      });

      test('should increment nextId after creating a product', () => {
        const initialNextId = productManager.nextId;
        
        productManager.createProduct({
          name: 'Test Product',
          description: 'Test Description',
          price: 50.00
        });

        expect(productManager.nextId).toBe(initialNextId + 1);
      });

      test('should handle price as string and convert to float', () => {
        const productData = {
          name: 'String Price Product',
          description: 'Test Description',
          price: '123.45'
        };

        const result = productManager.createProduct(productData);
        expect(result.price).toBe(123.45);
        expect(typeof result.price).toBe('number');
      });
    });

    describe('Invalid product creation (Edge Cases)', () => {
      test('should throw error for missing name', () => {
        const productData = {
          description: 'Test Description',
          price: 99.99
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should throw error for empty name', () => {
        const productData = {
          name: '',
          description: 'Test Description',
          price: 99.99
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should throw error for missing description', () => {
        const productData = {
          name: 'Test Product',
          price: 99.99
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should throw error for empty description', () => {
        const productData = {
          name: 'Test Product',
          description: '',
          price: 99.99
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should throw error for missing price', () => {
        const productData = {
          name: 'Test Product',
          description: 'Test Description'
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should throw error for invalid price (NaN)', () => {
        const productData = {
          name: 'Test Product',
          description: 'Test Description',
          price: 'invalid'
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should throw error for negative price', () => {
        const productData = {
          name: 'Test Product',
          description: 'Test Description',
          price: -10.00
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should throw error for zero price', () => {
        const productData = {
          name: 'Test Product',
          description: 'Test Description',
          price: 0
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should handle null values gracefully', () => {
        const productData = {
          name: null,
          description: null,
          price: null
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });

      test('should handle undefined values gracefully', () => {
        const productData = {
          name: undefined,
          description: undefined,
          price: undefined
        };

        expect(() => {
          productManager.createProduct(productData);
        }).toThrow();
      });
    });
  });

  describe('READ Operations (GET equivalent)', () => {
    describe('Get all products', () => {
      test('should return all products', () => {
        const products = productManager.getAllProducts();
        expect(products).toHaveLength(5);
        expect(Array.isArray(products)).toBe(true);
      });

      test('should return empty array when no products exist', () => {
        productManager.products = [];
        const products = productManager.getAllProducts();
        expect(products).toHaveLength(0);
        expect(Array.isArray(products)).toBe(true);
      });
    });

    describe('Get product by ID', () => {
      test('should return product with valid ID', () => {
        const product = productManager.getProductById('1');
        expect(product).toMatchObject({
          id: '1',
          name: 'Laptop',
          description: 'A high-performance laptop suitable for gaming and work.',
          price: 1200.00
        });
      });

      test('should throw error for non-existent ID', () => {
        expect(() => {
          productManager.getProductById('999');
        }).toThrow('Product with ID 999 not found');
      });

      test('should throw error for null ID', () => {
        expect(() => {
          productManager.getProductById(null);
        }).toThrow();
      });

      test('should throw error for undefined ID', () => {
        expect(() => {
          productManager.getProductById(undefined);
        }).toThrow();
      });

      test('should throw error for empty string ID', () => {
        expect(() => {
          productManager.getProductById('');
        }).toThrow();
      });

      test('should handle numeric ID as string', () => {
        const product = productManager.getProductById(1); // Passing number instead of string
        expect(product.id).toBe('1'); // Should still work due to loose equality
      });
    });
  });

  describe('UPDATE Operations (PUT equivalent)', () => {
    describe('Valid product updates', () => {
      test('should update product with valid data', () => {
        const updateData = {
          name: 'Updated Laptop',
          description: 'Updated description',
          price: 1500.00
        };

        const result = productManager.updateProduct('1', updateData);

        expect(result).toMatchObject({
          id: '1',
          name: 'Updated Laptop',
          description: 'Updated description',
          price: 1500.00
        });
        expect(productManager.showMessage).toHaveBeenCalledWith('Product updated successfully!', 'success');
      });

      test('should update only provided fields and maintain ID', () => {
        const originalProduct = productManager.getProductById('1');
        const updateData = {
          name: 'New Name Only',
          description: originalProduct.description,
          price: originalProduct.price
        };

        const result = productManager.updateProduct('1', updateData);
        expect(result.id).toBe('1');
        expect(result.name).toBe('New Name Only');
      });

      test('should handle price as string in update', () => {
        const updateData = {
          name: 'Test Update',
          description: 'Test Description',
          price: '999.99'
        };

        const result = productManager.updateProduct('1', updateData);
        expect(result.price).toBe(999.99);
        expect(typeof result.price).toBe('number');
      });
    });

    describe('Invalid product updates (Edge Cases)', () => {
      test('should throw error for non-existent product ID', () => {
        const updateData = {
          name: 'Updated Name',
          description: 'Updated Description',
          price: 100.00
        };

        expect(() => {
          productManager.updateProduct('999', updateData);
        }).toThrow('Product with ID 999 not found');
      });

      test('should throw error for empty name in update', () => {
        const updateData = {
          name: '',
          description: 'Valid Description',
          price: 100.00
        };

        expect(() => {
          productManager.updateProduct('1', updateData);
        }).toThrow();
      });

      test('should throw error for empty description in update', () => {
        const updateData = {
          name: 'Valid Name',
          description: '',
          price: 100.00
        };

        expect(() => {
          productManager.updateProduct('1', updateData);
        }).toThrow();
      });

      test('should throw error for invalid price in update', () => {
        const updateData = {
          name: 'Valid Name',
          description: 'Valid Description',
          price: -50.00
        };

        expect(() => {
          productManager.updateProduct('1', updateData);
        }).toThrow();
      });

      test('should throw error for null ID in update', () => {
        const updateData = {
          name: 'Valid Name',
          description: 'Valid Description',
          price: 100.00
        };

        expect(() => {
          productManager.updateProduct(null, updateData);
        }).toThrow();
      });

      test('should throw error for null update data', () => {
        expect(() => {
          productManager.updateProduct('1', null);
        }).toThrow();
      });

      test('should throw error for undefined update data', () => {
        expect(() => {
          productManager.updateProduct('1', undefined);
        }).toThrow();
      });
    });
  });

  describe('DELETE Operations (DELETE equivalent)', () => {
    describe('Valid product deletion', () => {
      test('should delete product with valid ID', () => {
        const initialLength = productManager.products.length;
        const deletedProduct = productManager.deleteProduct('1');

        expect(deletedProduct).toMatchObject({
          id: '1',
          name: 'Laptop',
          description: 'A high-performance laptop suitable for gaming and work.',
          price: 1200.00
        });
        expect(productManager.products).toHaveLength(initialLength - 1);
        expect(productManager.showMessage).toHaveBeenCalledWith('Product deleted successfully!', 'success');
      });

      test('should not find deleted product after deletion', () => {
        productManager.deleteProduct('1');
        
        expect(() => {
          productManager.getProductById('1');
        }).toThrow('Product with ID 1 not found');
      });

      test('should delete correct product when multiple exist', () => {
        const productToDelete = productManager.getProductById('2');
        const initialLength = productManager.products.length;
        
        const deletedProduct = productManager.deleteProduct('2');
        
        expect(deletedProduct.id).toBe('2');
        expect(productManager.products).toHaveLength(initialLength - 1);
        
        // Verify other products still exist
        expect(() => {
          productManager.getProductById('1');
        }).not.toThrow();
        expect(() => {
          productManager.getProductById('3');
        }).not.toThrow();
      });
    });

    describe('Invalid product deletion (Edge Cases)', () => {
      test('should throw error for non-existent product ID', () => {
        expect(() => {
          productManager.deleteProduct('999');
        }).toThrow('Product with ID 999 not found');
      });

      test('should throw error for null ID', () => {
        expect(() => {
          productManager.deleteProduct(null);
        }).toThrow();
      });

      test('should throw error for undefined ID', () => {
        expect(() => {
          productManager.deleteProduct(undefined);
        }).toThrow();
      });

      test('should throw error for empty string ID', () => {
        expect(() => {
          productManager.deleteProduct('');
        }).toThrow();
      });

      test('should not delete anything when error occurs', () => {
        const initialLength = productManager.products.length;
        
        try {
          productManager.deleteProduct('999');
        } catch (error) {
          // Expected error
        }
        
        expect(productManager.products).toHaveLength(initialLength);
      });

      test('should handle attempt to delete already deleted product', () => {
        // Delete product first time
        productManager.deleteProduct('1');
        
        // Attempt to delete again
        expect(() => {
          productManager.deleteProduct('1');
        }).toThrow('Product with ID 1 not found');
      });
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle empty products array', () => {
      productManager.products = [];
      
      expect(productManager.getAllProducts()).toHaveLength(0);
      expect(() => {
        productManager.getProductById('1');
      }).toThrow();
    });

    test('should handle very large product dataset', () => {
      // Add many products
      for (let i = 0; i < 1000; i++) {
        productManager.createProduct({
          name: `Product ${i}`,
          description: `Description ${i}`,
          price: Math.random() * 1000
        });
      }
      
      expect(productManager.getAllProducts()).toHaveLength(1005); // 5 initial + 1000 new
    });

    test('should handle special characters in product data', () => {
      const productData = {
        name: 'Special!@#$%^&*()_+{}[]|\\:";\'<>?,./~`',
        description: 'Description with émojis 🚀 and ñ special chars',
        price: 123.45
      };

      const result = productManager.createProduct(productData);
      expect(result.name).toBe(productData.name);
      expect(result.description).toBe(productData.description);
    });

    test('should handle very long strings', () => {
      const longString = 'A'.repeat(10000);
      const productData = {
        name: longString,
        description: longString,
        price: 99.99
      };

      const result = productManager.createProduct(productData);
      expect(result.name).toBe(longString);
      expect(result.description).toBe(longString);
    });

    test('should handle very small and very large prices', () => {
      const smallPrice = {
        name: 'Cheap Product',
        description: 'Very affordable',
        price: 0.01
      };

      const largePrice = {
        name: 'Expensive Product',
        description: 'Very costly',
        price: 999999999.99
      };

      const cheapProduct = productManager.createProduct(smallPrice);
      const expensiveProduct = productManager.createProduct(largePrice);

      expect(cheapProduct.price).toBe(0.01);
      expect(expensiveProduct.price).toBe(999999999.99);
    });

    test('should maintain data integrity during multiple operations', () => {
      const initialCount = productManager.products.length;
      
      // Create
      productManager.createProduct({
        name: 'Test Product',
        description: 'Test Description',
        price: 50.00
      });
      
      // Update
      productManager.updateProduct('1', {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 75.00
      });
      
      // Delete
      productManager.deleteProduct('2');
      
      expect(productManager.products).toHaveLength(initialCount); // +1 create, -1 delete
      
      // Verify update worked
      const updatedProduct = productManager.getProductById('1');
      expect(updatedProduct.name).toBe('Updated Product');
      
      // Verify delete worked
      expect(() => {
        productManager.getProductById('2');
      }).toThrow();
    });
  });

  describe('LocalStorage Operations', () => {
    test('should save to localStorage after create', () => {
      productManager.createProduct({
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('products', expect.any(String));
      expect(localStorage.setItem).toHaveBeenCalledWith('nextId', expect.any(String));
    });

    test('should save to localStorage after update', () => {
      productManager.updateProduct('1', {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150.00
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('products', expect.any(String));
    });

    test('should save to localStorage after delete', () => {
      productManager.deleteProduct('1');

      expect(localStorage.setItem).toHaveBeenCalledWith('products', expect.any(String));
    });
  });
});
