# The Assignment:

The API for a pizza-delivery company:

1. New users can be created, their information can be edited, and they can be deleted. 
	* `POST /users` (required: `firstName`, `lastName`, `phone`, `email`, `address`, `password`, `tosAgreement`).
	* `GET /users` (required: `phone`, `token` in headers).
	* `PUT /users` (required: `token` in headers; optional: `firstName`, `lastName`, `phone`, `email`, `address`, `password`, `tosAgreement`).
	* `DELETE /users` (required: `phone`, `token` in headers).

2. Users can log in and log out by creating or destroying a token.
	* `POST /tokens`
	* `GET /tokens`
	* `PUT /tokens`
	* `DELETE /tokens`

3. The user should be able to GET all the possible menu items (these items are stored in `.data/menu/menu.json` file). 
	* `GET /menu`

4. A logged-in user should be able to fill a shopping cart with menu items
	* `POST /carts` (required: `token` in headers, items with quantities to order in json format, e.g. `{"item1":3, "item2":2}`). Returns the cart object `{"item1":{"price":4.00, "quantity":3, "subtotal": 12.00}, "total": 12.00, "invalidItems":{"item2":2}}`.
	* `GET /carts` (required: `token` in headers).
	* `PUT /carts` (required: `token` in headers, items with quantities to update).
	* `DELETE /carts` (required: `token` in headers).

5. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards
When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account
	* `POST /orders` (required: `token` in headers).
	* `GET /orders` (required: `token` in headers, optional: order `id`). Returns the list of the user orders or, if the `id` specified, than returns this order detail.