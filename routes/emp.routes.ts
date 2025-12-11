import express from 'express'
import { addEmployeeInfo, deleteInfo, getEmpInfoById, modifyInfo, viewEmployeeInfos } from '../controllers/emp.controller';

const router = express.Router();

router.post("/create-emp",addEmployeeInfo)
router.get("/get-empInfos",viewEmployeeInfos)
router.get("/get-empInfo/:id",getEmpInfoById)
router.put("/modify-emp/:id",modifyInfo)
router.delete("/deleteInfo/:id",deleteInfo)
export default router;