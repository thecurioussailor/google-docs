import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface DocType {
    id: string,
    title: string,
    content: string,
    slug: string,
    userId: string
}
const AllDocs = () => {
    const [docs, setDocs] = useState<DocType[]>();
    useEffect(() => {
        const getAllDocs = async () => {
            const response = await axios.get("http://localhost:3000/documents", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDocs(response.data)
            
        }
        getAllDocs();
    }, [])
  return (
    <div className="flex text-gray-800 px-72 py-20 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
            {docs?.map(doc => (
                <DocumentCard key={doc.id} id={doc.id} title={doc.title} content={doc.content} slug={doc.slug}/>
            ))}
                
        </div>
    </div>
  )
}

const DocumentCard = ({id, title, content, slug}: {id: string, slug: string, content: string, title: string}) => {
    return (
        <div>
            <Link to={`/document/${slug}/${id}`} className="block max-w-sm p-6 bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
                <p className="font-normal text-gray-700">
                    {content.slice(0,100)}
                </p>
            </Link>
        </div>
    )
}

export default AllDocs