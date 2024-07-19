import express, { NextFunction, Request, Response } from 'express';
import { authentification } from '../middlewares/auth';
import { createNote, getNotes, getNote, updateNote, deleteNote, getMyNotes } from '../controller/noteController';
import Router from 'express';

const router = express.Router();

router.post('/add-note', authentification, createNote);

router.get('/get-notes', getNotes);

router.get('/get-my-notes', authentification, getMyNotes);

router.get('/:id', authentification, getNote);

router.put('/update-note/:id', authentification, updateNote);

router.delete('/:id', authentification, deleteNote);

export default router;