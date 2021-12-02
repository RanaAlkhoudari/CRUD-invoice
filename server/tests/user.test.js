const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const User = require("../models/userModel");
const clearDatabase = require("../helpers/clearDatabase");

beforeAll(async () => await clearDatabase());

afterAll(() => mongoose.connection.close());

const newUser = [];

describe("POST /user/create", () => {
  describe("create & save user successfully", () => {
    test("should respond with a 201 status code & return a user", async () => {
      const res = await request.post("/user/create").send({ name: "John" });
      newUser.push(res.body);
      const savedUser = await User.findById(res.body._id);
      expect(savedUser._id.toString()).toEqual(newUser[0]._id);
      expect(res.statusCode).toBe(201);
      expect(res.body._id).toBeDefined();
      expect(res.body.name).toBe("John");
    });
  });

  describe("when the name is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request.post("/user/create").send({ gender: "male" });
      expect(res.body.message).toEqual("please enter a name");
      expect(res.statusCode).toBe(400);
    });
  });
});
