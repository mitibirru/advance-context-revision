import { createContext, useState, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => { },
    updateItemQuantity: () => { }
});

const AddItemAction = 'ADD_ITEM'
const UpdateItemAction = 'UPDATE_ITEM'

function shoppingCartReducer(state, action) {
    if (action.type == AddItemAction) {
        const id = action.payload
        const updatedItems = [...state.items];

        const existingCartItemIndex = updatedItems.findIndex(cartItem => cartItem.id === id);
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find(product => product.id === id);
            updatedItems.push({
                id,
                name: product.title,
                price: product.price,
                quantity: 1
            });
        }

        return {
            ...state,
            items: updatedItems
        };
    }

    if (action.type == UpdateItemAction) {
        const { productId, amount } = action.payload;
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(item => item.id === productId);

        const updatedItem = {
            ...updatedItems[updatedItemIndex]
        };

        updatedItem.quantity += amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            items: updatedItems
        };
    }

    return state;
}

const CartContextProvider = ({ children }) => {
    const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
        items: []
    });
    
    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: AddItemAction,
            payload: id
        })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            action: UpdateItemAction,
            payload: {
                productId, amount
            }
        })
    }

    const ctxValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
    };

    return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
