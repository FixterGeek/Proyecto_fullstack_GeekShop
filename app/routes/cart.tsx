import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import NavBar from '~/components/NavBar';
import { type ShirtType } from './shirts';
import CartProduct from '../components/CartProduct';
import { type ChangeEvent} from 'react';
import { getSessionSimplified} from '~/sessions';
import { type ActionFunction, LoaderFunction  } from '@remix-run/node';
interface LoaderData {
  items: ShirtType[];
}
export const action: ActionFunction = async ({ request }) => {
  /* */
}

export const loader: LoaderFunction = async ({ request }) => {
  let items = {};
  let cart = {total:0, items:[{}]};
  const session = await getSessionSimplified(request);
  if(session.has('cart')){
    cart = JSON.parse(session.get('cart'));
    items= cart.items;
  }
  return { items };
};
export default function Cart() {
  const { items } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  return (
    <>
      <NavBar />
      <section className='py-40 max-w-5xl mx-auto px-6 '>
        <h1 className='text-6xl font-bold mb-12 '>Shopping Cart</h1>
        <table className=''>
          <tr className='border-b border-b-gray-300'>
            <th>Producto</th>
            <th>Detalle</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
          { items == null ? null :  items.map((item) => (
            <CartProduct product={item} key={item.key} 
              onClick={() => {
                item.qty = 0;
                fetcher.submit(item, { method:"post", action: '/api/cart'});
              }}
              onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
                if(Number(value) >= 0){
                  item.qty = Number(value);
                  fetcher.submit( item, { method:"post", action: '/api/cart'});
                }
              }
            } />
          ))}
        </table>
        <article className='flex flex-col items-end'>
          <div className='flex items-end gap-2 mb-4'>
            <h2 className='font-bold text-2xl'>Subtotal</h2>
            <span>${items == null ? '0' : items.reduce((prev, product)=>{ return prev + ( Number(product.qty * Number(product.price.replace("$",""))) ) },0) }.00</span>
          </div>
          <p className='text-lg mb-4'>
            El envío y los impuestos se calculan al pagar
          </p>
          <div>
            <Link to=''>
              <button className='bg-green-500 text-white font-semibold tracking-wide text-lg py-3 px-4 rounded border-4 border-transparent hover:border-green-500 hover:bg-green-600 transition-all'>
                Proceder al pago
              </button>
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
