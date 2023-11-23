import request from "supertest"
import dbConnection from "./handler/dbConnection"
import faker from "faker"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import app from "../app"
import { createUser, getAuth } from "./factories/userFactory"

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbConnection.connect()
  // server({ app })
})

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbConnection.clear());

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await dbConnection.close()
})


describe("Get the user data", () => {
  test("Should get the user data", async () => {
    const user = await createUser()
    const token = await getAuth(user)

    const res = await request(app)
      .get("/api/users")
      .set('Authorization', `Bearer ${token}`)
      // .send(payload)
      .expect(StatusCodes.OK)

    expect(res.body).toMatchObject({
      statusCode: StatusCodes.OK,
      message: "Get the user data",
      data: {
        name: user.name,
        email: user.email
      }
    })
  })
})