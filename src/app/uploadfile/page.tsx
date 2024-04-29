"use client"
import React, { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '@/firebase';

const  Page = () => {
    const [file,setFile] = useState<any>(null)

    const handleSubmit = (e:React.SyntheticEvent)=>{
        e.preventDefault()
   

const storageRef = ref(storage,file.name);

const uploadTask = uploadBytesResumable(storageRef, file);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
);
        
    }


  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>)=> {
    // const files= e.target.files[0].name as string
    // console.log( files)

    const file = e.target.files ? e.target.files[0]  : null
    setFile(file?.lastModified)
    // if (!file?.includes(".png")) {
    //     alert("not supported file")
    // }
    // console.log(file);


    
    
  }

console.log(file);

  return (
    <div>
        <h1>Upload file</h1>

        <form onSubmit={handleSubmit}>
            <label htmlFor="file">upload file</label>
<input type="file" id='file' onChange={handleFileSelected}/>

<button type='submit' >submit</button>

        </form>
    </div>
  )
}

export default Page
