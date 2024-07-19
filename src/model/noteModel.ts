import mongoose, {Schema} from "mongoose"
import joi from "joi"
import { UserAttributes } from "./userModel";



export interface NoteAttributes {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  userId: mongoose.Types.ObjectId 
}

const noteValidationSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  dueDate: joi.date().required(),
  status: joi.string().required(),
})

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.pre("validate", async function (next) {
  try{
    const {title, description, dueDate, status} = this
    const validateNote = await noteValidationSchema.validateAsync({title, description, dueDate, status}, {abortEarly: false})
    this.set(validateNote)
    next()
  }catch(error: any){
    next(error)
  }
}
)

const Note = mongoose.model<NoteAttributes>('Note', noteSchema)

export default Note