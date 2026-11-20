import Link from "next/link";




export default function Footer() {
    return (
        <footer className="w-full py-6 px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-14 md:gap-5 text-[#11181c] font-grotesque " >


            <small className="text-sm font-normal  " >Raggy, a portfolio project by Chinedu Okeke</small>

            <div className="text-sm flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-10" >
                <Link href={"/"} > Dashboard </Link>
                <Link href={"/"} > Source on Github </Link>
            </div>

        </footer>
    )
}