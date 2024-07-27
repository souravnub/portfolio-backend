import {
    DeletedObject,
    DeleteObjectsCommand,
    ListObjectsV2Command,
    ObjectIdentifier,
    S3Client,
} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_IAM_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_IAM_SECRET_KEY!,
    },
});

export async function clearDirectory(directoryKey: string): Promise<
    | {
          success: false;
          message: string;
      }
    | { success: true; deletedObjects: DeletedObject[] }
> {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: directoryKey,
        });
        const { Contents } = await s3Client.send(command);

        if (!Contents) return { success: false, message: "No Objects found" };

        const objectKeysToDelete = Contents.map((obj) => ({
            Key: obj.Key,
        })) as ObjectIdentifier[];

        const deleteRes = await s3Client.send(
            new DeleteObjectsCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: {
                    Objects: objectKeysToDelete,
                },
            })
        );

        return {
            success: true,
            deletedObjects: deleteRes.Deleted ? deleteRes.Deleted : [],
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: "Error while deleting objects from AWS",
        };
    }
}
