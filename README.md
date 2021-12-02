# CRUD-invoice


## Getting Started

To get started you can simply clone the repo and install the dependencies in the root folder:

Add .env file which contains:
```PORT= 5000```
``` DB_URI= (your uri to connect to MongoDB)```
   

Install ```npm install```

Run ```node start```

Run tests ```npm test```



## Libraries/Frameworks

- nodejs: JS runtime for backend

- mongoose: mongodb database library for nodejs

- express: back end web application framework for Node.js

- MongoDB: open source NoSQL database management program

- Jest: JavaScript Testing Framework


## Api Calls

1. POST- create user  ```/user/create ```
 
2. POST- create membership   ```/membership/create```
 
3. GET- get invoice ```/invoice/read/:id``` 

4. POST create invoice ```/invoice/create```
 
5. PATCH- update invoice ```/invoice/update/:id```
 
6. DELETE- delete invoice  ```/invoice/delete/:id```
 
7. GET- check in ```/checkIn/:id```


## Structure


```
├── controllers
│   ├── checkIn.js
│   ├── createInvoice.js
│   ├── createMembership.js
│   ├── createUser.js
│   ├── deleteInvoice.js
│   ├── getInvoice.js
│   └── updateInvoice.js
├── helpers
│   ├── checkActivity.js
│   └── clearDatabase.js
├── middlewares
│   └── basicAuth.js
├── models
│   ├── invoiceModel.js
│   ├── membershipModel.js
│   └── userModel.js
├── package-lock.json
├── package.json
├── routes.js
├── server.js
├── start.js
└── tests
    ├── checkIn.test.js
    ├── invoice.test.js
    └── user.test.js 
```





