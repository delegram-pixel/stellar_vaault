
import React from 'react'
import MenuOptions from './MenuOptions'

type Props = {
  id: string

}

const Sidebar = async ({ id }: Props) => {




  return (
    <>
      {/* Desktop navigation - always open */}
      <MenuOptions
        defaultOpen={true}
       
        id={id}
        
      
      />
      {/* Mobile navigation - closed by default */}
      <MenuOptions
      
        id={id}

      
      />
    </>
  )
}

export default Sidebar