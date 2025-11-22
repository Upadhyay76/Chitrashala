"use client";
import React, { useState } from "react";
import { Sidebar } from "../_components/sidebar";
import { MainNav } from "../_components/main-nav";
import { useUIStore } from "~/stores/ui-store";
import { MobileNav } from "../_components/mobile-nav";
import { MobileSidebar } from "../_components/mobileSideBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const currentPage = useUIStore((s) => s.currentPage);
  const setCurrentPage = useUIStore((s) => s.setCurrentPage);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div className="min-h-screen">
      {/* MAIN NAV SHARES SAME BG AS SIDEBAR */}
      <div className="w-full h-16 hidden lg:block">
        <MainNav
          links={[]}
          isLoggedIn={true}
          showSearchBar={true}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="w-full h-16 lg:hidden">
        <MobileNav
          links={[]}
          isLoggedIn={true}
          showSearchBar={true}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* MAIN SECTION */}
      <div className="flex">
        {/* SIDEBAR + NAV SAME BACKGROUND */}
        <div
          className={`h-[calc(100vh-4rem)] text-white ${sidebarOpen ? "sm:w-[18.5rem] " : "hidden sm:block sm:w-20"} overflow-hidden`}
        >
          <Sidebar
            isLoggedIn={true}
            sidebarOpen={sidebarOpen}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <MobileSidebar
            isLoggedIn={true}
            sidebarOpen={sidebarOpen}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        {/* CHILDREN AREA — DIFFERENT BACKGROUND */}
        <div
          className={`fixed ${sidebarOpen ?
            " sm:left-[14rem]  sm:w-[calc(100vw-14rem)] lg:left-[18.5rem] w-full lg:w-[calc(100vw-18.5rem)]" :
            "sm:left-[5rem] w-full sm:w-[calc(100vw-5rem)]"} bg-[#f8f9fa] dark:bg-zinc-800 h-full overflow-y-auto`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
