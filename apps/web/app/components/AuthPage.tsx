export default function AuthPage({isSignin} : {
    isSignin : boolean
}){
    return <div className="bg-blue-200 h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col">
            <input type="text" placeholder="username" />
            <input type="text" placeholder="password" />
            <button>{isSignin ? "Sign Up" : "Sign In"}</button>
        </div>
    </div>
}