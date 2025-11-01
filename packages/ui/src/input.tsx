"use client"

import { RefObject } from "react"

interface inputProps {
    type : string
    reference?: RefObject<HTMLInputElement>
    placeholder : string,
    text? : string,
    classname? : string

}


export const Input = ({reference, placeholder, type, classname} : inputProps) => {
    return <input className={classname}
    type={type} placeholder={placeholder} ref={reference}  />
}

