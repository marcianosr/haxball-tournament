import { NextRequest } from 'next/server';
import { generateFinalMatch } from '@/lib/services/tournament-service';

export async function POST() {
    try {
        const result = await generateFinalMatch();

        console.log("Generate final match result:", result);

        if (!result.success) {
            // Return a 400 Bad Request if the operation cannot be completed due to business rules
            return Response.json({
                success: false,
                error: result.message
            }, { status: 400 });
        }

        return Response.json(result);
    } catch (error) {
        console.error('Error generating final match:', error);
        const message = error instanceof Error ? error.message : 'Failed to generate final match';
        return Response.json({
            success: false,
            error: message
        }, { status: 500 });
    }
} 