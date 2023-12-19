import { auth } from "@clerk/nextjs"
import Dropzone from "../components/Dropzone"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { FileType } from "@/typings"
import TableWrapper from "../components/tables/TableWrapper"


async function Dashboard() {
  const { userId } = auth()

  const docResult = await getDocs(collection(db, "users", userId!, "files"))
  const skeletonFiles: FileType[] = docResult.docs.map((doc) => (
    {
      id: doc.id,
      fileName: doc.data().fileName || doc.id,
      fullName: doc.data().fullName,
      timestamp: new Date(doc.data().timeStamp?.seconds * 1000) || undefined,
      downloadUrl: doc.data().downloadUrl,
      type:doc.data().type,
      size: doc.data().size,
    }
  ))

  //console.log(skeletonFiles)
  return (
    <div className="border-t">
      <Dropzone />
      <section className="container space-y-5">
        <h2 className="font-bold">All files</h2>
        <div className="">
          {/* Table wrapper */}
          <TableWrapper 
            skeletonFiles={skeletonFiles}
          />
        </div>
      </section>
    </div>
  )
}

export default Dashboard