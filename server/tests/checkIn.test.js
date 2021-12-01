const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const Membership = require("../models/membershipModel");
const Invoice = require("../models/invoiceModel");
const clearDatabase = require("../helpers/clearDatabase");

//Using beforeAll to clear database, the test runs sequentially because of --runInBand in package.json
//This way we can check the results in mongoDB Atlas
beforeAll(async () => await clearDatabase());

afterAll((done) => {
  mongoose.connection.close();
  done();
});

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

      const res2 = await request
        .post("/membership/create")
        .send(membershipCredits0);
      expect(res2.body._id).toBeDefined();
      expect(res2.statusCode).toBe(201);
      expect(res2.body.credits).toBe(membershipCredits0.credits);
      expect(new Date(res2.body.start_date)).toEqual(
        new Date(membershipCredits0.start_date)
      );
      expect(new Date(res2.body.end_date)).toEqual(
        new Date(membershipCredits0.end_date)
      );
      expect(res2.body.invoices).toEqual(membershipCredits0.invoices);
      expect(res2.body.user).toBe(membershipCredits0.user);

      const savedMembership2 = await Membership.findById(res2.body._id);
      expect(savedMembership2).not.toBeNull();

      const res3 = await request
        .post("/membership/create")
        .send(membershipNotActive);
      expect(res3.body._id).toBeDefined();
      expect(res3.statusCode).toBe(201);
      expect(res3.body.credits).toBe(membershipNotActive.credits);
      expect(new Date(res3.body.start_date)).toEqual(
        new Date(membershipNotActive.start_date)
      );
      expect(new Date(res3.body.end_date)).toEqual(
        new Date(membershipNotActive.end_date)
      );
      expect(res3.body.invoices).toEqual(membershipNotActive.invoices);
      expect(res3.body.user).toBe(membershipNotActive.user);
      const savedMembership3 = await Membership.findById(res3.body._id);
      expect(savedMembership3).not.toBeNull();
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
      expect(newInvoice.status).toBeTruthy();
      expect(newInvoice.date).toBeTruthy();
      expect(newInvoice.amount).toBeTruthy();
      expect(newInvoice.date).toBeTruthy();
      expect(newInvoice.description).toBeTruthy();
      expect(newInvoice.invoice_lines).toBeTruthy();

      const res2 = await request.get(`/checkIn/${membership.user}`);
      const updatedInvoice = await Invoice.findById(res2.body._id);
      expect(updatedInvoice.invoice_lines.length).toBe(length + 1);
      expect(res2.statusCode).toBe(200);
    });
  });
});
