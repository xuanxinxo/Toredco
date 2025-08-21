import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
const registerSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z
        .string()
        .min(8)
        .max(72)
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    name: z.string().trim().min(2).max(50),
});
router.post('/register', async (req, res) => {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(422).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { email, password, name } = parse.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: 'Email đã tồn tại' });
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: { email, password: hash, name, createdAt: new Date() },
        select: { id: true, email: true, name: true, createdAt: true },
    });
    return res.status(201).json({ user });
});
router.post('/', async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email, role: 'user' }, JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
        success: true,
        data: { user: { id: user.id, email: user.email, name: user.name }, token },
        message: 'Login successful',
    });
});
export const authRouter = router;
