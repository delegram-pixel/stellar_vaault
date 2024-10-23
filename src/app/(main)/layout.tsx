import { onLoginUser } from '@/actions/auth'
import SideBar from '@/components/sidebar'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Sidebar from "@/components/sidebar";
import BlurPage from "@/components/global/blur-pagge";
import InfoBar from "@/components/global/InfoBar";
import React from 'react'


interface Props {
    children: React.ReactNode
}

const layout = async ({children}: Props) => {

    const authenticated = await onLoginUser()

    if (!authenticated) return null;


 
    return (
        <div className="h-screen overflow-hidden">
      <Sidebar type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
    )
}

export default layout
