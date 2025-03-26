import express, { Request, Response } from 'express'
import { upload } from '../../utils/Multer'
import path from "path";
import fs from "fs";
import authenticateUser from '../../middlewares/authenticateUser';
const multer = require("multer"); // do not convert to import statement, typescript errors out for some reason
const router = express.Router()
/*
usage:
    Posting to /api/images/upload:
        create FormData
        append ("image", file) to FormData (file: File, our uploaded image)
        the server responds with the FileUrl
    Getting from /api/images/:id:
        create a request where :id
        is the FileUrl (it's the api path to the server's static images)
    Example:
        imageUrl = POST(/api/images/upload, FormData);
        GET imageUrl
*/
router.post(
    "/api/images/upload",
    [
        authenticateUser,
        upload.single("image")
    ],
    async (req: Request, res: Response) => {
        try {
            if (req.file && req.file.filename) {
                const fileUrl: string = `http://localhost:3000/api/images/${req.file.filename}`
                res.status(200).json({ message: "File uploaded", filename: fileUrl });
            } else {
                res.status(400).json({ message: "Bad request" });
            }
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.delete("/api/images/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
        const filename = req.params.id;
        const filePath = path.join(__dirname, "../../uploads/", filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return res.status(500).json({ message: "Error deleting file" });
            }
            res.status(200).json({ message: "File deleted successfully" });
        });
    } catch (error) {
        console.error("Error in delete endpoint:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/api/images/:id", authenticateUser, (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, "../../uploads/" + req.params.id));
});
export default router
