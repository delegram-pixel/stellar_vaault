"use client"
import CurrencyForm from '@/components/admin/currency/AdminCurrency'
import AdminPaymentMethodForm from '@/components/admin/currency/AdminPayment'
import { Button } from '@/components/ui/button'
import { deleteCurrency, getAllCurrency, getAllPaymentMethods, updatePaymentMethod } from '@/lib/queries'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchPaymentMethods();
    fetchCurrencies();
  }, []);

  const fetchPaymentMethods = async () => {
    const methods = await getAllPaymentMethods();
    setPaymentMethods(methods);
  };

  const fetchCurrencies = async () => {
    const allCurrencies = await getAllCurrency();
    setCurrencies(allCurrencies);
  };

  const handleUpdatePaymentMethod = async (id, data) => {
    await updatePaymentMethod(id, data);
    fetchPaymentMethods();
  };

  const handleDelete = async (id:any) => {
    await deleteCurrency(id);
    fetchPaymentMethods();
  };


  return (
    <div>
   
      <div className='container p-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
          <div>
            <h2 className='text-2xl font-bold mb-4'>Add Currency</h2>
            <CurrencyForm />
          </div>
          <div>
            <h2 className='text-2xl font-bold mb-4'>
              {editingPaymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
            </h2>
            <AdminPaymentMethodForm 
              editingPaymentMethod={editingPaymentMethod}
              onSubmitSuccess={() => {
                fetchPaymentMethods();
                setEditingPaymentMethod(null);
              }}
            />
          </div>
        </div>

        <div className='mt-12'>
          <h2 className='text-2xl font-bold mb-4'>Payment Methods</h2>
          <div className='bg-white shadow overflow-hidden sm:rounded-md mb-5'>
            <ul className='divide-y divide-gray-200'>
              {paymentMethods.map((method) => (
                <li key={method.id} className='px-4 py-4 sm:px-6 '>
                  <div className='flex items-center justify-between  '>
                    <p className='text-sm font-medium text-indigo-600 truncate'>
                      {method.name}
                    </p>
                    <div className='ml-2 flex-shrink-0 flex'>
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${method.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {method.isEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <div className='mt-2 sm:flex sm:justify-between'>
                    <div className='sm:flex'>
                      <p className='flex items-center text-sm text-gray-500'>
                        {currencies.find(c => c.id === method.currencyId)?.symbol}
                      </p>
                      <p className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6'>
                        {method.walletAddress}
                      </p>
                    </div>
                    <div className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0'>
                      <Button
                        onClick={() => handleUpdatePaymentMethod(method.id, { isEnabled: !method.isEnabled })}
                        variant="outline"
                        className="mr-2"
                        
                      >
                        {method.isEnabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        onClick={() => setEditingPaymentMethod(method)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(method.id)}
                        variant="outline"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page