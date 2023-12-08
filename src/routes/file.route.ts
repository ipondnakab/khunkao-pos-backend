import { Storage } from '@/core/storage';
import { postUploadFile, getFile } from '@/handlers/file.handler';
import express from 'express';

const router = express.Router();

router.use('/upload', Storage.upload.single('file'), postUploadFile);
router.use('/:filename', getFile);

export default router;
