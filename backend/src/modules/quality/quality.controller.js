import QualityProfile from './qualityProfile.model.js';
import LabTest from './labTest.model.js';
import ProductionBatch from '../production/productionBatch.model.js';
import InventoryBatch from '../inventory/inventoryBatch.model.js';
import { generateCOA } from '../../services/coa.service.js';

/**
 * @desc    Get all quality profiles
 * @route   GET /api/quality/profiles
 * @access  Private
 */
export const getProfiles = async (req, res) => {
  try {
    const profiles = await QualityProfile.find({ isDeleted: false });
    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new quality profile
 * @route   POST /api/quality/profiles
 * @access  Private/Admin
 */
export const createProfile = async (req, res) => {
  try {
    const profile = await QualityProfile.create(req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all lab tests
 * @route   GET /api/quality/tests
 * @access  Private
 */
export const getLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find({ isDeleted: false })
      .populate('batch', 'batchId product')
      .populate('profile', 'name');
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new lab test
 * @route   POST /api/quality/tests
 * @access  Private
 */
export const createLabTest = async (req, res) => {
  try {
    const { batch, profile, results, microbialResults, overallStatus, remarks } = req.body;
    
    // Create the test record
    const labTest = await LabTest.create({
      batch,
      profile,
      results,
      microbialResults,
      overallStatus,
      remarks,
      testedBy: req.user._id
    });

    // Update the ProductionBatch
    const qualityStatus = overallStatus === 'Pass' ? 'Approved' : 'Rejected';
    const batchDoc = await ProductionBatch.findByIdAndUpdate(batch, {
      qualityStatus,
      labTest: labTest._id
    });

    // Update the corresponding InventoryBatch
    await InventoryBatch.findOneAndUpdate(
      { batchId: `PROD-${batchDoc.batchId}` },
      { qualityStatus }
    );

    res.status(201).json({ success: true, data: labTest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Download COA PDF
 * @route   GET /api/quality/tests/:id/coa
 * @access  Private
 */
export const downloadCOA = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id)
      .populate({
        path: 'batch',
        populate: { path: 'product' }
      })
      .populate('profile');

    if (!labTest) {
      return res.status(404).json({ success: false, message: 'Lab test not found' });
    }

    const doc = generateCOA(labTest);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="COA-${labTest.batch?.batchId || 'Report'}.pdf"`);
    
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('COA Download Controller Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
