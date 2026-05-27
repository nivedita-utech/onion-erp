import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Document from './document.model.js';
import ApiError from '../../utils/ApiError.js';

/**
 * @desc    Upload a document
 * @route   POST /api/documents
 * @access  Private
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const { attachedTo, attachedModel } = req.body;
  if (!attachedTo || !attachedModel) {
    throw new ApiError(400, 'attachedTo and attachedModel are required');
  }

  const userId = req.user?._id || '651234567890123456789012';

  const document = await Document.create({
    filename: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    attachedTo,
    attachedModel,
    uploadedBy: userId,
  });

  res.status(201).json(ApiResponse.success('Document uploaded successfully', document));
});

/**
 * @desc    Get documents by attached record
 * @route   GET /api/documents/:model/:id
 * @access  Private
 */
export const getDocuments = asyncHandler(async (req, res) => {
  const { model, id } = req.params;

  const documents = await Document.find({
    attachedModel: model,
    attachedTo: id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.status(200).json(ApiResponse.success('Documents retrieved successfully', documents));
});

/**
 * @desc    Delete a document (soft delete)
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!document) {
    throw new ApiError(404, 'Document not found');
  }

  res.status(200).json(ApiResponse.success('Document deleted successfully', null));
});
