const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const Membership = require("../models/membershipModel");
const Invoice = require("../models/invoiceModel");
const clearDatabase = require("../helpers/clearDatabase");

//Using beforeAll to clear database, the test runs sequentially because of --runInBand in package.json
beforeAll(async () => await clearDatabase());

afterAll(() => mongoose.connection.close());

const membership = {
  credits: 3,
  start_date: "2021/07/20",
  end_date: "2021/12/20",
  invoices: [],
  user: "61a52c9dfcee94e03c787daa",
};
const membershipCredits0 = {
  credits: 0,
  start_date: "2021/07/20",
  end_date: "2021/12/20",
  invoices: [],
  user: "61a52c9dfcee94e03c787d77",
};

const membershipNotActive = {
  credits: 17,
  start_date: "2021/05/06",
  end_date: "2021/10/06",
  invoices: [],
  user: "61a52c9dfcee94e03c787d88",
};

const newMembership = [];

describe("POST /membership/create", () => {
  describe("create & save membership successfully", () => {
    test("should respond with a 201 status code & return a membership", async () => {
      const res = await request.post("/membership/create").send(membership);
      expect(res.body._id).toBeDefined();
      expect(res.statusCode).toBe(201);
      newMembership.push(res.body);
      expect(res.body.credits).toBe(membership.credits);
      expect(new Date(res.body.start_date)).toEqual(
        new Date(membership.start_date)
      );
      expect(new Date(res.body.end_date)).toEqual(
        new Date(membership.end_date)
      );
      expect(res.body.invoices).toEqual(membership.invoices);
      expect(res.body.user).toBe(membership.user);
      const savedMembership = await Membership.findById(res.body._id);
      expect(savedMembership._id.toString()).toEqual(newMembership[0]._id);
      //adding two other memberships to use them below when check In
      await request.post("/membership/create").send(membershipCredits0);
      await request.post("/membership/create").send(membershipNotActive);
    });
  });

  describe("when the credits or start_date or end_date or invoices or user is missing", () => {
    test("should respond with a 400 status code", async () => {
      const bodyData = [
        {},
        { credits: 30 },
        { start_date: "2021/10/20" },
        { end_date: "2021/12/20" },
        { invoices: [] },
        { user: "61a52c9dfcee94e03c787daa" },
      ];
      for (const body of bodyData) {
        const res = await request.post("/membership/create").send(body);
        expect(res.body.message).toEqual("please check your details");
        expect(res.statusCode).toBe(400);
      }
    });
  });
});

describe("GET /checkIn/:id", () => {
  describe("checking the membership credits and activity", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request.get(`/checkIn/${membershipCredits0.user}`);
      expect(res.body).toEqual("Unfortunately, your credits are: 0");
      expect(res.statusCode).toBe(400);
    });
    test("should respond with a 400 status code", async () => {
      const res = await request.get(`/checkIn/${membershipNotActive.user}`);
      expect(res.body).toEqual("Unfortunately, your membership is cancelled");
      expect(res.statusCode).toBe(400);
    });
  });
  describe("checking the membership invoices", () => {
    test("should respond with a 201 status code first then with 200, first create a new invoice then add new invoice_line", async () => {
      const res = await request.get(`/checkIn/${membership.user}`);
      expect(res.body._id).toBeDefined();
      expect(res.statusCode).toBe(201);
      const newInvoice = await Invoice.findById(res.body._id);
      const length = newInvoice.invoice_lines.length;
      expect(typeof newInvoice.status).toBe("string");
      expect(typeof newInvoice.amount).toBe("number");
      expect(typeof newInvoice.description).toBe("string");
      expect(newInvoice.date).toBeInstanceOf(Date);
      expect(Array.isArray(newInvoice.invoice_lines)).toBe(true);

      const res2 = await request.get(`/checkIn/${membership.user}`);
      const updatedInvoice = await Invoice.findById(res2.body._id);
      expect(updatedInvoice.invoice_lines.length).toBe(length + 1);
      expect(res2.statusCode).toBe(200);
    });
  });
});
