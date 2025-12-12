import express from 'express'
import { addEmployeeInfo, deleteInfo, getEmpInfoById, modifyInfo, searchInfos, viewEmployeeInfos } from '../controllers/emp.controller';

const router = express.Router();

router.post("/create-emp",addEmployeeInfo)
router.get("/get-empInfos",viewEmployeeInfos)
router.get("/get-empInfo/:id",getEmpInfoById)
router.put("/modify-emp/:id",modifyInfo)
router.get("/search-info",searchInfos)
router.delete("/deleteInfo/:id",deleteInfo)
export default router;