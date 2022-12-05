import React from 'react';
import { type ShirtType } from '~/routes/shirts';
import { motion } from 'framer-motion';

interface CartProductProps {
  product: ShirtType;
  onRemove?: () => void;
  onQuantityUpdated?: (arg0: string) => void;
}
export default function CartProduct({
  onQuantityUpdated = () => false,
  onRemove,
  product,
}: CartProductProps) {
  return (
    <motion.tr
      layout
      className=''
      exit={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring' }}
      key={product.id}
    >
      <td className='w-[150px] px-8 py-8'>
        <img className='w-full' src={product.img} alt={product.title} />
      </td>
      <td className='px-8 '>
        <h2 className='font-semibold text-lg'>{product.title}</h2>
        <p className='font-thin'>Linear/Men’s / XS</p>
        <button onClick={onRemove} className='text-gray-500 pt-8'>
          Quitar
        </button>
      </td>
      <td className='px-8'>
        <span>{product.price}</span>
      </td>
      <td className='px-8'>
        <input
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) => onQuantityUpdated(value)}
          className='border-2 border-gray-300 py-2 px-4 rounded'
          type='number'
          value={product.quantity}
        />
      </td>
      <td>{product.price}</td>
    </motion.tr>
  );
}
