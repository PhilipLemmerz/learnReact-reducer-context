import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../../dummy-products";

export const CartContext = createContext({
    items: []
})

function cartReducer(state, action) {
    if (action.action === 'ADD_ITEM') {
        const updatedItems = [...state.items];

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.identifier
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.identifier);
            updatedItems.push({
                id: action.identifier,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            ...state,
            items: updatedItems,
        };

    }

    if (action.action === 'UPDATE_ITEM') {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.identifier
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            ...state,
            items: updatedItems,
        };
    }

    return state

}

export default function CartContextProvider({ children }) {

    const [shoppingCart, setShoppingCart] = useReducer(cartReducer, { items: [] }) // {items: []} > Initial Value

    function handleAddItemToCart(id) {
        setShoppingCart({
            action: 'ADD_ITEM',
            identifier: id
        })


        // Variante mit dem Normalen State:

        // setShoppingCart((prevShoppingCart) => {
        //     const updatedItems = [...prevShoppingCart.items];

        //     const existingCartItemIndex = updatedItems.findIndex(
        //         (cartItem) => cartItem.id === id
        //     );
        //     const existingCartItem = updatedItems[existingCartItemIndex];

        //     if (existingCartItem) {
        //         const updatedItem = {
        //             ...existingCartItem,
        //             quantity: existingCartItem.quantity + 1,
        //         };
        //         updatedItems[existingCartItemIndex] = updatedItem;
        //     } else {
        //         const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        //         updatedItems.push({
        //             id: id,
        //             name: product.title,
        //             price: product.price,
        //             quantity: 1,
        //         });
        //     }

        //     return {
        //         items: updatedItems,
        //     };
        // });
    }

    function handleUpdateCartItemQuantity(productId, amount) {

        setShoppingCart({
            action: 'UPDATE_ITEM',
            identifier: productId,
            amount: amount
        })


        // Normales State Update:

        // setShoppingCart((prevShoppingCart) => {
        // const updatedItems = [...prevShoppingCart.items];
        // const updatedItemIndex = updatedItems.findIndex(
        //     (item) => item.id === productId
        // );

        // const updatedItem = {
        //     ...updatedItems[updatedItemIndex],
        // };

        // updatedItem.quantity += amount;

        // if (updatedItem.quantity <= 0) {
        //     updatedItems.splice(updatedItemIndex, 1);
        // } else {
        //     updatedItems[updatedItemIndex] = updatedItem;
        // }

        // return {
        //     items: updatedItems,
        // };
        //});
    }

    const cartContextProvider = {
        items: shoppingCart.items,
        addItem: handleAddItemToCart,
        updateCart: handleUpdateCartItemQuantity
    }

    return <CartContext.Provider value={cartContextProvider}> {children} </CartContext.Provider>

}
