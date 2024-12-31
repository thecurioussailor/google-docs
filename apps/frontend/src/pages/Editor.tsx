import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

interface DocType {
    id: string,
    title: string,
    content: string
}
const Editor = () => {

    const { slug, id } = useParams<{slug: string, id: string}>();
    const [doc, setDoc] = useState<DocType>();
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [content, setContent] = useState('');
    const [lastUpdatedId, setLastUpdatedId] = useState(0);

    

    useEffect(() => {
        const getSingleDocument = async () => {
            const response = await axios.get(`http://localhost:3000/documents/${slug}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const document = response.data;
            setDoc(document)
            setContent(document.content);
            setLastUpdatedId(document.lastUpdatedId);
        }

        getSingleDocument();
    }, [slug])

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001');
        setWs(socket);
    
        socket.onopen = () => {
          socket.send(JSON.stringify({ type: 'join', documentId: id }));
        };
    
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.lastUpdatedId > lastUpdatedId) {
            setContent(data.content);
            setLastUpdatedId(data.lastUpdatedId);
          }
        };
    
        return () => socket.close();
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        
        ws?.send(JSON.stringify({
          type: 'change',
          documentId: doc?.id,
          content: content 
        }));
      };

  return (
    <div className="flex flex-col text-gray-800 px-72 py-20 h-[calc(100vh-80px)]">
        <h1 className="px-4">{doc?.title}</h1>
        <div className="flex flex-col w-full h-full p-4">
            <textarea
                value={content}
                onChange={handleChange}
                className="w-full h-full resize-none p-4 border outline-none rounded-lg"
            />
            <button className="border bg-gray-900 text-white rounded-lg w-20 px-4 py-2 mt-4">SAVE</button>
        </div>
    </div>
  )
}

export default Editor