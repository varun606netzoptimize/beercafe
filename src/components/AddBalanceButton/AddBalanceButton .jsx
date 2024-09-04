'use client';

import React from 'react';

const AddBalanceButton = ({ amount, onClick }) => {
  return (
    <button
      onClick={() => onClick(amount)}
      className='max-w-[250px] min-w-[200px] w-full py-3 px-3 bg-posPrimaryColor text-white border-posPrimaryColor border-2 drop-shadow-md transition-all duration-300 text-center font-bold text-lg cursor-pointer hover:drop-shadow-xl'
    >
      Add ${amount}
    </button>
  );
};

export default AddBalanceButton;
