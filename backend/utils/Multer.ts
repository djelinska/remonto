import { FileFilterCallback, Multer } from "multer";
import { Request } from "express";
export type DestinationCallback = (
    error: Error | null,
    destination: string
) => void;
export type FileNameCallback = (error: Error | null, filename: string) => void;
import { v4 as uuidv4 } from 'uuid';
const multer = require("multer"); // do not convert to import statement, typescript errors out for some reason

export const storage: Multer = multer.diskStorage({
    destination: function(
        _: Request,
        __: Express.Multer.File,
        cb: DestinationCallback
    ): void {
        cb(null, "./uploads/");
    },
    filename: function(
        req: Request,
        file: Express.Multer.File,
        cb: DestinationCallback
    ): void {
        cb(
            null,
            `${uuidv4()}.${file.originalname.split(".").slice(-1).join("")}`
        );
    },
});

function fileFilter(
    _: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const upload: Multer = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2097152 },
});
// 2097152 2 megabytes
