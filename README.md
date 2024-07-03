# cakesNbakes

A feature-rich E-commerce website for cakes & bakes, made
with NodeJS in the backend, EJS in the frontend, and MongoDB as the
database.

### Features includes:

In user side,

- Registration & verification
- Product list
- Wishlist
- Cart
- Order placement
- Order history <br>

In admin side,

- Dashboard
- Category management
- Product management
- User management
- Banner management
- Coupon management

### Tools and technologies used :

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

| Technology          | Description                                          |
| ------------------- | ---------------------------------------------------- |
| Node JS, Express JS | For backend                                          |
| EJS                 | As view engine                                       |
| Mongoose            | Database library                                     |
| CSS and Bootstrap   | For styling                                          |
| Nodemailer          | For sending emails                                   |
| Axios               | For API calls                                        |
| Bcrypt              | For password hashing                                 |
| Multer              | For multiple file upload                             |
| JQuery-validation   | Form validation                                      |
| Razorpay            | For payment integration                              |
| Otp-generator       | To generate random OTP                               |
| Chart JS            | To make diagramatic `<br>`reports on admin dashboard |

# Pages of my website:

## User side :

- ### **Homepage** `<br>`

  Home page is visible for every user entering into website. It contains banners linking into categories, special products, and all categories of products. If the user is logged in, the name will show on the navbar.

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/e5cab3e1-a852-470d-9f9d-ecbdc17967fb" width="500"> <br>

  **Navbar difference for logged in user and other users**

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/5eed2bd7-c68d-4243-9483-7b46be96af63" height="100"> <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/4425a8a8-96e6-4b90-9d53-7da9758ab6d8" height="100">

- ### **Register** `<br>`

  User can register by filling the validated form, and then have to verify registered email by opening the link received in the email.`<br>`

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/59edb601-5b33-4c6a-bd75-4ba371e430da" width="500"> <br>

- ### **Login** `<br>`

  User have to enter verified email and password to enter into shop. In case of forgot password, there is an option to set new password by matching OTP received to verified email. `<br>`

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/f15403b2-de92-4d38-ab8d-daf201a8c395" width="500"> <br>

  **Forgot password**

  <img width="200" alt="Capture" src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/97541227-f951-42fb-8017-c1144768c7ac">

- ### **Products** `<br>`

  It is the page that listing all products for user. User can click the button for view product, add to wishlist, or add to cart. `<br>`

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/ca48d10e-f804-430d-b67d-48254ed6e6f4" width="500"> <br>

  **Hover view on single product**

  <img width="200" alt="prodct" src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/96e2771e-1329-455c-9a66-7955a87057e3">

- ### **Product details** `<br>`

  The page shows the detailed description of product with price and buttons for add to wishlist and add to cart.

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/7a41489f-b40b-4fcf-9819-4f0925bf2e53" width="500"> <br>

- ### **Wishlist** `<br>`

  User can add and remove products here to save for later and can directly move to cart for placement.

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/44f6d3df-778a-462f-80bd-72edb4677557" width="500"> <br>

- ### **Cart** `<br>`

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/31b97ca9-e96d-443d-bb0e-080bba88d1da" width="500"> <br>

  User can add or remove products to cart for order placement and can change quantity of products. Discount coupons are also available
  and can view by clicking the button 'Available coupons'.

- ### **Place order** `<br>`

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/2fb17531-4d1f-4c29-b947-491495adef1b" width="500"> <br>

  User can select or add address for delivery and choose payment method and then place the order. After successful order placement, the window will show the below screen.

  **Order success page**

  <img width="200" alt="ordr succs" src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/422bb8a6-4925-468d-8d66-00bf952997b6"> <br>

- ## **Order history** `<br>`

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/6ce7490f-1fe3-4c8f-8809-96ed44ed638a" width="500"> <br>

  User can see previous orders list and on clicking a particular order, the details of that order has shown like the image below. The cancellation of orders is available only for 2 hours from the time of order placement.

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/56e3a49a-b662-4c99-8350-184d1b91fcf7" width="500"> <br>

- ### **Contact** `<br>`

  This is an active contact form to connect with company. User can send message through this form. There is also a location of the company.

  <img src="https://github.com/ShivanshKumarJha/cakes-shopping/assets/135617158/673c1785-ebc1-486a-8b7e-32f3ef0754a7" width="500"> <br>
