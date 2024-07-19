import { NextFunction, Request, Response } from 'express';
import  Note  from '../model/noteModel';
import  User  from '../model/userModel';


export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, dueDate, status } = req.body;
        const note = await Note.create({ title, description, dueDate, status, userId: req.userId });
        await User.findByIdAndUpdate(req.userId, { $push: { notes: note._id } }).populate('notes');

        res.status(201).json(note);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
export const getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note = await Note.findById(req.params.id);
        res.status(200).json(note);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json("Note not found");
        const noteCreator = note.userId.toString();
        if (noteCreator !== req.userId) return res.status(401).json("You are not authorized to update this note");
        const { title, description, dueDate, status, userId } = req.body;
        await Note.findByIdAndUpdate(req.params.id, { title, description, dueDate, status, userId });
        res.status(200).json("Note updated successfully");
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json("Note not found");
        const noteCreator = note.userId.toString();
        if (noteCreator !== req.userId) return res.status(401).json("You are not authorized to delete this note");
        await Note.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(req.userId, { $pull: { notes: req.params.id } });
        res.status(200).json("Note deleted successfully");
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getMyNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = await Note.find({ userId: req.userId });
        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

