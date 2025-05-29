import request from "supertest";
import app from "../src/index.js";

describe("Wallet Controller", () => {
  it("should return something", async () => {
    const res = await request(app).get("/wallet/some-route"); // example
    expect(res.statusCode).toBe(200);
  });
});
