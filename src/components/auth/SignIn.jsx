import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

export default function SignIn() {
  const { user } = useUser();

  useEffect(() => {
    const updateUserInfo = async () => {
      if (user) {
        try {
          await axios.post(`https://localhost:7261/api/users/${user.id}`, {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress,
            imageUrl: user.imageUrl
          });
          console.log('User information updated successfully');
        } catch (error) {
          console.error('Error updating user information:', error);
        }
      }
    };

    updateUserInfo();
  }, [user]);

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