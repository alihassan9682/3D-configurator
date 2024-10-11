import React, { useEffect, useState } from 'react';
import Client from 'shopify-buy';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [checkout, setCheckout] = useState(null);

    useEffect(() => {
        const client = Client.buildClient({
            domain: 'duralifthardware.com',
            storefrontAccessToken: 'de189c5e871c9aaded8566d9dab068f7',
        });

        client.checkout.create().then((checkout) => {
            setCheckout(checkout);
        });

        const collectionHandle = 'storage-platforms'; 
        client.collection.fetchByHandle(collectionHandle).then((collection) => {
            if (collection) {
                client.collection.fetchWithProducts(collection.id).then((collectionWithProducts) => {
                    setProducts(collectionWithProducts.products);
                });
            } else {
                console.error(`Collection with handle "${collectionHandle}" not found.`);
            }
        });
    }, []);

    const addToCart = (variantId, customPrice, customDescription) => {
        if (!checkout) return;
        console.log(variantId)
        const lineItemsToAdd = [
            {
                variantId,
                quantity: 1,
                customAttributes: [
                    { key: 'Custom Price', value: `$${customPrice}` },
                    { key: 'Custom Description', value: customDescription },
                ],
            },
        ];

        const client = Client.buildClient({
            domain: 'duralifthardware.com',
            storefrontAccessToken: 'de189c5e871c9aaded8566d9dab068f7',
        });

        client.checkout.addLineItems(checkout.id, lineItemsToAdd).then((updatedCheckout) => {
            setCheckout(updatedCheckout);
            window.location.href = updatedCheckout.webUrl; 
        });
    };

    const handleCustomization = (product) => {
        const customPrice = parseFloat(product.variants[0]?.price.amount) + 10; 
        const customDescription = `${product.description} - Customized with additional features`;

        addToCart(product.variants[0]?.id, customPrice, customDescription);
    };

    return (
        <div>
            <h1>Storage Platforms</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h2>{product.title}</h2>
                        <p>ProductID: {product.id}</p>
                        <img
                            src={product.images[0]?.src}
                            alt={product.title}
                            style={{ width: '200px', height: '200px' }}
                        />
                        <p>{product.description}</p>

                        <p>
                            Base Price: ${product.variants[0]?.price.amount} {product.variants[0]?.price.currencyCode}
                        </p>
                        <p>Variant IDs: {product.variants.map(variant => variant.id).join(', ')}</p>

                        <button onClick={() => handleCustomization(product)}>
                            Customize and Add to Cart
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Shop;
