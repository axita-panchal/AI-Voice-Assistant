"use client";

import Image from "next/image";
import React from "react";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
   <div className="h-screen overflow-hidden bg-[url('/assets/svgs/background.png')] bg-cover bg-center bg-no-repeat p-15">
         <div className="bg-white w-full h-full rounded-[32px] shadow-xl overflow-hidden mx-auto flex flex-col min-[1000px]:flex-row items-center justify-center">
           {/* ================= LEFT FORM ================= */}
           <div className="w-full min-[1000px]:w-[48%] h-full flex flex-col justify-center overflow-hidden px-8 lg:px-14 xl:px-18">
             {/* HEADER */}
             <div className="shrink-0 pt-8 pb-5">
               <div className="mx-auto w-full">
                 <h1 className="text-xl min-[1750]:text-3xl leading-[40px] font-bold text-gray-900">
                   {title}
                 </h1>
   
                 <p className="text-[18px] min-[1750]:text-[20px] font-medium text-gray-500 mt-2 leading-6">
                     {subtitle}
                 </p>
               </div>
             </div>
   
             {/* SCROLLABLE FORM */}
             <div className="overflow-y-auto custom-scroll">
              {children}
             </div>
   
             {/* FIXED FOOTER */}
              {footer && (
            <div className="shrink-0 pt-4 pb-8">
              <div className="mx-auto w-full">
                {footer}
              </div>
            </div>
          )}
           </div>
   
           {/* ================= RIGHT IMAGE ================= */}
           <div className="hidden min-[1000px]:flex h-full items-center justify-center p-8 xl:p-10">
             {/* Below 1700 */}
             <div className="w-full h-full items-center justify-center flex min-[1750px]:hidden">
               <Image
                 src="/assets/svgs/volic_banner_tablet.png"
                 alt="Signup"
                 className="w-full h-full object-contain"
                 width={700}
                 height={700}
                 priority
               />
             </div>
   
             {/* Above 1700 */}
             <div className="hidden min-[1750px]:flex w-full h-full items-center justify-center">
               <Image
                 src="/assets/svgs/volic_banner.png"
                 alt="Signup"
                 className="w-full h-full object-contain"
                 width={900}
                 height={900}
                 priority
               />
             </div>
           </div>
         </div>
       </div>
  );
}