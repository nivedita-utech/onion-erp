import asyncHandler from './asyncHandler.js';
import ApiResponse from './ApiResponse.js';
import ApiError from './ApiError.js';
import { getPaginationOptions, getPaginationMeta } from './paginate.js';

export const createOne = (Model) => asyncHandler(async (req, res) => {
  const doc = await Model.create(req.body);
  res.status(201).json(ApiResponse.success('Created successfully', doc));
});

export const getOne = (Model, popOptions) => asyncHandler(async (req, res) => {
  let query = Model.findOne({ _id: req.params.id, isDeleted: false });
  if (popOptions) query = query.populate(popOptions);
  
  const doc = await query;
  if (!doc) throw new ApiError(404, 'No document found with that ID');
  
  res.status(200).json(ApiResponse.success('Retrieved successfully', doc));
});

export const getAll = (Model, popOptions) => asyncHandler(async (req, res) => {
  const { skip, limit, sort, page } = getPaginationOptions(req.query);

  const filter = { isDeleted: false };

  // Full-text search if ?search= is provided
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  let query = Model.find(filter).skip(skip).limit(limit).sort(sort);
  if (popOptions) query = query.populate(popOptions);

  const [docs, total] = await Promise.all([
    query,
    Model.countDocuments(filter),
  ]);

  const pagination = getPaginationMeta(total, page, limit);

  res.status(200).json(ApiResponse.success('Retrieved all successfully', docs, pagination));
});

export const updateOne = (Model) => asyncHandler(async (req, res) => {
  const doc = await Model.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    req.body,
    { new: true, runValidators: true }
  );

  if (!doc) throw new ApiError(404, 'No document found with that ID');
  res.status(200).json(ApiResponse.success('Updated successfully', doc));
});

export const deleteOne = (Model) => asyncHandler(async (req, res) => {
  const doc = await Model.findOneAndUpdate(
    { _id: req.params.id },
    { isDeleted: true },
    { new: true }
  );
  if (!doc) throw new ApiError(404, 'No document found with that ID');
  res.status(200).json(ApiResponse.success('Deleted successfully', null));
});
