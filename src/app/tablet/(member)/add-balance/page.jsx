'use client';

import { useRouter } from 'next/navigation';

import AddBalanceButton from '@/components/AddBalanceButton/AddBalanceButton '
import TabletHeader from '@/components/TabletHeader/TabletHeader'

const Page = () => {
  const router = useRouter()

  const amounts = [500, 800, 1000, 1200, 1500]

  const handleAddBalance = amount => {
    router.push('/tablet/scanner')
    console.log(`Adding $${amount} to balance`)
  }

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Oops!
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>
          Your balance is a bit low. Add some funds to enjoy your beer!
        </p>
      </TabletHeader>
      <div className='flex flex-col gap-10 justify-center items-center w-full h-full text-center'>
        <div className='mt-16 gap-2 w-full max-w-[380px] flex flex-col justify-center text-center text-[#1f1f1f]'>
          <h3 className='text-xl font-bold mb-16'>
            Cart Amount: <span className='text-[40px] font-black text-posPrimaryColor'>$499</span>
          </h3>
          <h3 className='text-xl font-bold'>
            Your card balance is: <span className='text-[40px] font-black text-posPrimaryColor'>$175</span>
          </h3>
        </div>

        {/* <div className='flex  gap-3 items-center w-full justify-center'>
        <button className='max-w-[200px] mt-8 w-full py-3 px-3 bg-primary drop-shadow-md transition-all duration-300 text-center font-bold uppercase text-lg cursor-pointer hover:drop-shadow-xl'>
          New Order
        </button>
        <button className='max-w-[250px] w-full py-3 px-3 bg-white text-black border-black border-2 drop-shadow-md transition-all duration-300 text-center font-black uppercase text-lg cursor-pointer hover:drop-shadow-xl'>
            Add card balance
          </button>
        </div> */}

        <div className='flex flex-col justify-center items-center gap-10 w-4/5'>
          <div className='bg-white w-full'>
            <p className='text-center font-black uppercase text-lg text-black border-t pt-10'>Add card balance</p>
          </div>
          <div className='flex flex-wrap justify-center items-center gap-3 w-full'>
            {amounts.map(amount => (
              <AddBalanceButton key={amount} amount={amount} onClick={handleAddBalance} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
