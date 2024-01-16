import { Router } from "express";
import { checkTestUser } from "../middleware/authMiddleware.js";
const router = Router();
import {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  updateJob,
  showStats,
} from "../controllers/jobController.js";
import {
  validParamsId,
  validateJobInput,
} from "../middleware/validationMiddelware.js";

router
  .route("/")
  .get(getAllJobs)
  .post(checkTestUser, validateJobInput, createJob);

router.route("/stats").get(showStats);
router
  .route("/:id")
  .get(validParamsId, getJob)
  .patch(checkTestUser, validateJobInput, validParamsId, updateJob)
  .delete(checkTestUser, validParamsId, deleteJob);

export default router;
