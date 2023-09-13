import { Request, Response } from "express";
import multer from "multer";
import Image from "../models/Image.js";
import path from "path";

import { S3 } from "../services/S3.service.js";

const s3 = new S3(["images"]);

const getFilename = (image) => image._id.toString() + path.extname(image.name);

export const upload = multer({
    storage: {
        async _handleFile(req, file, cb) {
            const image = await Image.create({ name: file.originalname });
            req.body.id = image._id;
            let { streamPass, streamPromise } = s3.uploadStream(
                "images",
                getFilename(image),
            );
            file.stream.pipe(streamPass);
            await streamPromise;
            cb(null, {});
        },
        _removeFile() {},
    },
});

export const uploaded = (req: Request, res: Response) => {
    res.json({ id: req.body.id });
};

export const getAll = async (req: Request, res: Response) => {
    const images = await Image.find().sort({ uploadDate: -1 });

    res.json(
        images.map((image) => ({
            ...image.toJSON(),
            src: s3.getUrl("images", getFilename(image)),
        })),
    );
};

export const download = async (req: Request, res: Response) => {
    const image = await Image.findById(req.params.id);
    const filename = getFilename(image);
    const head = await s3.getHead("images", filename);

    res.writeHead(200, {
        "Content-Length": head.ContentLength,
        "Content-Disposition": `attachment; filename=${image.name}`,
        "Content-Type": "image/*",
    });
    s3.getStream("images", filename).pipe(res);
};

export const setLabel = async (req: Request, res: Response) => {
    const image = await Image.findByIdAndUpdate(req.body.id, {
        label: req.body.label,
    });
    res.send(image);
};

export const remove = async (req: Request, res: Response) => {
    const image = await Image.findById(req.body.id);
    if (!image) {
        return res.status(400).send({
            message: "Image not found",
        });
    }
    s3.removeFile("images", getFilename(image));
    const deletedImage = await image.deleteOne();
    res.json(deletedImage);
};
