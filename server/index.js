import express from 'express';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

const {
  env: { CLIENT_ID },
} = process;

const app = express();
const client = new OAuth2Client(CLIENT_ID);

app.use(express.json());
app.set('port', 5000);

app.post('/login/google', async (req, res) => {
  const { tokenId } = req.body;

  const verify = async () => {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
  };

  try {
    await verify();
  } catch (err) {
    console.log(err);
  }

  const { data: userInfo } = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`
  );

  res.json({ data: userInfo });
});

app.listen(app.get('port'), () =>
  console.log(`http://localhost:${app.get('port')}`)
);
