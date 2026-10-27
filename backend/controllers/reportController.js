import Report from '../models/Report.js';
import FoodListing from '../models/FoodListing.js';

export const createReport = async (req, res, next) => {
  try {
    const { listingId, reason, details } = req.body;

    if (!listingId || !reason || !details) {
      return res.status(400).json({
        success: false,
        message: 'listingId, reason, and details are required to submit a report.',
      });
    }

    const listing = await FoodListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Reported food listing does not exist.',
      });
    }

    const report = await Report.create({
      reporterId: req.user._id,
      listingId,
      reason,
      details: details.trim(),
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Safety report submitted to platform administration for immediate review.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('reporterId', 'name email organizationName role')
      .populate('listingId', 'title category donorId status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminAction, adminNotes } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    if (status) report.status = status;
    if (adminAction) report.adminAction = adminAction;
    if (adminNotes) report.adminNotes = adminNotes;

    report.resolvedAt = new Date();
    report.resolvedBy = req.user._id;

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report status updated.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export default { createReport, getReports, updateReportStatus };
