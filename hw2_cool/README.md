# Node.JS Masterclass: Homework Assignment #2

## The Task

You are building the API for a **pizza-delivery company**.
Don't worry about a frontend, just build the API.

Here's the spec from your project manager: 

1. **New users** can be created, their information can be edited, and they can be 
deleted. We should store their *name*, *email address*, and *street address*.
2. Users can **log in** and **log out** by creating or destroying a token.
3. When a user is logged in, they should be able to **GET all the possible 
menu items** (these items can be hardcoded into the system). 
4. A logged-in user should be able to **fill a shopping cart with menu items**
5. A logged-in user should be able to **create an order**. You should integrate 
with the Sandbox of [Stripe.com](https://stripe.com/) to accept their payment.
Note: Use the stripe sandbox for your testing. [Follow this link](https://stripe.com/docs/testing#cards) and click on 
the "tokens" tab to see the fake tokens you can use server-side to confirm the 
integration is working.
6. When an order is placed, you should **email the user a receipt**. You should
integrate with the sandbox of [Mailgun.com](https://www.mailgun.com/) for this.
Note: Every Mailgun account comes with a sandbox email account domain
(whatever@sandbox123.mailgun.org) that you can send from by default. So,
there's no need to setup any DNS for your domain for this task.
[Read more here](https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account).

This is an open-ended assignment.
You may take any direction you'd like to go with it, as long as your project 
includes the requirements. It can include anything else you wish as well. 

## The Solution

The functionality described in the task above is implemented by means of the following endpoints. 

### Launching the Server

```bash
node index.js
```

Or with server, stripe and mailgun debugging information:

```bash
env NODE_DEBUG=server,stripe,mailgun node index.js
```

### HealthCheck Endpoint

Request example:

```bash
curl -X GET http://localhost:3000/ping
```

### User Endpoints

#### Create the User

Request example:

```bash
curl -X POST \
  http://localhost:3000/users \
  -d '{
	"name": "John",
	"email": "any@email.com",
	"password": "1111",
	"address": "San Francisco, CA",
	"streetAddress": "Sunset blvd, 15"
}'
```

#### Read the User

Request example:

```bash
curl -X GET \
  'http://localhost:3000/users?email=any@email.com' \
  -H 'token: 48df0wibmpqz69rzgb5y'
```

#### Update the User

Request example:

```bash
curl -X PUT \
  http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -H 'token: 48df0wibmpqz69rzgb5y' \
  -d '{
	"name": "Bill",
	"email": "any@email.com"
}'
```

#### Delete the User

Request example:

```bash
curl -X DELETE \
  'http://localhost:3000/users?email=any@email.com' \
  -H 'token: b3xg95c3wp0ol1pk46vm'
```

### Token Endpoints

#### Create the Token

Request example:

```bash
curl -X POST \
  http://localhost:3000/tokens \
  -d '{
	"email": "any@email.com",
	"password": "1111"
}'
```

#### Read the Token

Request example:

```bash
curl -X GET 'http://localhost:3000/tokens?id=gjfek6ha08p2x8877mno'
```

#### Update (Prolong) the Token

Request example:

```bash
curl -X PUT \
  http://localhost:3000/tokens \
  -H 'Content-Type: application/json' \
  -d '{
	"id": "gjfek6ha08p2x8877mno"
}'
```

#### Delete the Token

Request example:

```bash
curl -X DELETE 'http://localhost:3000/tokens?id=bivegzlqhs1z5q4np0yo'
```

### Menu Endpoint

#### Get the Menu

Request example:

```bash
curl -X GET \
  http://localhost:3000/menus \
  -H 'token: 3c3nld8owylf927r5txu'
```

### Shopping Cart Endpoint

#### Create Shopping Cart

Request example:

```bash
  http://localhost:3000/carts \
  -H 'token: ket278eemafcehh9vq30'
```

#### Read Shopping Cart

Request example:

```bash
curl -X GET \
  http://localhost:3000/carts \
  -H 'token: ket278eemafcehh9vq30'
```

#### Delete Shopping Cart

Request example:

```bash
curl -X DELETE \
  http://localhost:3000/carts \
  -H 'token: ket278eemafcehh9vq30'
```

### Update Items in Shopping Cart

Request example:

```bash
curl -X PUT \
  http://localhost:3000/carts \
  -H 'Content-Type: application/json' \
  -H 'token: sdvr4w4e85gw8slgycnt' \
  -d '{
	"id": 4,
	"quantity": 2
}
'
```

### Order Endpoint

#### Create the Order

Request example:

```bash
curl -X POST \
  http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -H 'token: 8l06rtpic4y4kps54pe4' \
  -d '{
	"paymentSource": "tok_mastercard"
}'
```

#### Read the Order

Request example:

```bash
curl -X GET \
  'http://localhost:3000/orders?id=un2yhgqoajzmv76fozkd' \
  -H 'token: 4dpj97yqr53druol20ru'
```
