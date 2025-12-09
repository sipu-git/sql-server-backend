import express from 'express'
import { addEmployeeInfo, getEmpInfoById, viewEmployeeInfos } from '../controllers/emp.controller';

const router = express.Router();

router.post("/create-emp",addEmployeeInfo)
router.get("/get-empInfos",viewEmployeeInfos)
router.get("/get-empInfo/:id",getEmpInfoById)

export default router;