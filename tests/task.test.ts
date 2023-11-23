import request from "supertest"
import dbConnection from "./handler/dbConnection"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import app from "../app"
import { createUser, getAuth } from "./factories/userFactory"
import moment from "moment"
import { ITask } from "../interfaces"
import { createTasks } from "./factories/taskFactory"
import TaskModel from "../models/Task";
// import { createUser } from "./factories/userFactory"

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

/**
 * Test the get list of task endpoint
 * @group TaskListFunction
 * @author Haikal Fikri Luzain <haikalfikriluzain@gmail.com>
 * @contributor
 */
describe("Get the list of task", () => {
  test("Should get the list of task", async () => {
    const user = await createUser()
    const token = await getAuth(user)
    const tasks = await createTasks(5)

    const res = await request(app)
      .get("/api/task")
      .set('Authorization', `Bearer ${token}`)
      .expect(StatusCodes.OK)

    expect(res.body).toHaveProperty('data')
    expect(res.body).toMatchObject({
      statusCode: StatusCodes.OK,
      message: "Get the list of task",
    })
    expect(tasks).toHaveLength(5)
    expect(res.body.data).toHaveLength(5)
  })

  test("Cannot get the list of task because unauthorized", async () => {
    const tasks = await createTasks(5)

    const res = await request(app)
      .get("/api/task")
      .expect(StatusCodes.UNAUTHORIZED)

    expect(res.body).not.toHaveProperty('data')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      }
    })
  })
})

/**
 * Test the create task endpoint
 * @group CreateTaskFunction
 * @author Haikal Fikri Luzain <haikalfikriluzain@gmail.com>
 * @contributor
 */
describe("Create the task", () => {
  test("Should create a task successfully", async () => {
    const user = await createUser()
    const token = await getAuth(user)

    const payload: ITask = {
      title: "Testing title",
      pinned: true,
      pinnedAt: moment().toDate(),
      dueAt: moment().add(7, 'days').toDate(),
      remindAt: moment().add(12, 'hours').toDate(),
      repeat: 'DAILY',
      notes: "Test description"
    }

    const res = await request(app)
      .post("/api/task")
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.OK)

    expect(res.body).toMatchObject({
      statusCode: StatusCodes.OK,
      message: "Successfully created the task",
      data: {
        title: payload.title,
        pinned: payload.pinned,
        pinnedAt: payload.pinnedAt.toISOString(),
        dueAt: payload.dueAt.toISOString(),
        remindAt: payload.remindAt.toISOString(),
        repeat: payload.repeat,
        notes: payload.notes
      }
    })
  })

  test("Cannot create a task because unauthorized", async () => {
    const payload: ITask = {
      title: "Testing title",
      pinned: true,
      pinnedAt: moment().toDate(),
      dueAt: moment().add(7, 'days').toDate(),
      remindAt: moment().add(12, 'hours').toDate(),
      repeat: 'DAILY',
      notes: "Test description"
    }

    const res = await request(app)
      .post("/api/task")
      .send(payload)
      .expect(StatusCodes.UNAUTHORIZED)

    expect(res.body).toHaveProperty('error')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      }
    })
  })

  test("Cannot create a task because unprocessable entity", async () => {
    const user = await createUser()
    const token = await getAuth(user)

    const payload = {
      title: "",
      remindAt: "December, 10th 2021",
      repeat: 'MOSTLY',
      notes: "Test description"
    }

    const res = await request(app)
      .post("/api/task")
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.UNPROCESSABLE_ENTITY)

    expect(res.body).toHaveProperty('error.errors')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        message: ReasonPhrases.UNPROCESSABLE_ENTITY,
        errors: {
          title: "title is a required field",
          remindAt: "remindAt must be a `date` type, but the final value was: `Invalid Date` (cast from the value `\"December, 10th 2021\"`).",
          repeat: "repeat must be one of the following values: DAILY, WEEKDAYS, WEEKLY, MONTHLY, YEARLY",
        }
      }
    })
  })
})

/**
 * Test the update task endpoint
 * @group UpdateTaskFunction
 * @author Haikal Fikri Luzain <haikalfikriluzain@gmail.com>
 * @contributor
 */
