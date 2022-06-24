import axios from 'axios';
import { useEffect } from 'react';

const href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=user&redirect_uri=http://localhost:3000`;

function GithubAuthComponent() {
  useEffect(() => {
    const abortController = new AbortController();
    const sendToken = async () => {
      const code = window.location.href.split('code=')[1];

      if (code) {
        try {
          const { data } = await axios.post(
            '/login/github',
            { code },
            { signal: abortController.signal }
          );

          console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    sendToken();

    return () => abortController.abort();
  }, []);

  return (
    <div>
      <a href={href}>Login with GitHub</a>
    </div>
  );
}

export default GithubAuthComponent;
