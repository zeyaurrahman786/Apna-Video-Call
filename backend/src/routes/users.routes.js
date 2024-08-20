import { Router } from "express";


const router = Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity")
router.route("/get_all_activity")


export default router;