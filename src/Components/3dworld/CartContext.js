// CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import Client from "shopify-buy";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [checkout, setCheckout] = useState(null);

  useEffect(() => {
    const client = Client.buildClient({
      domain: "duralifthardware.com",
      storefrontAccessToken: "de189c5e871c9aaded8566d9dab068f7",
    });

    // Create a checkout session
    client.checkout.create().then((checkout) => {
      setCheckout(checkout);
    });
  }, []);

  const addToCart = (variantId, customPrice, customDescription) => {
    if (!checkout) return;

    const lineItemsToAdd = [
      {
        variantId: `gid://shopify/ProductVariant/${variantId}`, // Format the ID correctly
        quantity: 1,
        customAttributes: [
          { key: "Custom Price", value: `$${customPrice}` },
          { key: "Custom Description", value: customDescription },
        ],
      },
    ];

    const client = Client.buildClient({
      domain: "duralifthardware.com",
      storefrontAccessToken: "de189c5e871c9aaded8566d9dab068f7",
    });

    client.checkout
      .addLineItems(checkout.id, lineItemsToAdd)
      .then((updatedCheckout) => {
        setCheckout(updatedCheckout);
        // Optional: Redirect to the checkout page or show a confirmation message
        window.location.href = updatedCheckout.webUrl; // Redirects to the checkout page
      });
  };

  return (
    <CartContext.Provider value={{ addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};


  // const handleAddToCart = (variantId, customDescription) => {
    //     const customPrice = 100; // Example price, adjust as necessary
    //     addToCart(variantId, customPrice, customDescription);
    //     toast.success("Added to cart!");
    // };

    // // Example usage of handleAddToCart
    // const addToCartWithExampleData = () => {
    //     const exampleVariantId = "45922991538395"; // Replace with your actual variant ID
    //     const exampleDescription = state.descripation; // Replace with your actual description
    //     handleAddToCart(exampleVariantId, exampleDescription);
    // };
    // const addToCart = (variantId, customPrice, customDescription) => {
    //     if (!checkout) return;

    //     const lineItemsToAdd = [
    //         {
    //             variantId: `gid://shopify/ProductVariant/${variantId}`, // Ensure this ID is valid
    //             quantity: 1,
    //             customAttributes: [
    //                 { key: "Custom Price", value: `$${customPrice}` },
    //                 { key: "Custom Description", value: customDescription },
    //             ],
    //         },
    //     ];

    //     const client = Client.buildClient({
    //         domain: "duralifthardware.com",
    //         storefrontAccessToken: "de189c5e871c9aaded8566d9dab068f7",
    //     });

    //     client.checkout
    //         .addLineItems(checkout.id, lineItemsToAdd)
    //         .then((updatedCheckout) => {
    //             setCheckout(updatedCheckout);
    //             window.location.href = updatedCheckout.webUrl; // Redirects to the checkout page
    //         })
    //         .catch((error) => {
    //             console.error("Error adding to cart:", error);
    //             toast.error("Failed to add to cart.");
    //         });
    // };