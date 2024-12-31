import { WebSocket, WebSocketServer } from "ws";
import { WSMessage } from "./types";
import  { prismaClient }  from "@repo/prisma/client";

const wss = new WebSocketServer({port: 3001})

const documentClients: Map<String, Set<WebSocket>> = new Map();

wss.on('connection', (ws: WebSocket) => {
    let slug: string;
    ws.on('message', async (data: Buffer) => {
        const message: WSMessage = JSON.parse(data.toString());
    
        switch (message.type) {
            case 'join': 
                if(message.slug) {
                    slug = message.slug;
                    if(!documentClients.has(slug)) {
                        documentClients.set(slug, new Set());
                    }
                    documentClients.get(slug)?.add(ws);
                }
                console.log("someonejoined")
                break;
            case 'change':
                
                if(!message.slug || !message.content){
                    return;
                }
                slug = message.slug
                await prismaClient.document.update({
                    where: {
                        slug: message.slug as string
                    },
                    data: {
                        content: message.content
                    }
                })

                documentClients.get(slug)?.forEach((client) => {
                    if(client !== ws && client.readyState === WebSocket.OPEN){
                        client.send(JSON.stringify({
                            type: "change",
                            content: message.content,
                            cursor: message.cursor
                        }))
                    }
                })
                console.log("send to everyone")
                break;
        }
    })
    ws.on('close', () => {
        if(slug && documentClients.has(slug)){
            documentClients.get(slug)?.delete(ws);
        }
    })
});

console.log('Websocket server is running on port 3001');