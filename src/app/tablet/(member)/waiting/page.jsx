'use client'

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the success page after 10 seconds
    const timer = setTimeout(() => {
      router.push('/tablet/success');
    }, 5000);

    // Cleanup the timer if the component unmounts before the timeout
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <div className='absolute z-40 top-8 left-7'>
        <h2 className='text-[#1f1f1f] text-3xl font-bold'>Hey Yash</h2>
      </div>
      <div className='flex flex-col gap-8 pt-[150px] items-center w-full h-full text-center'>
        <h1 className='text-[60px] text-primary'>Cheers!!!</h1>
        <h4 className='text-xl font-medium text-[#1F1F1F]'>
          In seconds, this machine pours your beer and signals when it’s ready.
        </h4>
        <div className='max-w-[700px] md:max-w-[800px] shadow-[0_0_10px_#00000029] h-full max-h-[300px] md:max-h-[300px] mx-8 z-30 absolute bottom-0 w-full py-[40px] rounded-[10px]'></div>
      </div>
    </>
  );
}

export default Page;
