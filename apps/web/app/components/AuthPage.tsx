"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";   
import { useRef, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";

interface loginProps {
  isSignin: boolean;
}

export default function Login({ isSignin }: loginProps) {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const [error, setError] = useState("");

  async function authHandler() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const username = usernameRef.current?.value;
  
    try {
      if (!isSignin) {
        await axios.post(`${HTTP_BACKEND}/users/signup`, {
          email,
          password,
          username,
        });
        router.push("/signin");
      } else {
        const response = await axios.post(`${HTTP_BACKEND}/users/signin`, {
          email,
          password,
        });
  
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }
  

  

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 bg-gradient-to-t from-zinc-900 to-zinc-100">
      <div className="flex flex-col gap-4 p-6 md:p-8 bg-white rounded-xl shadow-md w-full max-w-sm sm:max-w-md">
        
      <div className="grid gap-4">


        <div className="grid gap-1">
           <Label htmlFor="email">Email</Label>
           <Input ref={emailRef} id="email" type="email" />
        </div>


        <div className="grid gap-1">
          <Label htmlFor="password">Password</Label>
          <Input ref={passwordRef} id="password" type="password" />
        </div>


        {!isSignin && (
               <div className="grid gap-1">
                 <Label htmlFor="username">Username</Label>
                 <Input ref={usernameRef} id="username" />
               </div>
               )}

      </div>

               

        <Button onClick={authHandler} className="w-full mt-2">
          {isSignin ? "Sign In" : "Sign Up"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
