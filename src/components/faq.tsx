import React from "react";
import Accordion from "../components/accordion";

const faqData = [
    {
      id: 1,
      question: "What can I predict?",
      answer:
        "Crypto market really",
    },
    {
      id: 2,
      question: "How are rewards paid?",
      answer:
        "How will i get my money?",
    },
    {
      id: 3,
      question: "Is PlayZone safe?",
      answer:
        "is it?",
    },
  ];


  export default function faq() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
       <div className="items-center justify-center">
        <div>
        <h1 className="text-2xl font-bold">PlayZone FAQs</h1>  
        <p className="text-[#64748b] mb-6">Quick answers to help you get started on PlayZone.</p>
        </div>

        <div className="flex flex-col items-center justify-center">

       
        <div className="flex-1">
            <Accordion items={faqData} />
        </div>

        <div>
           <div bg-red-500></div>
        </div>
        </div>
        </div>



      </div>
    );
  }