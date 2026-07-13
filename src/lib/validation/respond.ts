import { NextResponse } from "next/server";
import type { z } from "zod";

export function validationErrorResponse(error: z.ZodError) {
    return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 422 }
    );
}
