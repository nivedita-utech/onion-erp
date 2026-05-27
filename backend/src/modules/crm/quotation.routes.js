import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import Quotation from './quotation.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import PdfService from '../../utils/pdfService.js';
import ApiError from '../../utils/ApiError.js';

const router = express.Router();

router.get('/', getAll(Quotation));
router.get('/:id', getOne(Quotation, { path: 'lead customer items.product' }));
router.post('/', createOne(Quotation));
router.put('/:id', updateOne(Quotation));
router.delete('/:id', deleteOne(Quotation));

/**
 * Generate PDF for Quotation
 */
router.get('/:id/download', asyncHandler(async (req, res) => {
  const quotation = await Quotation.findById(req.params.id)
    .populate('lead')
    .populate('customer')
    .populate('items.product');

  if (!quotation) throw new ApiError(404, 'Quotation not found');

  // Map lead/customer to a generic 'customer' field for PdfService
  const docData = quotation.toObject();
  docData.customer = quotation.customer || quotation.lead;
  
  PdfService.generateQuotation(res, docData);
}));

export default router;
