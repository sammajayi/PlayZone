import React from 'react'

const heroPage = () => {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto p-10 justify-center items-center">

        <div className="relative w-fit mx-auto">

          <div className="absolute inset-0 z-0 rounded-full rainbow-border"></div>

          <div className="relative z-10 flex items-center space-x-2 bg-[#F2F8FF] rounded-full p-3 max-lg:w-10 sm:w-auto ">

            <p className="text-[#444444] text-2xl font-medium leading-[140%]">
              Take Actions, Get Rewarded
            </p>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center">Predict Crypto Market</h1>
        <p className="text-center">Join PlayZone to predict market moves and earn instantly — fast, fair, and fully on-chain.</p>
      </div>
    </section>
  );
};

export default heroPage;