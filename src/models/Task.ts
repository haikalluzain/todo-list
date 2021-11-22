import { Document, model, Schema } from 'mongoose'
import { ITask, TaskRepeat } from 'src/interfaces/ITask'
import { v4 } from 'uuid'

const TaskSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => {
        return v4()
      },
    },
    title: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      required: false
    },
    pinned: {
      type: Boolean,
      default: false
    },
    pinnedAt: {
      type: Date,
      required: false
    },
    dueAt: {
      type: Date,
      required: false
    },
    remindAt: {
      type: Date,
      required: false
    },
    repeat: {
      type: String,
      enum: Object.values(TaskRepeat),
      required: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: {} }
)

interface TaskDocument extends ITask, Document {
  _id: string
}

const TaskModel = model<TaskDocument>('Task', TaskSchema)

export default TaskModel