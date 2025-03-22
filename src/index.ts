import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
app.use(express.json());

app.post('/process-video', (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath) {
        res.status(400).send("Bad request: missing input file path");
    }

    if (!outputFilePath) {
        res.status(400).send("Bad request: missing output file path");
    }

    // Process the video with ffmpeg
    ffmpeg(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360')
        .on('end', function() {
            console.log('Processing completed');
            res.status(200).send('Processing completed');
        })
        .on('error', function(err) {
            console.error('Error: ' + err.message);
            res.status(500).send('Error: ' + err.message);
        })
        .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});