import express from 'express';
import controller from '../controllers/zipcodescontroller';

const router = express.Router();

router.post('/zipcodes', controller.insertZipCode);
router.delete('/zipcodes/:id', controller.deleteZipCode);
router.get('/zipcodes/:id', controller.hasZipCode);
router.get('/zipcodes', controller.displayZipCodes);

export = router;
