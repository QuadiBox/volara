import Link from "next/link";
import { currentUser } from '@clerk/nextjs/server';
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchAllDocuments, fetchDocumentWithCondition } from "../db/firestoreService";


export default async function RootLayout({ children }) {
    const user = await currentUser();
    const userFromDb = await fetchDocumentWithCondition('workers', 'id', `${user?.id}`)

    // if (user?.publicMetadata?.admin) {
    //     redirect("/dashboard_admin");
    // }

    if (!userFromDb?.isAdmin) {
        redirect('/webapp');
    }

    const tasks_from_db = await fetchAllDocuments('requests') || [];
    const notifs_from_db =  tasks_from_db.filter(elem => elem?.locationData?.country !== undefined && elem?.locationData?.country !== null);
    return (
        <div className="dashboardGrandCntn">
            
            <nav>
                <Link href={"/"}><img src="/Logo.png" alt="Volara logo" /></Link>
                <div className="linkList">
                    <Link className="one" href={"/dashboard"}><i className="icofont-ghost"></i>Overview</Link>
                    <Link className="two" href={"/dashboard/clients"}><i className="icofont-users-alt-4"></i>Clients</Link>
                    <Link className="three" href={"/dashboard/workers"}><i className="icofont-workers-group"></i>Workers</Link>
                    <div className="dashExtra">
                        <Link className="four" href={"/dashboard/tasks"}><i className="icofont-files-stack"></i>Tasks ({notifs_from_db?.length})</Link>
                        <div className="bottom">
                            <Link className="five" href={"/dashboard/tasks/completed"}><i className="icofont-tick-mark"></i>Completed</Link>
                            <Link className="six" href={"/dashboard/tasks/active"}><i className="icofont-listine-dots"></i>Active</Link>
                            <Link className="seven" href={"/dashboard/tasks/declined"}><i className="icofont-close-line-circled"></i>Declined</Link>
                            <Link className="eight" href={"/dashboard/tasks/pending"}><i className="icofont-ui-laoding"></i>Pending</Link>
                        </div>
                    </div>
                </div>

                <div className="logoutBtnCntn">
                    <h3>You are logged in as <span>Admin 1</span></h3>
                    <button type="button">Log out</button>
                </div>

            </nav>
                
            <main className='dashboardCntn'>
                <div className="header">
                    <div className="searchBox">
                        <button type="button"><i className="icofont-search"></i></button>
                        <input type="search" name="searchbox" id="searchbox" placeholder="What are you looking for?"/>
                    </div>
                    <div className="dateTime">
                        <h2>Enter dates <i className="icofont-ui-calendar"></i></h2>
                        <div className="bottom">
                            <input type="text" placeholder="dd-mm-yyyy"/>
                            <input type="text" placeholder="dd-mm-yyyy"/>
                        </div>
                    </div>
                    <div className="dashNavProfile">
                        <img src={`${user?.imageUrl}`} alt="profile picture" />
                        <h3>Admin 1</h3>
                    </div>
                </div>
                { children }
                
            </main>
        </div>
    );
}