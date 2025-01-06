import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { fetchDocumentById, fetchDocumentWithCondition, onSnapshotWithCondition } from "../db/firestoreService";
import { notFound, redirect } from "next/navigation";


export default async function RootLayout({ children }) {
    const user = await currentUser();
    const userFromDb = await fetchDocumentWithCondition('workers', 'id', `${user?.id}`)

    if (user?.id && userFromDb?.status !== 'active') {
        notFound();
    }    

    if (userFromDb?.isAdmin) {
        redirect('/dashboard');
    }


    return (
        <>
            { children }
        </>
    );
}