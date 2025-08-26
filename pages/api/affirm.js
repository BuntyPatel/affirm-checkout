export default async function handler(req, res) {
  if (req.method === "POST") {
    const { checkout_token } = req.body;
    console.log("Affirm checkout token:", checkout_token);

    // TODO: Call Affirm API with token to capture payment

    return res.status(200).json({ message: "Token received", checkout_token });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
