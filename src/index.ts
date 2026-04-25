import express from 'express';
import { 
    convertVideo, 
    downloadRawVideo, 
    setUpDirectories, 
    deleteRawVideo,
    deleteProcessedVideo, 
    uploadProcessedVideo
} from './storage';
import { isVideoNew, setVideo } from './firestore';

const app = express();
app.use(express.json());

app.post('/process-video', async (req, res) => {
    let data;
    try {
        const msg = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(msg)
        if (!data.name) {
            throw new Error('Invalid msg payloads received.')
        }
    } catch (error) {
        console.error(error)
        res.status(400).send('Bad request: invalid payload received')
        return 
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    const isNew = await isVideoNew(videoId);

    if (!isNew) {
        res.status(200).send('Video already processing, processed or retry limit reached');
        return 
    } 

    try {
        await setUpDirectories();
        await downloadRawVideo(inputFileName)
        await convertVideo(inputFileName, outputFileName)
        await uploadProcessedVideo(outputFileName)
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ])

        await setVideo(videoId, {
            status: "failed",
            lastStatusUpdateTime: Date.now(),
            error: err instanceof Error ? err.message : String(err)
        })

        res.status(500).send('Processing failed')
        return 
    }

    await setVideo(videoId, {
        status: "processed",
        filename: outputFileName,
        lastStatusUpdateTime: Date.now(),
    })

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ])

    res.status(200).send('Processing finished successfully')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})