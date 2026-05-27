import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const checkPermission = (moduleName, action) => asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Not authenticated');
  }


  const role = req.user.role;
  if (!role || !role.permissions) {
    throw ApiError.forbidden('No permissions assigned');
  }

  const permission = role.permissions.find(p => p.module === moduleName);
  
  if (!permission || !permission[action]) {
    throw ApiError.forbidden(`Required permission: ${action} on module ${moduleName}`);
  }

  next();
});