describe("Update the task", () => {
  test("Should update a task successfully", async () => {
    const user = await createUser()
    const token = await getAuth(user)
    const task = (await createTasks(1))[0]

    const payload: ITask = {
      title: "Updated Testing title",
      pinned: true,
      pinnedAt: moment().toDate(),
      dueAt: moment().add(7, 'days').toDate(),
      remindAt: moment().add(12, 'hours').toDate(),
      repeat: 'WEEKLY',
      notes: "Test description updated"
    }

    const res = await request(app)
      .put(`/api/task/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.OK)

    expect(res.body).toMatchObject({
      statusCode: StatusCodes.OK,
      message: "Successfully updated the task",
      data: {
        title: payload.title,
        pinned: payload.pinned,
        pinnedAt: payload.pinnedAt.toISOString(),
        dueAt: payload.dueAt.toISOString(),
        remindAt: payload.remindAt.toISOString(),
        repeat: payload.repeat,
        notes: payload.notes
      }
    })
  })

  test("Cannot update a task because not found", async () => {
    const user = await createUser()
    const token = await getAuth(user)

    const payload: ITask = {
      title: "Updated Testing title",
      pinned: true,
      pinnedAt: moment().toDate(),
      dueAt: moment().add(7, 'days').toDate(),
      remindAt: moment().add(12, 'hours').toDate(),
      repeat: 'WEEKLY',
      notes: "Test description updated"
    }

    const res = await request(app)
      .put("/api/task/000")
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.NOT_FOUND)

    expect(res.body).toHaveProperty('error')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.NOT_FOUND,
        message: "Task is not found",
      }
    })
  })

  test("Cannot update a task because unauthorized", async () => {
    const task = (await createTasks(1))[0]
    const payload: ITask = {
      title: "Updated Testing title",
      pinned: true,
      pinnedAt: moment().toDate(),
      dueAt: moment().add(7, 'days').toDate(),
      remindAt: moment().add(12, 'hours').toDate(),
      repeat: 'WEEKLY',
      notes: "Test description updated"
    }

    const res = await request(app)
      .put(`/api/task/${task._id}`)
      .send(payload)
      .expect(StatusCodes.UNAUTHORIZED)

    expect(res.body).toHaveProperty('error')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      }
    })
  })

  test("Cannot update a task because unprocessable entity", async () => {
    const user = await createUser()
    const token = await getAuth(user)
    const task = (await createTasks(1))[0]

    const payload = {
      title: "",
      remindAt: "December, 10th 2021",
      repeat: 'MOSTLY',
      notes: "Test description updated"
    }

    const res = await request(app)
      .put(`/api/task/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.UNPROCESSABLE_ENTITY)

    expect(res.body).toHaveProperty('error.errors')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        message: ReasonPhrases.UNPROCESSABLE_ENTITY,
        errors: {
          title: "title is a required field",
          remindAt: "remindAt must be a `date` type, but the final value was: `Invalid Date` (cast from the value `\"December, 10th 2021\"`).",
          repeat: "repeat must be one of the following values: DAILY, WEEKDAYS, WEEKLY, MONTHLY, YEARLY",
        }
      }
    })
  })
})

/**
 * Test the create task endpoint
 * @group CreateTaskFunction
 * @author Haikal Fikri Luzain <haikalfikriluzain@gmail.com>
 * @contributor
 */
describe("Delete the task", () => {
  test("Should delete a task successfully", async () => {
    const user = await createUser()
    const token = await getAuth(user)
    const task = (await createTasks(1))[0]

    const res = await request(app)
      .delete(`/api/task/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(StatusCodes.OK)

    expect(res.body).toMatchObject({
      statusCode: StatusCodes.OK,
      message: "Successfully deleted the task"
    })

    const deletedTask = await TaskModel.findById(task._id)
    expect(deletedTask).toBeNull()
  })

  test("Cannot delete a task because not found", async () => {
    const user = await createUser()
    const token = await getAuth(user)

    const res = await request(app)
      .delete("/api/task/000")
      .set('Authorization', `Bearer ${token}`)
      .expect(StatusCodes.NOT_FOUND)

    expect(res.body).toHaveProperty('error')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.NOT_FOUND,
        message: "Task is not found",
      }
    })
  })

  test("Cannot delete a task because unauthorized", async () => {
    const task = (await createTasks(1))[0]

    const res = await request(app)
      .delete(`/api/task/${task._id}`)
      .expect(StatusCodes.UNAUTHORIZED)

    expect(res.body).toHaveProperty('error')
    expect(res.body).toMatchObject({
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      }
    })
    const deletedTask = await TaskModel.findById(task._id)
    expect(deletedTask).toBeTruthy()
  })
})

