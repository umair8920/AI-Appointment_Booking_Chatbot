import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from "react";

export default function AppLayout({ children }) {
  const [activeSession, setActiveSession] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSession={activeSession}
          onSelectSession={setActiveSession}
        />

        <main className="flex-1 bg-zinc-50 p-6 overflow-y-auto">
          {React.isValidElement(children)
            ? React.cloneElement(children, { activeSession })
            : children}
        </main>
      </div>
    </div>
  );
}