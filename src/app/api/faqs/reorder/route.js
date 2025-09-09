
import _db from "@/utils/db";
import FaqModel from "@/models/faq.model";
import { NextResponse } from "next/server";

export async function POST(request) {
    await _db();
    const { orderedIds } = await request.json();

    if (!Array.isArray(orderedIds)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    try {
        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order: index } },
            },
        }));
        
        if (bulkOps.length > 0) {
            await FaqModel.bulkWrite(bulkOps);
        }

        return NextResponse.json({ message: 'Reorder successful' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reorder FAQs', details: error.message }, { status: 500 });
    }
}
