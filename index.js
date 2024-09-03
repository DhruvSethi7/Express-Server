const express = require('express');
const cors = require('cors'); // Import the cors package
const { Connection, Keypair,clusterApiUrl, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const app = express();
app.use(cors()); // Use cors middleware to enable CORS
app.use(express.json());

const connection = new Connection(clusterApiUrl('mainnet-beta')); // Replace with your API key

app.post('/send-sol', async (req, res) => {
    try {
        const { recipientAddress, amount, senderSecretKey } = req.body;
        console.log(recipientAddress,amount,senderSecretKey);
        const secretKeyArray = new Uint8Array(Object.values(senderSecretKey));
        const senderKeypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
        console.log(senderKeypair);
        
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderKeypair.publicKey,
                toPubkey: new PublicKey(recipientAddress),
                lamports: Math.floor(amount * LAMPORTS_PER_SOL),
            })
        );

        const signature = await connection.sendTransaction(transaction, [senderKeypair]);
        await connection.confirmTransaction(signature);

        res.json({ success: true, signature });
    } catch (error) {
        console.error('Error sending SOL:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/',(req,res)=>{
    res.send("<p>Home page</p>")
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
