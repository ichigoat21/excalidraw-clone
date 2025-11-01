import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Label} from "@/components/ui/label"


export default function Login() {
    return (
      <div className="bg-gradient-to-t from-zinc-900 to-zinc-100 h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md w-full max-w-sm">
          
          <div className="grid w-full gap-4">
            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" />
            </div>
  
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </div>
  
          <Button className="w-full">Sign In</Button>
        </div>
      </div>
    );
  }
  