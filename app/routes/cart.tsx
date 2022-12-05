import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import NavBar from '~/components/NavBar';
import { type ShirtType } from './shirts';
import CartProduct from '../components/CartProduct';
import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node';
import { commitSession, getSession } from '~/sessions';
import { AnimatePresence } from 'framer-motion';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  form.product = JSON.parse(form.data as string);
  let cart = [];
  if (session.has('cart') && form.intent === 'remove') {
    // getting cart
    cart = JSON.parse(session.get('cart'));
    const foundIndex = cart.findIndex(
      (item: ShirtType) => item.id === form.product.id
    );
    if (foundIndex > -1) {
      cart.splice(foundIndex, 1);
      session.set('cart', JSON.stringify(cart));
    }
  }

  if (session.has('cart') && form.intent === 'update') {
    cart = JSON.parse(session.get('cart'));
    const foundIndex = cart.findIndex(
      (item: ShirtType) => item.id === form.product.id
    );
    if (foundIndex > -1) {
      cart[foundIndex] = form.product;
      session.set('cart', JSON.stringify(cart));
    }
  }
  // next
  const next = cart.length ? '/cart' : '/shirts';
  // redirect
  return redirect(next, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

interface LoaderData {
  items: ShirtType[];
}
export const loader: LoaderFunction = async ({ request }) => {
  // session
  const session = await getSession(request.headers.get('Cookie'));
  let items: ShirtType[] = [];
  if (session.has('cart')) {
    const cart = JSON.parse(session.get('cart'));
    items = [...cart];
  }
  return { items };
};
export default function Cart() {
  const { items } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const total = items.reduce(
    (acc, item) => (acc += Number(item.price.replace('$', '')) * item.quantity),
    0
  );

  const removeProduct = (product: ShirtType) => {
    fetcher.submit(
      {
        intent: 'remove',
        data: JSON.stringify(product),
      },
      { method: 'post' }
    );
  };

  const updateProductQuantity = (number: string, product: ShirtType) => {
    const quantity = Number(number) < 1 ? 1 : Number(number);
    if (quantity === 0) return;
    product.quantity = quantity;
    fetcher.submit(
      {
        intent: 'update',
        data: JSON.stringify(product),
      },
      { method: 'post' }
    );
  };

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
          <AnimatePresence mode='popLayout'>
            {items.map((item) => (
              <CartProduct
                onQuantityUpdated={(number) =>
                  updateProductQuantity(number, item)
                }
                onRemove={() => removeProduct(item)}
                product={item}
                key={item.id}
              />
            ))}
          </AnimatePresence>
        </table>
        <article className='flex flex-col items-end'>
          <div className='flex items-end gap-2 mb-4'>
            <h2 className='font-bold text-2xl'>Subtotal</h2>
            <span className='text-lg'>${total}.00</span>
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
