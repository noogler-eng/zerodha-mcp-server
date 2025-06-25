import { KiteConnect } from "kiteconnect";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.API_KEY!;
const apiSecret = process.env.API_SECRET!;
const requestToken = process.env.REQUEST_TOKEN!;

let accessToken = "";

if (!apiKey || !apiSecret || !requestToken) {
  console.error(
    "API_KEY, API_SECRET, and REQUEST_TOKEN must be set in the environment variables."
  );
  process.exit(1);
}

const kc = new KiteConnect({ api_key: apiKey });

// Initialize Kite Connect with API key
// and set the request token
async function init() {
  try {
    await generateSession();
    await getProfile();
  } catch (err) {
    console.error(err);
  }
}

// Generate session using the request token
// and set the access token in Kite Connect instance
async function generateSession() {
  try {
    const response = await kc.generateSession(requestToken, apiSecret);
    kc.setAccessToken(response.access_token);
    accessToken = response.access_token;
    console.log("Session generated:", response);
  } catch (err) {
    console.error("Error generating session:", err);
  }
}

// Get user profile information
// using the Kite Connect instance
async function getProfile() {
  try {
    const profile = await kc.getProfile();
    console.log("Profile:", profile);
  } catch (err) {
    console.error("Error getting profile:", err);
  }
}

export async function placeOrder(
  symbol: string,
  quantity: number,
  type: "BUY" | "SELL"
) {
  try {
    // it will return order_id: string
    const variety = "regular";
    const order_id = kc.placeOrder(variety, {
      exchange: "NSE",
      tradingsymbol: symbol,
      transaction_type: type,
      quantity: quantity,
      product: "MIS",
      order_type: "MARKET",
    });
    console.log("Order placed, order_id: ", order_id);
  } catch (err) {
    console.error("Error placing order:", err);
  }
}

init();
