import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return Response.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, email } = await request.json();

        if (!name || !email) {
            return Response.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        return Response.json({ user }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return Response.json({ error: 'Failed to create user' }, { status: 500 });
    }
} 