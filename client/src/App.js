import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: 'email',
      });
    };

    gapi.load('client:auth2', start);
  }, []);

  const onSuccess = async (res) => {
    const { tokenId } = res;

    try {
      const { data: userInfo } = await axios.post('/login/google', { tokenId });
      console.log(userInfo);
    } catch (err) {
      console.log(err);
    }
  };
  const onFailure = (res) => console.log(res);

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
      />
    </div>
  );
}

export default App;
