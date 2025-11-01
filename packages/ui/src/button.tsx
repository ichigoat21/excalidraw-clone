"use client";


interface ButtonProps {
  className?: string;
  appName?: string;
  isSignin : boolean,
  children?: React.ReactNode; 
}




export const Button = ({ className, appName, isSignin }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {isSignin ? "Sign in" : "Signup" }
    </button>
  );
};
