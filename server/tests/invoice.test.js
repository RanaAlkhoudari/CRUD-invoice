const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const Invoice = require("../models/invoiceModel");

afterAll((done) => {
  mongoose.connection.close();
  done();
});

const invoice = {
  status: "Outstanding",
  description: "The first invoice",
  amount: 76,
  date: new Date(),
  invoice_lines: [
    {
      amount: 76,
      description: `You checked in on ${new Date()}`,
    },
  ],
};

const nweInvoice = [];

describe("POST /invoice/create", () => {
  describe("create & save invoice successfully", () => {
    test("should respond with a 201 status code & return the invoice", async () => {
      const res = await request.post("/invoice/create").send(invoice);
      expect(res.statusCode).toBe(201);
      expect(res.body._id).toBeDefined();
      nweInvoice.push(res.body);
      expect(res.body.status).toBe(invoice.status);
      expect(res.body.description).toBe(invoice.description);
      expect(res.body.amount).toBe(invoice.amount);
      expect(new Date(res.body.date)).toStrictEqual(new Date(invoice.date));
      expect(res.body.invoice_lines[0].amount).toBe(
        invoice.invoice_lines[0].amount
      );
      expect(res.body.invoice_lines[0].description).toBe(
        invoice.invoice_lines[0].description
      );
      const savedInvoice = await Invoice.findById(res.body._id);
      expect(savedInvoice._id.toString()).toEqual(nweInvoice[0]._id);
    });
  });

  describe("when the date, status, description, amount or invoice_lines is missing", () => {
    test("should respond with a 400 status code", async () => {
      const bodyData = [
        {},
        { status: "Void" },
        { description: "The first invoice" },
        { amount: 76 },
        { date: new Date() },
        {
          invoice_lines: [
            {
              amount: 76,
              description: `You checked in on ${new Date()}`,
            },
          ],
        },
      ];
      for (const body of bodyData) {
        const res = await request.post("/invoice/create").send(body);
        expect(res.body.message).toEqual("please check your details");
        expect(res.statusCode).toBe(400);
      }
    });
  });
});

describe("GET /invoice/read/:id", () => {
  describe("get an invoice successfully", () => {
    test("should respond with a 200 status code & return the invoice", async () => {
      const res = await request.get(`/invoice/read/${nweInvoice[0]._id}`);
      const savedInvoice = await Invoice.findById(res.body._id);
      expect(res.statusCode).toBe(200);
      expect(savedInvoice._id.toString()).toEqual(nweInvoice[0]._id);
      expect(savedInvoice.status).toBe(nweInvoice[0].status);
      expect(savedInvoice.description).toBe(nweInvoice[0].description);
      expect(savedInvoice.amount).toBe(nweInvoice[0].amount);
      expect(new Date(savedInvoice.date)).toStrictEqual(
        new Date(nweInvoice[0].date)
      );
      expect(savedInvoice.invoice_lines[0].amount).toEqual(
        nweInvoice[0].invoice_lines[0].amount
      );
      expect(savedInvoice.invoice_lines[0].description).toEqual(
        nweInvoice[0].invoice_lines[0].description
      );
    });
  });

  describe("when the id does not match any invoice", () => {
    test("should respond with a 404 status code", async () => {
      const res = await request.get("/invoice/read/61a3e62c8441a3c41534453e");
      expect(res.body.message).toEqual(
        `Invoice with the id 61a3e62c8441a3c41534453e does not exist in the database`
      );
      expect(res.statusCode).toBe(404);
    });
  });
});

describe("PATCH /invoice/update/:id", () => {
  describe("update an invoice successfully", () => {
    test("should respond with a 200 status code & update the invoice", async () => {
      const res = await request
        .patch(`/invoice/update/${nweInvoice[0]._id}`)
        .send({ status: "Paid" });
      const savedInvoice = await Invoice.findById(res.body._id);
      expect(res.statusCode).toBe(200);
      expect(savedInvoice._id.toString()).toEqual(nweInvoice[0]._id);
      expect(savedInvoice.status).toBe("Paid");
      expect(savedInvoice.description).toBe(nweInvoice[0].description);
      expect(savedInvoice.amount).toBe(nweInvoice[0].amount);
      expect(new Date(savedInvoice.date)).toStrictEqual(
        new Date(nweInvoice[0].date)
      );
      expect(savedInvoice.invoice_lines[0].amount).toEqual(
        nweInvoice[0].invoice_lines[0].amount
      );
      expect(savedInvoice.invoice_lines[0].description).toEqual(
        nweInvoice[0].invoice_lines[0].description
      );
    });
  });

  describe("when the id does not match any invoice", () => {
    test("should respond with a 404 status code", async () => {
      const res = await request
        .patch("/invoice/update/61a3e62c8441a3c41534453e")
        .send({ status: "Void" });
      expect(res.body.message).toEqual(
        "Invoice with the id 61a3e62c8441a3c41534453e does not exist in the database"
      );
      expect(res.statusCode).toBe(404);
    });
  });
});

describe("DELETE /invoice/delete/:id", () => {
  describe("delete an invoice successfully", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request.delete(`/invoice/delete/${nweInvoice[0]._id}`);
      const deletedInvoice = await Invoice.findById(nweInvoice[0]._id);
      expect(deletedInvoice).toBeNull();
      expect(res.statusCode).toBe(200);
    });
  });

  describe("when the id does not match any invoice", () => {
    test("should respond with a 404 status code", async () => {
      const res = await request.delete(
        "/invoice/delete/61a3e62c8441a3c41534453e"
      );
      expect(res.body.message).toEqual(
        "Invoice with the id 61a3e62c8441a3c41534453e does not exist in the database"
      );
      expect(res.statusCode).toBe(404);
    });
  });
});
