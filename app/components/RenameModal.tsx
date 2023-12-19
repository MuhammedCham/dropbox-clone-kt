'use client'

import { useAppStore } from '@/store/store'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from './ui/use-toast'
import { Description } from '@radix-ui/react-toast'

function RenameModal() {
    const { user } = useUser()
    const [input, setInput] = useState("")

    const [isRenameModalOpen, setIsRenameModalOpen, fileId, filename] = 
    useAppStore((state) => [
        state.isRenameModalOpen,
        state.setIsRenameModalOpen,
        state.fileId,
        state.filename,
    ])

    const renameFile = async () => {
        if(!user || !fileId) return

        toast({
            description: "renaming the file..."
        })
        await updateDoc(doc(db, "users", user.id, "files", fileId), {
            fileName: input
        })
        setInput('')
        setIsRenameModalOpen(false)
        toast({
            description: "File renamed successfully"
        })
    }    
  return (
    <Dialog 
        open={isRenameModalOpen}
        onOpenChange={(isOpen) => {
            setIsRenameModalOpen(isOpen)
        }}
        >
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
                <Input
                    id="link"
                    defaultValue={filename}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDownCapture={(e) => {
                        if (e.key === "Enter")
                        renameFile()
                    }}
                />
          <div className="flex justify-end py-3 space-x-2">
            <Button
                size='sm'
                variant={'ghost'}
                className='px-2'
                onClick={()=>setIsRenameModalOpen(false)}

            >
                <span className="sr-only">Cancel</span>
                <span>Cancel</span>
            </Button>
            <Button
                type='submit'
                size='sm'
                className='px-2'
                onClick={() => renameFile()}
                >
                <span className="sr-only">Rename</span>
                <span>Rename</span>
            </Button>
          </div>
          </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default RenameModal