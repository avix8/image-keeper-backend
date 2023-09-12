import { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import Image from "../models/Image.js";
import path from "path";

import contentDisposition from "content-disposition";

import { S3 } from "../services/S3.service.js";

const s3 = new S3(["images"]);

const getFilename = (image) => image._id.toString() + path.extname(image.name);

const setImageKey = async (
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, key?: string) => void,
) => {
    const image = await Image.create({ name: file.originalname });
    cb(null, getFilename(image));
};

export const upload = multer({
    storage: multerS3({
        s3: s3.s3Client,
        bucket: "images",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: setImageKey,
    }),
});

export const uploaded = (req: Request, res: Response) => {
    res.json();
};

export const getAll = async (req: Request, res: Response) => {
    const images = await Image.find().sort({ uploadDate: -1 });

    res.json(
        images.map((image) => ({
            ...image,
            src: s3.getUrl("images", getFilename(image)),
        })),
    );
};

export const download = async (req: Request, res: Response) => {
    if (!req.params.id) return res.status(404).send();
    const image = await Image.findById(req.params.id);
    const filename = getFilename(image);
    const head = await s3.getHead("images", filename);

    res.writeHead(200, {
        "Content-Length": head.ContentLength,
        "Content-Disposition": contentDisposition(image.name),
        "Content-Type": "image/*",
    });
    s3.getStream("images", filename).pipe(res);
};
