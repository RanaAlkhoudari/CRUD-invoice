# CRUD-invoice


## Getting Started

To get started you can simply clone the repo and install the dependencies in the root folder:

Add .env file which contains:
```PORT= 5000```
``` DB_URI= (your uri to connect to MongoDB)```
   

Install ```npm install```

Run ```node start```

Run tests ```npm test```


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



## Libraries/Frameworks

- nodejs: JS runtime for backend

- mongoose: mongodb database library for nodejs

- express: back end web application framework for Node.js

- MongoDB: open source NoSQL database management program

- Jest: JavaScript Testing Framework


## Api Calls

| Method | Url | Info
| --- | --- | --- |
| POST | /user/create |  Creates a new user
| POST | /membership/create |  Creates a new mambership
| GET  | /invoice/read/:id  |  Returns the data of a specific invoice
| POST  | /invoice/create  |   Creates a new invoice
| PATCH  | /invoice/update/:id  |   Updates a specific invoice
| DELETE  | /invoice/delete/:id  |   Deletes a specific invoice
| GET  | /checkIn/:id  |   Checks in (creates a new invoice_line if there is already an invoice for the month, if not creates a new invoice)


### User

| Method | Url | Info
| --- | --- | --- |
| POST | /user/create |  Creates a new user

#### STRUCTURE

| Field | Type | Required | Information
| --- | --- | --- |  --- |
| name | string | yes | User's name


```json
    {
     "_id":"619a7a2e598d5d98fcf8e9ec",
     "name":"John",
     }
 ```
 
 ### Membership

| Method | Url | Info
| --- | --- | --- |
| POST | /membership/create |  Creates a new mambership

#### STRUCTURE

| Field | Type | Required | Information
| --- | --- | --- |  --- |
| credits | number | yes | User's credits
| start_date | date | yes | The first day of the membership
| end_date| date | yes | The last day of the membership
| invoices | [Schema.Types.ObjectId] | yes | An array of the invoices' _ids (it could be an empty array)
| user | Schema.Types.ObjectId | yes | User's _id


```json
   {
    "_id": "61b10866bcdfa8bfcb1088dc",
    "credits": 20,
    "start_date": "2020-10-29T23:00:00.000Z",
    "end_date": "2020-12-29T23:00:00.000Z",
    "invoices": [],
    "user": "61ace990cf119137b7537123"
     }

 ```
 
 
  ### Invoice

| Method | Url | Info
| --- | --- | --- |
| POST | /invoice/create |  Creates a new invoice

#### STRUCTURE

| Field | Type | Required | values | Information
| --- | --- | --- |  --- |  --- |
| date | date | yes |   | The invoice creation date
| status | string | yes |  "Outstanding", "Void", "Paid" | The status of the invoice
| description| string | yes |   | The description about the invoice
| amount | number | yes |  | The amount of the invoice
| invoice_lines | array | yes |  | It contains amount: { type: number }, description: { type: string } 


```json
  {
   "_id": "61b112efbcdfa8bfcb1088e7",
    "date": "2021-11-30T23:00:00.000Z",
    "status": "Outstanding",
    "description": "The first invoice",
    "amount": 300,
    "invoice_lines": [
        {
            "amount": 50,
            "description": "You checked in on 2021/12/09",
            "_id": "61b112efbcdfa8bfcb1088e8"
        }
      ]
    }
 ```
 
 ## Possible error codes and messages
 
| Statuscode | Statusmessage | Description 
| --- | --- | --- | 
| 200 | Ok | Everything proceeded according to the specifications
| 201 | Created | The request has been fulfilled (i.e., Creates a new user, membership or invoice)
| 400 | Bad Request | The membership credits <=0 or the membership is cancelled
| 404 | Not Found | The API url does not point to a valid resource (i.e., Invoice with the id ... does not exist in the database)
| 500 | Internal Server Error | A generic error message, given when an unexpected condition was encountered and no more specific message is suitable













