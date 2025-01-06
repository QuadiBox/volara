import Header from "../../Header";
import Nav from "../../nav";
import Todos from "../../Todos";



const Page = ({ params }) => {    
    return (
        <div className='grandVolaraCntn'>
            <div className="volaraCntn">
                <Header></Header>

                <section className="curentCntn">
                    <div className="topPlatfromDisplay" style={{backgroundImage: `linear-gradient(to top, #0a080729, #0a0807c2), url(/${params?.slug[0].toLowerCase()}_bg.png)`}}>
                        <h2>{params?.slug[0]}</h2>
                        <p>Here are all available {params?.slug[0]}-related tasks. Get on with them and get paid.</p>
                    </div>
                    <Todos isTask={true} isRegion={params?.slug[0]}></Todos>
                </section>

                <Nav type={'tasks'}></Nav>
            </div>
        </div>
    )
}

export default Page