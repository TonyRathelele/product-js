const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51OYBmkCaB7daml66r6pp1YdNWQoW0t9W3WOPrh0ZajhMqy2v3Vj6qgovPtWTEUffUxE4tKisZTRjJBQCuMJTNxQs00TF6RqJgR'); // Replace with your Stripe secret key

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (e.g., HTML, CSS, JS)

app.post('/create-checkout-session', async (req, res) => {
    try {
        const cart = req.body.cart;

        // Create line items for Stripe checkout session from the cart data
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'usd', // Set the currency
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert price to cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
