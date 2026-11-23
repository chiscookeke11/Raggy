"use client"

import { checkBackendHealth } from "@/services/health.service";
import { useDocumentStore } from "@/store/document.store";
import { HealthResponse } from "@/types/types";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";




export default function Header() {

    const [health, setHealth] = useState<HealthResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const documents = useDocumentStore((state) =>
        state.documents)





    // fetch the health status on load. It also updates when there is a change in the number of documents
    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const data = await checkBackendHealth();
                setHealth(data)
            } catch (error) {
                console.error("Backend health check failed:", error)
            }
            finally {
                setLoading(false)
            }
        }

        fetchHealth()

    }, [documents])


    return (
        <header className="w-full  py-2 px-5 flex items-center justify-between border-b border-black/12   " >
            <Link href={"/"} >
                <Image src={"/logos/logo.png"}
                    alt="logo"
                    height={200}
                    width={200}
                    className="w-32.5  "
                />
            </Link>




            {loading ? <p className=" font-normal text-sm text-[#687076] flex items-center gap-2 " >
                <Spinner />
                Checking backend connection...</p> :
                !health ?
                    <p className=" font-normal text-sm text-red-500 " >Backend unavailable</p> :
                    (
                        <div className="w-fit flex items-center gap-7 " >
                            <div className="flex items-center gap-2 " >
                                <span className={`size-2 block rounded-full
                                    ${health.ollama_reachable ? "bg-green-800" : "bg-red-500"}
                                    `} />
                                <p className=" font-normal text-sm text-[#687076] " >Ollama
                                    {health.ollama_reachable ? " connected" : " Unavaible"}
                                </p>
                            </div>



                            <div className="flex items-center gap-2 " >
                                <span className={`size-2 block rounded-full bg-green-800
                                    ${health.embedding_model_ready ? "bg-green-800" : "bg-red-500"}
                                    `} />
                                <p className=" font-normal text-sm text-[#687076] " >Embedding model
                                    {health.embedding_model_ready ? " ready" : " unavailable"}
                                </p>
                            </div>


                            <div className="flex items-center gap-2 " >
                                <span className={`
                                    size-2 block rounded-full bg-green-800
                                    ${health.llm_model_ready ? "bg-green-800" : "bg-red-500"}
                                    `} />
                                <p className=" font-normal text-sm text-[#687076] " >
                                    LLM Model: {health.llm_model_ready ? " ready" : " unavailable"}
                                </p>
                            </div>


                            <div className="flex items-center gap-2 " >
                                <p className=" font-normal text-sm text-[#687076] " > {health.vector_count.toLocaleString()} Vectors on disk</p>
                            </div>

                        </div>
                    )
            }



        </header>

    )
}