import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item.product === action.payload.product._id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.product === action.payload.product._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.product !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.product === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: []
      };

    case 'SET_CART_FROM_STORAGE':
      return {
        ...state,
        cartItems: action.payload
      };

    case 'SET_SAVED_ITEMS':
      return {
        ...state,
        savedItems: action.payload
      };

    case 'ADD_TO_SAVED':
      // Check if item is already saved
      const existingSavedItem = state.savedItems.find(item => item.product === action.payload.product);
      if (!existingSavedItem) {
        return {
          ...state,
          savedItems: [...state.savedItems, action.payload]
        };
      }
      return state; // Item already in saved items

    case 'REMOVE_FROM_SAVED':
      return {
        ...state,
        savedItems: state.savedItems.filter(item => item.product !== action.payload)
      };

    case 'MOVE_FROM_SAVED_TO_CART':
      // Remove from saved items and add to cart
      const savedItem = state.savedItems.find(item => item.product === action.payload);
      if (savedItem) {
        const updatedSavedItems = state.savedItems.filter(item => item.product !== action.payload);
        const updatedCartItems = [...state.cartItems, { ...savedItem, quantity: 1 }]; // Add with quantity 1
        return {
          ...state,
          savedItems: updatedSavedItems,
          cartItems: updatedCartItems
        };
      }
      return state;

    case 'CLEAR_SAVED':
      return {
        ...state,
        savedItems: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    cartItems: [], 
    savedItems: []  // Initialize saved items
  });

  // Load cart and saved items from localStorage on initial render
  useEffect(() => {
    const cartFromStorage = localStorage.getItem('cartItems');
    if (cartFromStorage) {
      dispatch({ type: 'SET_CART_FROM_STORAGE', payload: JSON.parse(cartFromStorage) });
    }
    
    const savedItemsFromStorage = localStorage.getItem('savedItems');
    if (savedItemsFromStorage) {
      dispatch({ type: 'SET_SAVED_ITEMS', payload: JSON.parse(savedItemsFromStorage) });
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Save saved items to localStorage whenever savedItems change
  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(state.savedItems));
  }, [state.savedItems]);

  // Calculate cart totals
  const cartTotal = state.cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const cartItemCount = state.cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  const addToCart = (product, quantity = 1) => {
    // Check if adding this quantity would exceed available stock
    const existingItem = state.cartItems.find(item => item.product === product._id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQuantityInCart + quantity;
    
    if (product.stock !== undefined && totalRequested > product.stock) {
      // Show a warning, but still allow adding if the stock is available
      if (window.confirm(`Only ${product.stock} items available in stock. You currently have ${currentQuantityInCart} in cart. Add ${quantity} more? (Total would be ${totalRequested})`)) {
        dispatch({
          type: 'ADD_TO_CART',
          payload: {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
            quantity: quantity,
            seller: product.seller._id,
            stock: product.stock
          }
        });
      }
      return;
    }
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        quantity: quantity,
        seller: product.seller._id,
        stock: product.stock
      }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Need to check current stock from the cart item
    // This would require checking the original product's stock from the database
    // For now, we'll proceed with the update but should check against original product stock
    const cartItem = state.cartItems.find(item => item.product === productId);
    
    if (cartItem && cartItem.stock !== undefined && quantity > cartItem.stock) {
      alert(`Only ${cartItem.stock} items available in stock. Quantity has been adjusted.`);
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { productId, quantity: cartItem.stock }
      });
      return;
    }
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calculate saved items count
  const savedItemCount = state.savedItems.length;

  const addToSaved = (product) => {
    dispatch({
      type: 'ADD_TO_SAVED',
      payload: {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        seller: product.seller._id
      }
    });
  };

  const removeFromSaved = (productId) => {
    dispatch({ type: 'REMOVE_FROM_SAVED', payload: productId });
  };

  const moveFromSavedToCart = (productId) => {
    dispatch({ type: 'MOVE_FROM_SAVED_TO_CART', payload: productId });
  };

  const clearSaved = () => {
    dispatch({ type: 'CLEAR_SAVED' });
  };

  const isProductSaved = (productId) => {
    return state.savedItems.some(item => item.product === productId);
  };

  const value = {
    cartItems: state.cartItems,
    savedItems: state.savedItems,
    cartTotal,
    cartItemCount,
    savedItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToSaved,
    removeFromSaved,
    moveFromSavedToCart,
    clearSaved,
    isProductSaved,
    // Function to check if cart items are within stock limits
    checkCartStock: async (getProductById) => {
      const stockCheckResults = [];
      for (const item of state.cartItems) {
        try {
          // Get the latest product info to check current stock
          const product = await getProductById(item.product);
          const inStock = item.quantity <= product.stock;
          stockCheckResults.push({
            ...item,
            maxAvailable: product.stock,
            inStock
          });
        } catch (error) {
          console.error('Error checking stock for product:', item.product);
          stockCheckResults.push({
            ...item,
            maxAvailable: 0,
            inStock: false
          });
        }
      }
      return stockCheckResults;
    }
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};