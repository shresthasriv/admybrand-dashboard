"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, BarChart3, Activity } from "lucide-react"

const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random()*100)}.jpg`,
}

export function Sidebar() {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div
      className={`sticky top-0 left-0 h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${expanded ? "w-64" : "w-16"}`}
      style={{ minWidth: expanded ? 256 : 64 }}
    >
      {/* Profile section */}
      <div className={`flex flex-col items-center ${expanded ? "py-8" : "py-4"} border-b border-sidebar-border transition-all duration-300`}>
        <Avatar className={`${expanded ? "size-20 mb-4" : "size-10 mb-0 mt-2"} transition-all duration-300`}>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        {expanded && (
          <>
            <div className="text-lg font-semibold mt-2">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </>
        )}
      </div>
      {/* Nav section */}
      <nav className={`flex-1 flex flex-col gap-2 ${expanded ? "px-6 py-8" : "items-center py-8"} transition-all duration-300`}>
        <Link href="/">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${!expanded ? "px-0 flex flex-col items-center" : ""} text-black dark:text-white`}
          >
            <Activity className="h-5 w-5" />
            {expanded && "Overview"}
          </Button>
        </Link>
        <Link href="/analytics">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${!expanded ? "px-0 flex flex-col items-center" : ""} text-black dark:text-white`}
          >
            <BarChart3 className="h-5 w-5" />
            {expanded && "Analytics"}
          </Button>
        </Link>
      </nav>
      {/* Expand/collapse arrow, centered vertically */}
      <button
        className="absolute left-full top-1/2 -translate-y-1/2 bg-sidebar border border-sidebar-border rounded-r-full shadow transition hover:bg-sidebar-accent p-1 z-50"
        style={{ outline: "none" }}
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
      {/* Footer */}
      <div className={`mt-auto p-6 text-xs text-muted-foreground border-t border-sidebar-border ${expanded ? "block" : "hidden"}`}>
        © {new Date().getFullYear()} ADmyBRAND
      </div>
    </div>
  );
}
