import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/db/FirebaseConfig';


export async function GET(req) {
  const id = req.nextUrl.searchParams.get('id'); // Extracting id from query string

  if (!id) {    
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const q = query(collection(db, 'workers'), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  const workerData = querySnapshot.docs.map(doc => doc.data())[0]; // Get the first worker from the array  

  if (workerData && workerData.w_pin != null && workerData.w_pin !== undefined) {
    return NextResponse.json({ status: true, message: 'Withdrawal Pin available' });
  } else {
    return NextResponse.json({ status: false, message: 'Withdrawal Pin not set' });
  }
}

export async function POST(req) {
  const { id, pin } = await req.json();

  if (!id || !pin) {
    return NextResponse.json({ error: 'ID and pin are required' }, { status: 400 });
  }

  const q = query(collection(db, 'workers'), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  const workerData = querySnapshot.docs.map(doc => doc.data())[0]; // Get the first worker from the array

  if (workerData && workerData.w_pin != null && workerData.w_pin !== undefined) {
    if (workerData.w_pin === pin) {
      return NextResponse.json({ isCorrect: "correct", message: 'Correct pin' });
    } else {
      return NextResponse.json({ isCorrect: "incorrect", message: 'Incorrect pin' });
    }
  } else {
    return NextResponse.json({ isCorrect: "incorrect", message: 'No data found or pin is not set' });
  }
}
