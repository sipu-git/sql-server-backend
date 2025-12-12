import type { Request, Response } from "express";
import { sqlConnection } from "../configs/db";

export const addEmployeeInfo = async (req: Request, res: Response) => {
    try {
        const { emp_id, emp_name, emp_phone, dept } = req.body;
        if (!emp_id || !emp_name || !emp_phone || !dept) {
            return res.status(400).json({ message: "All fields are required" });
        }
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
        return res.status(500).json({ error: "Failed to load server!" });
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
        return res.status(500).json({ error: "Failed to load server!" });

    }
}

export const getEmpInfoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        console.log("fetched employee id:", id);
        const pool = await sqlConnection()
        const requestQuery = pool.request();
        requestQuery.input("emp_id", id?.trim())

        const fetchInfo = await requestQuery.query(`SELECT * FROM dbo.employee_details WHERE emp_id=@emp_id`)
        if (fetchInfo.recordset.length === 0) {
            return res.status(404).json({ message: "User record not found!" });
        }
        return res.status(200).json({ message: "User record fetched successfully!", data: fetchInfo.recordset[0] })
    } catch (error) {
        console.error("Create User Error:", error);
        return res.status(500).json({ error: "Failed to load server!" });

    }
}

export const modifyInfo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        console.log("fetched employee id:", id);
        const { emp_name, emp_phone, dept } = req.body;
        if (!id) {
            return res.status(400).json({ meesage: "ID is required!" })
        }

        const pool = await sqlConnection()
        const requestQuery = pool.request()
        requestQuery.input("emp_id", id?.trim());
        requestQuery.input("emp_name", emp_name);
        requestQuery.input("emp_phone", emp_phone);
        requestQuery.input("dept", dept);

        const modifyQuery = ` UPDATE dbo.employee_details SET emp_id=@emp_id,emp_name=@emp_name,emp_phone=@emp_phone,dept=@dept WHERE emp_id=@emp_id`;

        const resultQuery = await requestQuery.query(modifyQuery);
        if (resultQuery.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        console.log(resultQuery)
        return res.status(201).json({ message: "Employee record updated successfully!" })
    } catch (error) {
        console.error("internal server error:", error);
        return res.status(500).json({ error: "Failed to load server!" });

    }
}

export const deleteInfo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        console.log("fetched employee id:", id);
        if (!id) {
            return res.status(400).json({ message: "ID is required!" })
        }
        const pool = await sqlConnection()
        const requestInput = pool.request()
        requestInput.input("emp_id", id.trim())
        const fetchDetail = await requestInput.query(`DELETE * FROM dbo.employee_details WHERE emp_id=@emp_id`)
        if (fetchDetail.recordset.length === 0) {
            return res.status(404).json({ message: "User record not found!" });
        }
        return res.status(200).json({ message: "User record deleted successfully!", data: fetchDetail.recordset[0] })
    } catch (error) {
        console.error("internal server error:", error);
        return res.status(500).json({ error: "Failed to load server!" });

    }
}

export const searchInfos = async (req: Request, res: Response) => {
    try {
        const { emp_name, dept } = req.query;
        const pool = await sqlConnection();
        const requestQuery = pool.request()
        if (emp_name) {
            requestQuery.input("emp_name", `%${emp_name}`)
        }
        if (dept) {
            requestQuery.input("dept", `%${dept}`)
        }
        let serachQuery = `SELECT emp_id, emp_name, emp_phone, dept FROM dbo.employee_details WHERE 1 = 1`;
        if (emp_name) {
            serachQuery += ` AND emp_name COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @emp_name`;
        }
        if (dept) {
            serachQuery += ` AND dept COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @dept`;
        }
        const resultQuery = await requestQuery.query(serachQuery)
        return res.status(200).json({ message: "Info fetched successfully!", data: resultQuery.recordset })
    } catch (error) {
        console.error("internal server error:", error);
        return res.status(500).json({ error: "Failed to load server!" });

    }
}