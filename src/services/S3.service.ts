import AWS from "aws-sdk";
import { S3Client } from "@aws-sdk/client-s3";

import { config } from "dotenv-defaults";
config();

const s3Config = {
    credentials: {
        accessKeyId: process.env.S3_ACCESS,
        secretAccessKey: process.env.S3_SECRET,
    },
    endpoint: process.env.S3_ENDPOINT,
    region: "default",
    s3ForcePathStyle: true,
};

export class S3<Bucket extends string> {
    s3Client = new S3Client(s3Config);
    s3 = new AWS.S3(s3Config);

    constructor(buckets: Bucket[]) {
        buckets.forEach((Bucket) => this.s3.createBucket({ Bucket }));
    }

    removeFile(Bucket: Bucket, Key: string) {
        return this.s3.deleteObject({
            Bucket,
            Key,
        });
    }

    getHead(Bucket: Bucket, Key: string) {
        return this.s3.headObject({ Bucket, Key }).promise();
    }

    getStream(Bucket: Bucket, Key: string) {
        return this.s3.getObject({ Bucket, Key }).createReadStream();
    }

    async getFile(Bucket: Bucket, Key: string) {
        const res = await this.s3.getObject({ Bucket, Key }).promise();
        return res.Body;
    }

    getUrl(Bucket: Bucket, Key: string) {
        return this.s3.getSignedUrl("getObject", {
            Bucket,
            Key,
        });
    }
}
