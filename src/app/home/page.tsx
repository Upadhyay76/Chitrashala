import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { MainNav } from "../_components/main-nav";
import { Logo } from "~/components/logo";
import { MobileNav } from "../_components/mobile-nav";
import { Footer } from "../_components/footer";

const page = async () => {

  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Navigation for Desktop */}
      <div className="hidden md:block">
        <MainNav isLoggedIn={true} />
      </div>
      {/* Mobile Navigation for Mobile */}
      <div className="block md:hidden">
        <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-lg">
          {/* Use the Logo component here */}
          <Logo />
          <MobileNav isLoggedIn={true} />
        </div>
      </div>


      <Footer />
    </div>
  )
}

export default page
