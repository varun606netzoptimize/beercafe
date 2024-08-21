import MobileButton from '@/components/MobileButton/MobileButton'

const Page = () => {
  return (
    <>
      <div>
        <div className='mb-8'>
          <img
            src='/images/mobile/left-arrow.png'
            alt='App Logo'
            width={33}
            height={33}
            className='object-contain cursor-pointer'
          />
        </div>
        <h2 className='text-titleColor'>Complete your profile</h2>

        <div className='flex flex-col gap-10 mt-8'>
          <div>
            <label className='text-lg'>First name</label>
            <input
              type='text'
              className='w-full h-[46px] rounded-2xl border-[1.8px] border-black bg-transparent mt-3 px-5 text-lg focus-visible:border-black'
            />
          </div>

          <div>
            <label className='text-lg'>Last name</label>
            <input
              type='text'
              className='w-full h-[46px] rounded-2xl border-[1.8px] border-black bg-transparent mt-3 px-5 text-lg focus-visible:border-black'
            />
          </div>

          <div>
            <label className='text-lg'>Email name</label>
            <input
              className='w-full h-[46px] rounded-2xl border-[1.8px] border-black bg-transparent mt-3 px-5 text-lg focus-visible:border-black'
              placeholder='abc@gmail.com'
              type='email'
            />
          </div>
        </div>

        <div className='mt-10 flex flex-col'>
          <p>Food Preference(s)</p>
          <div className='mt-5 grid grid-cols-3 gap-7'>
            <button className='bg-primary text-black  text-base py-3 px-4 text-center rounded-2xl cursor-pointer w-fit drop-shadow-md font-medium'>
              Lager beer
            </button>
            <button className='bg-primary text-black  text-base py-3 px-4 text-center rounded-2xl cursor-pointer w-fit drop-shadow-md font-medium'>
              Lager beer
            </button>
            <button className='bg-primary text-black  text-base py-3 px-4 text-center rounded-2xl cursor-pointer w-fit drop-shadow-md font-medium'>
              Lager beer
            </button>
          </div>
        </div>
        <MobileButton type='secondary'>Save profile info</MobileButton>
      </div>
    </>
  )
}

export default Page
