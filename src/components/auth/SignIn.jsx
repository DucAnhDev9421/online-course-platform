import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";
import { useUserInfo } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { user } = useUser();
  const { setUserInfo } = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignIn = async () => {
      if (user) {
        try {
          const response = await axios.get(`https://localhost:7261/api/users/${user.id}`);
          setUserInfo(response.data);
          navigate('/'); // Redirect to home page after successful sign in
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      }
    };

    handleSignIn();
  }, [user, setUserInfo, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <ClerkSignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
            },
          }}
          routing="path"
          path="/login"
          signUpUrl="/register"
        />
      </div>
    </div>
  );
} 