'use client'

import DropzoneComponent from 'react-dropzone'
import { cn } from './lib/utils'
import { read } from 'fs'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { toast, useToast } from './ui/use-toast'


function Dropzone() {
    const [isLoading, setIsLoading] = useState(false)
    const { isLoaded, isSignedIn, user } = useUser()
    const { toast } = useToast()

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log("mission aborted")
            reader.onerror = () => console.log("an error occured, file reading failed")
            reader.onload = async () => {
                await uploadPost(file)
            }
            reader.readAsArrayBuffer(file)
        })
    }

    const uploadPost = async (selectedFile:File) => {
        if (isLoading) return
        if (!user) return

        setIsLoading(true)
        toast({
            description: 'Uploading---'
        })

        // addDoc => user/userID/file
        const docRef = await addDoc(collection(db, "users", user.id, "files"), {
            userId: user.id,
            fileName: selectedFile.name,
            fullName: user.fullName,
            profileImg: user.imageUrl,
            timeStamp: serverTimestamp(),
            type: selectedFile.type,
            size: selectedFile.size,
        })

        const imgRef =  ref(storage, `users/${user.id}/files/${docRef.id}`)

        uploadBytes(imgRef, selectedFile).then(async (snapshot) => {
            const downloadUrl = await getDownloadURL(imgRef)

            await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
                downloadUrl: downloadUrl
            })
        })

        setIsLoading(false)
        toast({
            description: 'Uploaded'
        })
    }

    const maxsize = 20971520 //allow 20mb
   
  return (
    <DropzoneComponent minSize={0} maxSize={maxsize} onDrop={onDrop}>
    {({
        getRootProps, 
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
    }) => {
        const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxsize
        return (
    <section className='m-4'>
      <div {...getRootProps()}
            className={cn(
                "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                isDragActive ? "bg-[#035ffe] text-white animate-pulse" : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
            )}
      >
        <input {...getInputProps()} />
        {!isDragActive && "Click here or drag a file to upload!"}
        {isDragActive && !isDragReject && "Drop to upload this file"}
        {isDragReject && "Sorry, file type not accepted"}
        {isFileTooLarge && (
            <div className="text-danger mt-2">File is too large</div>
        )}
      </div>
    </section>
)}}
</DropzoneComponent>
  )
}

export default Dropzone