"use client";
import { useState } from "react";
import Home from "@/components/ui/CreateNewProject";

export const Page = () => {
  const [processId, setprocessId] = useState<number>(0);
  return <Home processId={processId} setprocessId={setprocessId} />;
};

export default Page;
