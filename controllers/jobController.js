import { StatusCodes } from "http-status-codes";
import JobModel from "../models/JobModel.js";
import mongoose from "mongoose";
import day from "dayjs";
export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;
  let queryParams = { createdBy: req.user.userId };

  //filter
  if (search) {
    queryParams.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  if (jobStatus && jobStatus !== "all") {
    queryParams.jobStatus = jobStatus;
  }
  if (jobType && jobType !== "all") {
    queryParams.jobType = jobType;
  }

  // sortBy
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await JobModel.find(queryParams)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  const totalJobs = await JobModel.countDocuments(queryParams);
  const totalPages = Math.ceil(totalJobs / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalJobs, totalPages, currentPage: page, jobs });
};

export const createJob = async (req, res) => {
  console.log(req.body);
  req.body.createdBy = req.user.userId;
  const job = await JobModel.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedJob = await JobModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json({ msg: "Job updated", job: updatedJob });
};
export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await JobModel.findById(id);
  return res.status(StatusCodes.OK).json({ job });
};
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await JobModel.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json({ msg: "Job deleted", job: removedJob });
};

export const showStats = async (req, res) => {
  let stats = await JobModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await JobModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((obj) => {
      const {
        _id: { year, month },
        count,
      } = obj;
      // this work the same way as well
      // return { date: day(`${year}-${month}`).format("MMM YY"), count };
      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
