import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

const TokenDisplay = () => {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const accessToken = await getToken();
        setToken(accessToken);
      }
    };

    fetchToken();
  }, [isSignedIn, getToken]);

  return (
    <div>
      <h2>Access Token:</h2>
      <textarea rows={10} cols={80} value={token} readOnly />
    </div>
  );
};

export default TokenDisplay;
