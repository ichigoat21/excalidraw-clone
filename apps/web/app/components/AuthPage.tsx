import { Button } from "@repo/ui/button"
import {Input} from "@repo/ui/input"

const InputStyle = " px-4 py-3 rounded-xl bg-blue-50 text-gray-900 placeholder-gray-400 shadow-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition";
const ButtonStyle = " w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center shadow-md hover:bg-blue-700 active:bg-blue-800 transition transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300";


export default function AuthPage({isSignin} : {
    isSignin : boolean
}){
    return <div className="bg-blue-200 h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
            <Input classname={InputStyle} placeholder= "username" type="text"/>
            <Input classname={InputStyle}  placeholder= 'password' type="text"/>
            </div>
            <div>
            <Button className={ButtonStyle} isSignin ={isSignin}>{isSignin ? "Sign Up" : "Sign In"}</Button>
            </div>
        </div>
    </div>
}