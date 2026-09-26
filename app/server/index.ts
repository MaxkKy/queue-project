import express, { Request, Response } from "express";
import { prisma } from "@/lib/prisma"
import z from "zod";
import argon2 from "argon2";
import cookieparser from "cookie-parser";
import jwt from "jsonwebtoken";
import "dotenv/config";
const app = express();
const cors = require("cors");
const port = process.env.PORT!;
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieparser());
app.use(express.json());
const adminsecret = process.env.ADMIN_JWT_SECRET!;
const secret = process.env.JWT_SECRET!;
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { gmail, password } = req.body;
    const userData = await prisma.user.findUnique({ where: { gmail: gmail } });
    if (!userData) {
      return res.status(401).json({
        message: "Error Fail(worng Gmail)",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const match = await argon2.verify(userData.password, password);
    if (!match) {
      return res.status(400).json("Error Fail(worng Password)");
    }
    const token = jwt.sign({ gmail }, secret, { expiresIn: "1h" });
    res.cookie(`token`, token, {
      maxAge: 3600000,
      // secure: process.env.NODE_ENV === "production",
      // httpOnly: true,
      // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    return res.status(201).json({ message: "Login Success" });
  } catch {
    return res.status(500).json({ message: "Server Error" });
  }
});
app.post("/user", async (req: Request, res: Response) => {
  try {
    const { username, gmail, password } = req.body;
    const hashPassword = await argon2.hash(password);
    const post = await prisma.user.create({
      data: { username, password: hashPassword, gmail },
    });
    return res.json({ message: "Post Success", post: post });
  } catch {
    return res.status(500).json({ message: "Server Error" });
  }
});
app.get("/user", async (req: Request, res: Response) => {
  try {
    const authToken = req.cookies.token;
    if (!authToken) {
      return res.status(401).json({
        message: "ยังไม่ได้ login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checkUser = tokenSchema.parse(jwt.verify(authToken, secret));
    const user = await prisma.user.findUnique({
      where: { gmail: checkUser.gmail },
    });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});
app.get("/posts", async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || '';
    const sort = (req.query.sort as 'desc');
    
    const authtoken = req.cookies.token;
    if (!authtoken) { 
      return res.status(401).json({
        message: "ยังไม่ได้ login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const authSchema = z.object({ gmail: z.string().email() });
    const checkUser = authSchema.parse(jwt.verify(authtoken, secret));
    const user = await prisma.user.findUnique({
      where: { gmail: checkUser.gmail },
    });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const posts = await prisma.post.findMany({
      where:{
        item:{
          some:{
            menu:{
              name:{
                contains:search
              }
            }
          }
        }
      },orderBy:{
        createdAt:sort,
      },
      select: {
        id: true,
        details: true,
        createdAt: true,
        status: true,
        updateAt: true,
        item: {
          select: {
            quantity:true,
            menu: { select: { id: true, name: true, price: true } },
          },
        },
      },
    });
    return res.json(posts);
  } catch {
    return res.status(500).json({ message: "Server Error" });
  }
});
app.post("/posts", async (req: Request, res: Response) => {
  try {
    const { details, item } = req.body;
    const authToken = req.cookies.token;
    if (!authToken) {
      return res.status(401).json({
        message: "ยังไม่ได้ Login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checkUser = tokenSchema.parse(jwt.verify(authToken, secret));
    const user = await prisma.user.findUnique({
      where: { gmail: checkUser.gmail },
    });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    if (!Array.isArray(item) || item.length === 0) {
      return res.status(400).json({ message: "สั่งอย่างน้อย 1 รายการ" });
    }
    const menuitem = [];
    for (const i of item) {
      menuitem.push({
        menuId: Number(i.menuId),
        quantity: Number(i.quantity ?? 1),
      });
    }
    const posts = await prisma.post.create({
      data: {
        details,
        status: "WAITING",
        user: { connect: { id: user?.id } },
        item: { create: menuitem },
      },
    });
    return res.status(201).json({ posts, message: "Post Success" });
  } catch {
    return res.status(500).json({ message: "Server Error" });
  }
});
app.put("/posts/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const numId = Number(id);
    const { status } = req.body;
    const post = await prisma.post.findUnique({ where: { id: numId } });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }
    const updatePost = await prisma.post.update({
      where: { id: numId },
      data: { status: status },
    });
    return res.status(200).json({message:"Update Success",updatePost})
  } catch {
    return res.status(500).json({ message: "Server not Found" });
  }
});
app.delete("/posts/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const NumId = Number(id);
    await prisma.post.delete({ where: { id: NumId } });
    res.json({ message: "delete Success" });
  } catch {
    return res.status(500).json({ message: "Server not Found" });
  }
});
app.get("/menus", async (req: Request, res: Response) => {
  try {
    const authToken = req.cookies.token;
    if (!authToken) {
      return res.status(401).json({
        message: "ยังไม่ได้ Login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checkUser = tokenSchema.parse(jwt.verify(authToken, secret));
    const user = await prisma.user.findUnique({
      where: { gmail: checkUser.gmail },
    });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const menu = await prisma.menu.findMany({
      select: { id: true, name: true, price: true },
    });
    return res.json(menu);
  } catch {
    return res.status(500).json({ message: "Server not Found" });
  }
});
app.post("/menus", async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const authToken = req.cookies.token;
    if (!authToken) {
      return res.status(401).json({
        message: "ยังไม่ได้ Login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checktoken = tokenSchema.parse(jwt.verify(authToken, adminsecret));
    const user = await prisma.admin.findUnique({
      where: { gmail: checktoken.gmail },
    });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    await prisma.menu.create({
      data: { name, price },
    });
  } catch {
    res.status(500).json({ message: "Server not Found" });
  }
});
app.post("/admin", async (req: Request, res: Response) => {
  try {
    const { username, gmail, password, role } = req.body;
    const hashPassword = await argon2.hash(password);
    await prisma.admin.create({
      data: { username, gmail, password: hashPassword, role },
    });
    return res.status(201).json({ message: "Post Success" });
  } catch {
    res.status(500).json({ message: "Server not Found" });
  }
});
app.get("/admin", async (req: Request, res: Response) => {
  try {
    const authToken = req.cookies.token;
    if (!authToken) {
      return res.status(401).json({
        message: "ยังไม่ได้ login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checkUser = tokenSchema.parse(jwt.verify(authToken, adminsecret));
    const admin = await prisma.admin.findUnique({
      where: { gmail: checkUser.gmail },
    });
    if (!admin) {
      return res.status(404).json({ message: "User not Found" });
    }
    return res.json(admin);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});
app.post("/admin/login", async (req: Request, res: Response) => {
  try {
    const { gmail, password } = req.body;
    const userData = await prisma.admin.findUnique({ where: { gmail: gmail } });
    if (!userData) {
      return res.status(401).json({
        message: "Error Fail(worng Gmail)",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const match = await argon2.verify(userData.password, password);
    if (!match) {
      return res.status(400).json({ message: "Error Fail(worng Password)" });
    }
    const token = jwt.sign({ gmail }, adminsecret, { expiresIn: "1h" });
    res.cookie(`token`, token, {
      maxAge: 30000,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    return res.status(201).json({ message: "Login Success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server not Found" });
  }
});
app.get("/users", async (req: Request, res: Response) => {
  try {
    const authToken = req.cookies.token;
    if (!authToken) {
      return res.status(401).json({
        message: "ยังไม่ได้ login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checkAdmin = tokenSchema.parse(jwt.verify(authToken, adminsecret));
    const admin = await prisma.admin.findUnique({
      where: { gmail: checkAdmin.gmail },
    });
    if (!admin) {
      return res.status(404).json({ message: "User not Found" });
    }
    const user = await prisma.user.findMany({
      select: {
        id:true,
        username: true,
        gmail: true,
        post: {
          select: {
            id:true,
            status: true,
            details: true,
            createdAt: true,
            updateAt: true,
            item: {
              select: {
                quantity: true,
                menu: { select: { id:true,name: true, price: true } },
              },
            },
          },
        },
      },
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});
app.put("/menus/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const useId = Number(id);
    const { name, price } = req.body;
    const authToken = req.cookies.token;
    if (!authToken) {
      return res.status(401).json({
        message: "ยังไม่ได้ Login",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }
    const tokenSchema = z.object({ gmail: z.string().email() });
    const checkUser = tokenSchema.parse(jwt.verify(authToken, secret));
    const user = await prisma.user.findUnique({
      where: { gmail: checkUser.gmail },
    });
    if (!user) {
      res.status(404).json({ message: "User not Found" });
    }
    await prisma.menu.update({ where: { id: useId }, data: { name, price } });
    return res.json({ message: "Update Success" });
  } catch {
    res.status(500).json({ message: "Server not Found" });
  }
});
app.post("/logout", async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    return res.json({ message: "Log Out Success" });
  } catch {
    return res.status(500).json({ message: "Server not Found" });
  }
});
app.listen(port, () => {
  console.log("http server is running at " + port);
});
