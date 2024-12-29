// pages/api/webhook.js

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { addDocument } from '@/app/db/firestoreService';

/**
 * Handles POST requests to the webhook endpoint.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_KEY;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Error occurred -- no svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occurred during verification' }, { status: 400 });
  }

  // Extract relevant data from the event
  const eventType = evt.type;
  const eventData = evt.data;

  // Here you can add your logic to save the user data to the database
  // Example: saveUserDataToDatabase(evt.data);
  if (eventType === 'user.created') {
    try {
      await addDocument('workers', {...eventData, status: active});
    } catch (error) {
      console.error('Error handling user.created event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: `Data is available now ${eventData.first_name} ${eventType}` }, { status: 200 });
}

/**
 * Handles GET requests to the webhook endpoint.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req) {
  return NextResponse.json({ message: 'Method not allowed - This endpoint {webhooks/clerk} is only for POST requests' }, { status: 405 });
}

// Default export to handle all HTTP methods
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const response = await POST(req);
//     res.status(response.status).send(response.body);
//   } else {
//     const response = await GET(req);
//     res.status(response.status).send(response.body);
//   }
// }
