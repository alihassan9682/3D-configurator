import React from "react";
import PSINGLE from "../../assets/PSINGLE.jpg";
import Configure from "../../assets/ss.png";
import PaymentForm from "./PaymentForm"
import { useLocation } from "react-router-dom";
const products = [
    {
        id: 1,
        name: "Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling 4X PSINGLE 24 Shaped Storage Platform",
        price: 357.46,
        image: PSINGLE, // Replace with actual image URL
        quantity: 4,
    },
    {
        id: 3,
        name: "Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling 3X PSINGLE 12 Shaped Storage Platform",
        price: 251.46,
        image: PSINGLE, // Replace with actual image URL
        quantity: 3,
    },
    {
        id: 1,
        name: "Dura-Lift Elevate Adjustable Height Overhead Garage Door Ceiling 2X PSINGLE 6 Shaped Storage Platform",
        price: 200.85,
        image: PSINGLE, // Replace with actual image URL
        quantity: 2,
    },
];

const CheckoutPage = () => {
    const location = useLocation();
    console.log(location);
    return (
        <div className="flex flex-col md:flex-row  bg-white w-full  mx-auto">
            {/* Left Side */}
            <div className="w-full md:w-2/3 p-4 flex items-center flex-col">
                <h1 className="text-2xl font-bold mb-4">DURA-LIFT Door Hardware</h1>
                <PaymentForm />
            </div>
            <div>
            </div>
            {/* Right Side - Product Summary */}
            <div className="w-full md:w-1/2 bg-gray-100 p-16 rounded-md h-screen gap-3">
                {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 fonr-semibold relative mb-4">
                        <div className="relative">
                            <img src={product.image} alt={product.name} className="w-32 h-16 rounded-md" />
                            <span className="absolute -top-2 -right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                                {product.quantity}
                            </span>
                        </div>
                        <div className="flex flex-row gap-3 font-semibold">
                            <p className="text-xs">{product.name}</p>
                            <p className="text-gray-800 text-xs">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}

                <div className="mt-4 gap-3">
                    <input type="text" placeholder="Discount code or gift card" className="w-5/6 p-3 border-gray-600 text-sm py-4 *:border rounded-md" />
                    <button className="bg-gray-200 p-4 text-gray-500     rounded-md text-sm ml-1">Apply</button>
                </div>
                <div className="mt-4 text-sm font- flex justify-between">
                    <span>Subtotal</span>
                    <span>${products.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="mt-2 text-sm  flex justify-between">
                    <span>Shipping</span>
                    <span>Enter shipping address</span>
                </div>
                <div className="mt-4 text-md font-semibold flex justify-between">
                    <span>Total</span>
                    <span><span className="font-normal text-xs">USD</span> ${products.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <img src={Configure} alt="" className="p-4 w-1/2  h-auto" />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
