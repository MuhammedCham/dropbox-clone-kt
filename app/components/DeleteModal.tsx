'use client'

import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { useAppStore } from "@/store/store"
import { useUser } from '@clerk/nextjs'
import { deleteObject, ref, } from "firebase/storage"
import { db, storage } from "@/firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { useToast } from "./ui/use-toast"


export function DeleteModal() {
    const { user } = useUser()
    const { toast } = useToast()
    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        fileId,
        setFileId,
      ] = useAppStore(state => [  
        state.isDeleteModalOpen,
        state.setIsDeleteModalOpen,
        state.fileId,
        state.setFileId,
      ])

      async function deleteFile() {
        if (!user || !fileId) return
        
        toast({
            variant: 'destructive',
            description:'Deteting file ...'
        })
        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`)

        try {
            deleteObject(fileRef)
              .then(async () => {
                 deleteDoc(doc(db, "users", user.id, "files", fileId))
                 .then(() => {
                   toast({
                    variant:'destructive',
                    description:'File deleted successfully'
                   })
                })
                })
            
        } catch (error) {
            console.log(error)
        }
           setIsDeleteModalOpen(false)
      }

  return (
    <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
            setIsDeleteModalOpen(isOpen)
        }}
        >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the file.
          </DialogDescription>
        </DialogHeader>
        <div className="flex py-3 space-x-2">
            <Button 
                size="sm"
                className="px-3 flex-1"
                variant={"ghost"}
                onClick={() => setIsDeleteModalOpen(false)}
                >
                    <span className="sr-only">cancel</span>
                    <span>cancel</span>
                </Button>

                <Button className="py-3 flex-1"
                            type="submit"
                            size="sm"
                            variant={"destructive"}
                            onClick={() => deleteFile()} 
                              >
                    <span className="sr-only">Delete</span>
                    <span>Delete</span>
                </Button>
        </div>
        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
