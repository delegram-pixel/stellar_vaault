
import TransactionsTable from '@/components/transaction/transaction-table'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const page = () => {
  return (
    <div>
          <h1 className="text-2xl">Transactions</h1>
          <Separator className="my-6" />
          <TransactionsTable/>
    </div>
  )
}

export default page