import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const response = await axios.get(`https://localhost:7261/api/users/${user.id}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  const value = {
    userInfo,
    setUserInfo,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserProvider');
  }
  return context;
} 