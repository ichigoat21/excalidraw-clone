"use client"


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import { useRef } from "react"
import axios from "axios"
import { HTTP_BACKEND } from "../config"
import { useRouter } from "next/navigation"

interface loginProps {
    isSignin : boolean
}


export default function Login({isSignin} : loginProps) {
  const usernameRef = useRef<HTMLInputElement | null>(null)
  const passwordRef =  useRef<HTMLInputElement | null>(null)
  const emailRef =  useRef<HTMLInputElement | null>(null)
  const router = useRouter()



  async function authHandler(){
  
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    const email = emailRef.current?.value

    if(!isSignin){
      const response = axios.post(`${HTTP_BACKEND}/users/signup`, {
        username,
        password,
        email
      })
      const user = (await response).data.userId
      router.push("/signin")
    } else {
      const response = axios.post(`${HTTP_BACKEND}/users/signin`, {
        email : email,
        password : password,
        username : username
      })
      const token = (await response).data.token
      localStorage.setItem("token", token)
      router.push("/dashboard")

    }
  }
    return (
      <div className="bg-gradient-to-t from-zinc-900 to-zinc-100 h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md w-full max-w-sm">
          
          <div className="grid w-full gap-4">
            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input ref={usernameRef} id="username" />
            </div>
  
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input ref={passwordRef} id="password" type="password" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">email</Label>
              <Input ref={emailRef} id="email" type="email" />
            </div>
          </div>
  
          <Button onClick={authHandler} className="w-full">{isSignin ? "Sign In" : "SignUp"}</Button>
        </div>
      </div>
    );
  }
  