import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import  { prismaClient }  from "@repo/prisma/client";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
import cors from "cors";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
app.use(cors()); 
app.use(express.json());
const port = process.env.PORT;
console.log(port)

app.post("/signup", async (req: Request, res: Response) => {

    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(401).json({
            message: "Validation Error"
        })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prismaClient.user.findFirst({
        where: {
            username: username
        }
    })

    if(existingUser){
        res.status(409).json({
            message: "User already exist"
        })
        return
    }

    const user = await prismaClient.user.create({
        data: {
            username,
            password: hashedPassword
        }
    })

    const token = jwt.sign( {userId: user.id} , JWT_SECRET!)
    res.status(201).json({
        userId: user.id,
        token
    })
    
})
app.post("/signin", async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(401).json({
            message: "Validation Error"
        })
        return
    }

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    })

    if(!user){
        res.status(404).json({
            message: "User not exist"
        })
        return
    }

    const isValidUser = await bcrypt.compare(password, user?.password!);

    if(!isValidUser){
        res.status(401).json({
            message: "Incorrect Password"
        })
    }

    const token = jwt.sign({userId: user.id}, JWT_SECRET!)

    res.json({
        token
    })
})
interface CreateDocumentBody {
    title: string;
    userId: string;
  }
app.post('/documents', authMiddleware, async (req: Request<{}, {}, CreateDocumentBody>, res: Response) => {
    const { title } = req.body;

    const userId = req.userId!;

    
    if (!title || title.trim().length === 0) {
        res.status(400).json({ error: 'Title is required' });
        return
      }
  
      const titleWords = title.toLowerCase().trim().split(/\s+/);
      const baseSlug = titleWords.join('-');
      let slug = baseSlug;
      let counter = 1;
      console.log("Inside /documents route before while")
      while (true) {
        const existing = await prismaClient.document.findUnique({
          where: { slug }
        });
        
        if (!existing) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      console.log("Inside /documents route after while")
      console.log("UserId", userId);
    const document = await prismaClient.document.create({
      data: {
        title: title.trim(),
        content: '',
        slug,
        userId,
        lastUpdatedId: 0
      }
    });
    res.json(document);
  });
  
//   app.get('/documents/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
//     const document = await prismaClient.document.findUnique({
//       where: { id: req.params.id },
//       include: { user: true }
//     });
//     res.json(document);
//   });

  app.get('/documents/:slug', authMiddleware, async (req: Request<{ slug: string }>, res: Response) => {
    const slug = req.params.slug;
    const document = await prismaClient.document.findUnique({
      where: { slug: slug }
    });
    console.log(document);
    res.json(document);
  });

  app.get('/documents', authMiddleware, async (req: Request, res: Response) => {
   
    const userId = req.userId;
    const AllDocument = await prismaClient.document.findMany({
        where: {
            userId: userId
        }
    });
    res.json(AllDocument);
  });

app.listen(port, ()=> {
    console.log(`Server is running on ${port}`)
})