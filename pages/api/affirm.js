// pages/api/affirm.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      amount,         // in cents
      email,
      firstName,
      lastName,
      sku,
      displayName
    } = req.body;

    // Build checkout object for Affirm
    const checkout = {
      merchant: {
        user_confirmation_url: "https://onsiteweldforce.com/success",
        user_cancel_url: "https://onsiteweldforce.com/cancel"
      },
      shipping: {
        name: { first: firstName, last: lastName },
        email
      },
      items: [
        {
          display_name: displayName || "Product",
          sku: sku || "SKU123",
          unit_price: amount,
          qty: 1
        }
      ],
      total: amount,
      currency: "CAD" // change to "USD" if needed
    };

    // Call Affirm sandbox API
    const response = await fetch("https://sandbox.affirm.com/api/v2/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.4J6M5TSVWDNUSR9S + ":" + process.env.6Scw4BoCd8jrZbigSWM7Fe23v6U325rT
          ).toString("base64")
      },
      body: JSON.stringify(checkout)
    });

    const data = await response.json();

    if (!data.checkout_token) {
      console.error("Affirm API error:", data);
      return res.status(500).json({ error: "Unable to create checkout" });
    }

    return res.status(200).json({ checkout_token: data.checkout_token });

  } catch (err) {
    console.error("Error in /api/affirm:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
