import { Router } from "express";
import {
  listAgencies,
  getAgency,
  createAgency,
  updateAgency,
  deleteAgency,
} from "../controllers/agencies";
import { requireAdminKey } from "../middleware/auth";

const router = Router();

// Read endpoints — public
router.get("/", listAgencies);
router.get("/:id", getAgency);

// Write endpoints — guarded by admin API key (no-op in dev if unset)
router.post("/", requireAdminKey, createAgency);
router.put("/:id", requireAdminKey, updateAgency);
router.delete("/:id", requireAdminKey, deleteAgency);

export default router;