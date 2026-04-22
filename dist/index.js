"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storage_1 = require("./storage");
const firestore_1 = require("./firestore");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/process-video', async (req, res) => {
    let data;
    try {
        const msg = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(msg);
        if (!data.name) {
            throw new Error('Invalid msg payloads received.');
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send('Bad request: missing filename');
        return;
    }
    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];
    if (!await (0, firestore_1.isVideoNew)(videoId)) {
        res.status(400).send('Bad request: video already processing or processed');
        return;
    }
    else {
        await (0, firestore_1.setVideo)(videoId, {
            id: videoId,
            uid: videoId.split("-")[0],
            status: "processing"
        });
    }
    await (0, storage_1.setUpDirectories)();
    // Download raw vid from cloud storage
    await (0, storage_1.downloadRawVideo)(inputFileName);
    // Process the vid into 360p
    try {
        await (0, storage_1.convertVideo)(inputFileName, outputFileName);
    }
    catch (err) {
        await Promise.all([
            (0, storage_1.deleteRawVideo)(inputFileName),
            (0, storage_1.deleteProcessedVideo)(outputFileName)
        ]);
        res.status(500).send('Processing failed');
        return;
    }
    // Uplaod the processed video to cloud storage
    await (0, storage_1.uploadProcessedVideo)(outputFileName);
    await (0, firestore_1.setVideo)(videoId, {
        status: "processed",
        filename: outputFileName
    });
    await Promise.all([
        (0, storage_1.deleteRawVideo)(inputFileName),
        (0, storage_1.deleteProcessedVideo)(outputFileName)
    ]);
    res.status(200).send('Processing finished successfully');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
