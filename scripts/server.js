const express = require('express')
const app = express()
const port = 3000
const { spawn } = require('child_process');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.post('/api/generate_dress', function (req, res) {
    const query = req.body.query
    const pythonProcess = spawn('python', ['./scripts/promt_to_params.py', '--description', query]);
    pythonProcess.stdout.on('data', (path) => {
        let pathString = path.toString().replace(/\n/g, "");
        fs.readFile(pathString, (err, data) => {
            if (err) {
                // Handle the error
                console.error(err);
                res.status(500).send('Error reading file');
            } else {
                // Send the file contents in the response
                res.send(data);
            }
        });
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

});