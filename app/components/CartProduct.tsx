import { type ShirtType } from '~/routes/shirts';

interface CartProductProps {
  product: ShirtType;
}
export default function CartProduct({ product }: CartProductProps) {
  return (
    <tr className=''>
      <td className='w-[150px] px-8 py-8'>
        <img className='w-full' src={product.img} alt={product.title} />
      </td>
      <td className='px-8 '>
        <h2 className='font-semibold text-lg'>{product.title}</h2>
        <p className='font-thin'>Linear/Men’s / XS</p>
        <button className='text-gray-500 pt-8'>Quitar</button>
      </td>
      <td className='px-8'>
        <span>{product.price}</span>
      </td>
      <td className='px-8'>
        <input
          className='border-2 border-gray-300 py-2 px-4 rounded'
          type='number'
          defaultValue={1}
        />
      </td>
      <td>{product.price}</td>
    </tr>
  );
}
