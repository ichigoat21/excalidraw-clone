import { Button } from "./button";
import { InputBox } from "./input";


interface authProps {
    isSignin : boolean
}

export default function AuthPage(props : authProps) {
    return (<div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-black">{props.isSignin ? "Signin" : "SignUp"}"</h2>
          <p className="text-sm text-gray-600">Enter your information to {props.isSignin ? "Log in to your" : "Create an"} account</p>
        </div>

        <div className="space-y-4 flex flex-col justify-center">
          <InputBox placeholder="John Doe" text="Username" />
          <InputBox placeholder="********" text="Password" />
          <div className="flex justify-center items-center mt-4">
          <Button text= {props.isSignin ? "Sign In" : "Sign Up"} />
          </div>
        </div>
 
        <div className="mt-4 text-sm text-center text-gray-700">
         {props.isSignin ?  "Dont have an account?" : "Already have an account"} 
         <span className="cursor-pointer">
            {props.isSignin ? "Sign In" : "Sign Up"}
         </span> :  
        </div>
      </div>
    </div>
  );
}