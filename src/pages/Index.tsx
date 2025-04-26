
import React from "react";
import { FitnessProvider } from "@/context/FitnessContext";
import FitnessLayout from "@/components/layout/FitnessLayout";

export default function Index() {
  return (
    <FitnessProvider>
      <FitnessLayout />
    </FitnessProvider>
  );
}
