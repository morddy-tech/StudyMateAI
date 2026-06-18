"use client";

import React, { useState } from "react";
import LandingPage from "@/features/LandingPage";
import Workspace from "@/features/Workspace";

export default function Home() {
  const [showWorkspace, setShowWorkspace] = useState(false);

  return (
    <>
      {showWorkspace ? (
        <Workspace onBack={() => setShowWorkspace(false)} />
      ) : (
        <LandingPage onStart={() => setShowWorkspace(true)} />
      )}
    </>
  );
}
