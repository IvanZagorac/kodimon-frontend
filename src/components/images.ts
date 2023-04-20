import React from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../config/firebase";

export const setImageURL=async(setImgURL:any,photoURL:string)=>{
    try{
        const imageRef=ref(storage,photoURL);
        const url=await getDownloadURL(imageRef)
        setImgURL(url);
    }catch(err){
        console.error(err)
    }


}
