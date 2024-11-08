const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Jobs = require("../models/Job");

const getAllJobs = async (req, res) => {
  const {userId} = req.user;
  const jobs = await Jobs.find({createdBy:userId}).sort('createdBy');
  res.status(StatusCodes.OK).json({
    jobs, 
    count: jobs.length, 
  });
}

const getJob = async (req, res) => {
  const {id:jobId} = req.params;
  const {userId} = req.user; 
  
  const job = await Jobs.findOne({createdBy:userId, _id:jobId});
  res.status(StatusCodes.OK).json({
    job
  });
}

const createJob = async (req, res) => {
  const {company, position} = req.body; 
  const {userId} = req.user; 
  
  if ( !company || !position){
    throw new BadRequestError('Insufficient data');
  }

  const job = await Jobs.create({company, position, createdBy:userId});
  res.status(StatusCodes.CREATED).json({job});
}

const updateJob = async (req, res) => {
  const {id:jobId} = req.params;
  const {userId} = req.user;
  const {company, position} = req.body; 

  if ( company === '' || position === ''){
    throw new BadRequestError('Company and position cannot be empty');
  }

  const job = await Jobs.findOneAndUpdate(
    {_id:jobId, createdBy:userId},
     req.body,
    {new:true, runValidators:true});
  
    if (!job){
      throw new NotFoundError(`No job with id: ${jobId}`);
    }

  res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req, res) => {
  const {id:jobId} = req.params;
  const {userId} = req.user;

  const job = await Jobs.findOneAndDelete({_id:jobId, createdBy:userId});

  if (!job){
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json({deletedJob: job, msg: 'Deletion successful'});
}



module.exports = {
  getAllJobs, 
  getJob, 
  createJob, 
  updateJob, 
  deleteJob
}