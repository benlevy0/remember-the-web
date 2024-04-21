import request from "supertest";
import app from "./index";

describe("POST /remember", () => {
  it("should process text and add flashcards", async () => {
    const sampleText =
      "The United States President at the moment is Joe Biden.";

    const response = await request(app)
      .post("/remember")
      .send({ text: sampleText })
      .expect(200);

    expect(response.text).toContain("Added");
  });
});
