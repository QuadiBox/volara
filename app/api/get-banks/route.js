import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: 'Paystack secret key is not configured.' },
      { status: 500 }
    );
  }

  try {
    // Fetch bank codes from Paystack
    const response = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    return NextResponse.json({
      success: true,
      banks: response.data.data,
    });
  } catch (error) {
    console.error('Error fetching banks:', error.message);

    return NextResponse.json(
      { success: false, message: 'Failed to fetch bank codes. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { message: 'Method Not Allowed' },
    { status: 405 }
  );
}
