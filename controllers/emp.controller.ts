import type { Request, Response } from "express";
import { sqlConnection } from "../configs/db";

export const addEmployeeInfo = async (req: Request, res: Response) => {
    try {
        const { emp_id, emp_name, emp_phone, dept } = req.body;
        const pool = await sqlConnection()
        const requestInput = pool.request()
        const inputs: Record<string, unknown> = {
            emp_id,
            emp_name,
            emp_phone,
            dept,
        }
        Object.keys(inputs).forEach(key => {
            requestInput.input(key, inputs[key] as any)
        })
        const result = await requestInput.query(`
            INSERT INTO dbo.employee_details (emp_id,emp_name,emp_phone,dept)OUTPUT INSERTED.* values(@emp_id,@emp_name,@emp_phone,@dept)
            `)
        const insertedInfo = result.recordset[0]
        return res.status(201).json({ message: "User account created successfully!", data: insertedInfo })
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
}

export const viewEmployeeInfos = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const pool = await sqlConnection();
        const requestQuery = pool.request()
        const findQuery = await requestQuery.query(`SELECT * FROM dbo.employee_details`);
        if (!findQuery || findQuery.recordset.length === 0) {
            return res.status(404).json({ message: "User Records are unavailable!" })
        }
        return res.status(200).json({ message: "User record fetched successfully!", fetchedData: findQuery.recordset })
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ error: "Failed to create employee detail" });

    }
}

export const getEmpInfoById = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        console.log("fetched employee id:",id);
        const pool = await sqlConnection()
        const requestQuery = pool.request();
        requestQuery.input("emp_id",id?.trim())

        const fetchInfo = await requestQuery.query(`SELECT * FROM dbo.employee_details WHERE emp_id=@emp_id`)
        if (fetchInfo.recordset.length === 0) {
            return res.status(404).json({ message: "User record not found!" });
        }
        return res.status(200).json({ message: "User record fetched successfully!", data: fetchInfo.recordset[0] })
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ error: "Failed to create user" });

    }
}

