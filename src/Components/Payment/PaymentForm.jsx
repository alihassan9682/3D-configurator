import { useState } from "react";
import VisaLogo from "../../assets/Visa-Logo.png"
import MasterLogo from "../../assets/MasterCard.png"
import Paypal from "../../assets/paypal.webp"
import Amex from "../../assets/Amex.jpg"
import discover from "../../assets/discover.png"
export default function PaymentForm() {
    const [paymentMethod, setPaymentMethod] = useState("credit-card");

    return (
        <div className="w-5/6 mx-auto   bg-white">
            <h2 className="text-xl font-semibold mb-2">Payment</h2>
            <p className="text-gray-600 text-sm mb-4">
                All transactions are secure and encrypted.
            </p>

            <div>
                <div
                    className={`bg-gray-100 border rounded-t-lg cursor-pointer `}
                    onClick={() => setPaymentMethod("credit-card")}
                >
                    <div className={`flex items-center justify-between border w-full rounded-t-lg  ${paymentMethod === "credit-card" ? "border-blue-500" : ""}`}>
                        <div className="flex items-center gap-2 w-1/2 p-4">
                            <input
                                type="radio"
                                name="payment"
                                value="credit-card"
                                checked={paymentMethod === "credit-card"}
                                readOnly
                                className="w-4 h-4"
                            />
                            <span className="font-medium text-xs">Credit card</span>
                        </div>
                        <div className="flex gap-2">
                            <img src={VisaLogo} alt="Visa" className="w-6" />
                            <img src={MasterLogo} alt="MasterCard" className="w-6" />
                            <img src={Amex} alt="Amex" className="w-6" />
                            <img src={discover} alt="Discover" className="w-6 " />
                        </div>
                    </div>
                    {paymentMethod === "credit-card" && (
                        <div className="mt-4 space-y-3 p-2 ">
                            <input type="text" placeholder="Card number" className="w-full text-gray-800 border p-3 rounded text-sm" />
                            <div className="flex gap-2">
                                <input type="text" placeholder="MM / YY" className="w-1/2 text-gray-800 border p-3 rounded text-sm" />
                                <input type="text" placeholder="Security code" className="w-1/2 border text-gray-800 p-3 text-sm rounded" />
                            </div>
                            <input type="text" placeholder="Name on card" className="w-full border p-3 rounded" />
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="billing-address" className="w-4 h-4" defaultChecked />
                                <label htmlFor="billing-address" className="text-gray-700">Use shipping address as billing address</label>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className={`p-4 border rounded-b-lg cursor-pointer flex items-center w-full gap-2 ${paymentMethod === "paypal" ? "border-blue-500" : ""}`}
                // onClick={() => setPaymentMethod("paypal")}
                >
                    <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        readOnly
                        className="w-4 h-4"
                    />
                    <span className="font-medium">PayPal</span>
                    <img src={Paypal} alt="PayPal" className="w-20 ml-auto" />
                </div>
            </div>

            <button className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg text-sm font-medium hover:bg-blue-700">Pay now</button>
        </div>
    );
}
