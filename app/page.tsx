import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if(session?.user){
    return redirect('/dashboard')
  }
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                Sort Your Notes easily
              </span>
            </span>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">Create Notes with ease</h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse fuga, iure perspiciatis libero repellendus exercitationem officiis non quo quod rerum.</p>
          </div>
          <div className="flex max-w-sm justify-center mx-auto mt-10">
            <Link href="/signup">
              <Button size="lg" className="w-full">Sign Up for free</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
