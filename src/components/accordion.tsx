"use client";

import React, { useState } from "react";

interface AccordionItem {
  id: number;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
        >
          {/* Header */}
          <button
            onClick={() => toggleAccordion(item.id)}
            className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-800">{item.question}</span>
            <span className="text-xl font-bold text-gray-600">
              {activeId === item.id ? "−" : "+"}
            </span>
          </button>

         
          <div
            className={`px-4 overflow-hidden transition-all duration-300 ${
              activeId === item.id ? "max-h-40 py-3" : "max-h-0 py-0"
            }`}
          >
            <p className="text-gray-600 text-sm">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;