import express from 'express';
import { uploadDocument, getDocuments, deleteDocument } from './document.controller.js';
import upload from '../../config/multer.js';

const router = express.Router();

router.post('/', upload.single('file'), uploadDocument);
router.get('/:model/:id', getDocuments);
router.delete('/:id', deleteDocument);

export default router;
