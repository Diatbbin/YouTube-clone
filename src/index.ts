import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { 
    convertVideo, 
    downloadRawVideo, 
    setUpDirectories, 
    deleteRawVideo,
    deleteProcessedVideo, 
    uploadProcessedVideo
} from './storage';

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
        res.status(400).send('Bad request: missing filename')
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    await setUpDirectories();
    
    // Download raw vid from cloud storage
    await downloadRawVideo(inputFileName)

    // Process the vid into 360p
    try {
        await convertVideo(inputFileName, outputFileName)
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ])
        res.status(500).send('Processing failed')
    }

    // Uplaod the processed video to cloud storage
    await uploadProcessedVideo(outputFileName)

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ])

    res.status(200).send('Processing finished successfully')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});