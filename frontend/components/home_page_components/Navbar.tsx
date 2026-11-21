import Image from "next/image";
import Link from "next/link";




export default function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between gap-10 py-4 px-[5%] " >

            <Link href={"/"} >
                <Image src={"/logos/logo.png"}
                    alt="logo"
                    height={200}
                    width={200}
                    className="w-32.5  "
                />
            </Link>



            <ul className="w-fit hidden md:flex items-center gap-6 text-sm font-grotesque font-medium  " >
                <li><Link href={"#"} className="text-[#687076] hover:text-[#171717] transition-all duration-200 ease-in-out" >How it works</Link></li>
                <li><Link href={"#"} className="text-[#687076] hover:text-[#171717] transition-all duration-200 ease-in-out">What you can inspect</Link></li>
                <li><Link href={"#"} className="text-[#687076] hover:text-[#171717] transition-all duration-200 ease-in-out">Privacy</Link></li>

                <li>
                    <Link href={"#"}
                        className="border border-[#171717]  px-6 py-2 relative group bg-white"
                    >
                        <span className="relative z-10 text-white mix-blend-difference font-normal " >Dashboard</span>
                        <span className="absolute bottom-0 left-0 bg-black w-full h-0 group-hover:h-full transition-all duration-300 ease-in-out  z-0" />
                    </Link>
                </li>
            </ul>
        </nav>
    )
}