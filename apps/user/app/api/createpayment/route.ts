import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_SECRET||"",
})

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();
        const orderData = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: 'receipt#1',
            // payment_capture: 1, // Auto capture payment
        });
        return NextResponse.json({
            success: true,
            data: orderData,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to create order',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}