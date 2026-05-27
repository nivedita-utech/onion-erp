import AuditLog from '../modules/audit/auditLog.model.js';

/**
 * Audit Trail Middleware — logs all mutating API actions.
 *
 * Usage:
 *   router.post('/', protect, auditTrail('SalesOrder', 'CREATE'), createOne(Model));
 *   router.put('/:id', protect, auditTrail('SalesOrder', 'UPDATE'), updateOne(Model));
 *
 * @param {string} module   - The module/resource name (e.g. 'SalesOrder', 'Customer')
 * @param {string} action   - One of CREATE | UPDATE | DELETE
 * @returns {import('express').RequestHandler}
 */
export const auditTrail = (module, action) => async (req, _res, next) => {
  // Capture the original body before the handler runs
  req._auditMeta = {
    module,
    action,
    body: req.body,
  };
  next();
};

/**
 * After-response audit logger.
 * Attaches to `res.on('finish')` so it records after a successful response.
 *
 * @param {string} module
 * @param {string} action
 * @returns {import('express').RequestHandler}
 */
export const auditLogger = (module, action) => (req, res, next) => {
  res.on('finish', async () => {
    try {
      // Only log on successful mutations (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        await AuditLog.create({
          user: req.user._id,
          action,
          module,
          newValue: req.body,
        });
      }
    } catch (_err) {
      // Silently fail — audit must never break the request lifecycle
    }
  });
  next();
};

export default auditLogger;
