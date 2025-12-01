import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export class AuthService {
    static async register(userData: any) {
        const { email, password, name, role } = userData;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'EMPLOYEE'
            }
        });

        const token = this.generateToken(user);

        return { token, user };
    }

    static async login(credentials: any) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);

        return { token, user };
    }

    static async getEmployees() {
        return prisma.user.findMany({
            where: { role: 'EMPLOYEE' },
            select: { id: true, name: true, email: true }
        });
    }

    private static generateToken(user: any) {
        return jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1d' }
        );
    }
}
