const express = require('express');
const fileUpload = require('express-fileupload');
const { connectToBlockchain, mintDRC20Token } = require('./blockchain');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Middleware for file uploading
app.use(fileUpload());

// Endpoint to handle the inscription form submission
app.post('/mint', async (req, res) => {
    const { files, address } = req.body;
    if (!files || Object.keys(files).length === 0 || !address) {
        return res.status(400).send('No files were uploaded or address is missing.');
    }
    
    try {
        // Connect to blockchain
        await connectToBlockchain();
        
        // Mint DRC-20 token with the uploaded files
        const transactionHash = await mintDRC20Token(files, address);
        
        // Respond with the transaction hash
        res.send({ transactionHash });
    } catch (error) {
        console.error('Error minting DRC-20 token:', error);
        res.status(500).send('Error minting token');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// You'll need to implement the connectToBlockchain and mintDRC20Token functions
// based on the doginals protocol.
