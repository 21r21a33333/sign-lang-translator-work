import fs from "fs";
import B2 from "backblaze-b2";
import path from "path";
// 6f3c7d98b0dd
// 005bc83623d057088b5e56730be943da3c791e3025
// dotenv.config();

export const uploadToBackBlaze = async (req, res, next) => {
  console.log("I'm here uploading to Backblaze");

  const b2 = new B2({
    applicationKeyId: "6f3c7d98b0dd",
    applicationKey: "0056f1051c8dd7e235f0d66ce553f59fb51b3e9f1d"    ,
  });

  const __dirname = path.resolve();
  let tempDir = path.join(__dirname, "videos");

  const imageIds = [];
  try {
    await b2.authorize();

    const bucketId = '066fb37cd79d39188b900d1d';

    const files = fs.readdirSync(tempDir);
    for (const file of files) {
      const fileData = fs.readFileSync(path.join(tempDir, file));
      const uploadFileName = path.join(file);
      const uploadUrl = await b2.getUploadUrl(bucketId);
      const response = await b2.uploadFile({
        uploadUrl: uploadUrl.data.uploadUrl,
        uploadAuthToken: uploadUrl.data.authorizationToken,
        filename: uploadFileName,
        data: fileData,
        mime: "video/mp4" || "	video/webm" || "video/x-m4v" || "video/quicktime", // replace with the appropriate MIME type for your files
      });
      console.log(response.data.fileId);
      imageIds.push(response.data.fileId);
    }

    console.log(imageIds);
    req.imageIds = imageIds;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
