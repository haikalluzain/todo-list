import request from "supertest"
import dbConnection from "./handler/dbConnection"
import faker from "faker"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import app from "../src/app"
import { createUser } from "./factories/userFactory"

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbConnection.connect()
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

describe("Register The User", () => {
  test("Should register the user successfully", async () => {
    const payload = {
      name: faker.name.findName(),
      email: "hai@gmail.com",
      password: "12345678",
    }

    const res = await request(app)
      .post("/api/auth/register")
      // .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload)
      .expect(StatusCodes.OK)

    expect(res.body).toMatchObject({
      statusCode: StatusCodes.OK,
      message: "Successfully registered the user",
      data: {
        name: payload.name,
        email: payload.email,
      },
    })
  })

  test("Should get unprocessable entity because payload is empty", async () => {
    const payload = {}

    const res = await request(app)
      .post("/api/auth/register")
      // .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload)
      .expect(StatusCodes.UNPROCESSABLE_ENTITY)

    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        message: ReasonPhrases.UNPROCESSABLE_ENTITY,
      },
    })

    expect(res.body.error).toMatchObject({
      errors: {
        name: "name is a required field",
        email: "email is a required field",
        password: "password is a required field",
      },
    })
  })

  test("Should get unprocessable entity because the email is already registered", async () => {

    const user = await createUser()

    const payload = {
      name: faker.name.findName(),
      email: user.email,
      password: "12345678"
    }

    const res = await request(app)
      .post("/api/auth/register")
      .send(payload)
      .expect(StatusCodes.UNPROCESSABLE_ENTITY)

    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        message: "This email is already registered",
      },
    })
  })
})

describe("Login The User", () => {
  test("Should login the user successfully", async () => {
    let password = '12345678'
    const user = {
      name: "Haikal",
      email: "haikal@gmail.com",
      password
    };
    await createUser(user)
    
    const payload = {
      email: user.email,
      password
    }

    const res = await request(app)
      .post("/api/auth/login")
      .send(payload)
      .expect(StatusCodes.OK);
      
    expect(res.body).toMatchObject({
      statusCode: StatusCodes.OK,
      message: "Successfully logged in",
    })
    expect(res.body).toHaveProperty("token");
  });
})
