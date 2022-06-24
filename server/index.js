import express from 'express';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const {
  env: { GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET },
} = process;

const app = express();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(express.json());
app.set('port', 5000);

app.post('/login/google', async (req, res) => {
  const { tokenId } = req.body;

  const verify = async () => {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
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

app.post('/login/github', async (req, res) => {
  const { code } = req.body;
  const url = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=http://localhost:3000`;

  try {
    const {
      data: { access_token },
    } = await axios({
      method: 'POST',
      url: url,
      headers: {
        accept: 'application/json',
      },
    });
    console.log(access_token);
    const { data: userInfo } = await axios({
      method: 'GET',
      url: 'https://api.github.com/user',
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    res.json({ data: userInfo });
  } catch (err) {
    console.log(err);
  }
});

app.listen(app.get('port'), () =>
  console.log(`http://localhost:${app.get('port')}`)
);
