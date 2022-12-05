import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import NavBar from '~/components/NavBar';
import ProductCard from '~/components/ProductCard';
import { commitSession, getSession } from '~/sessions';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  form.product = JSON.parse(form.data as string);
  // session
  const session = await getSession(request.headers.get('Cookie'));
  let cart = [];
  if (session.has('cart')) {
    cart = JSON.parse(session.get('cart'));
  }
  // actions
  switch (form.intent) {
    case 'addToCart':
      // checking for repetition
      const foundIndex = cart.findIndex(
        (item: ShirtType) => item.id === form.product.id
      );
      if (foundIndex > -1) {
        cart[foundIndex].quantity++;
      } else {
        cart.push(form.product);
      }
      session.set('cart', JSON.stringify(cart));
      break;
    default:
      break;
  }
  return redirect('/shirts', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export interface ShirtType {
  title: string;
  quantity: number;
  price: string;
  img: string;
  id: number;
}
interface LoaderData {
  shirts: ShirtType[];
}
export const loader: LoaderFunction = async ({ request }) => {
  // session & cart
  const session = await getSession(request.headers.get('Cookie'));
  let cart = [];
  if (session.has('cart')) {
    cart = JSON.parse(session.get('cart'));
  }
  const shirts = [
    {
      quantity: 1,
      id: 3,
      title: 'Invertocat Pride Tee',
      price: '$30.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/Webshop_TShirt_Pride2022_VintageBlack_Pride_600x600_crop_center.png?v=1653680303',
    },
    {
      quantity: 1,
      id: 0,
      title: 'Youth Invertocat 4.0 Shirt',
      price: '$20.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/WebShop_Youth_TShirt_Invertocat_4.0_Turquoise_1_600x600_crop_center.jpg?v=1629732165',
    },
    {
      quantity: 1,
      id: 1,
      title: 'Ivertocat 4.0 Shirt',
      price: '$30.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/TShirt_Invertocat_4.0_Unisex_Black_600x600_crop_center.jpg?v=1629997801',
    },
    {
      quantity: 1,
      id: 2,
      title: 'Username 2.0 Shirt',
      price: '$30.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/TShirt_GitHub_Username_Unisex_CoolBlue_1_600x600_crop_center.jpg?v=1629732698',
    },
  ];
  return { shirts, cart };
};

export default function Shirts() {
  const { shirts, cart } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const addProductToCart = (product: ShirtType) => {
    fetcher.submit(
      {
        intent: 'addToCart',
        data: JSON.stringify(product),
      },
      {
        method: 'post',
      }
    );
  };

  return (
    <>
      <NavBar
        badgeNumber={cart.reduce(
          (acc: number, item: ShirtType) => (acc += item.quantity),
          0
        )}
      />
      <section className='py-40 max-w-5xl mx-auto px-6 '>
        <h1 className='text-6xl font-bold mb-12 '>Shirts</h1>
        <article className='flex gap-4 flex-wrap'>
          {shirts.map((shirt) => (
            <ProductCard
              onClick={() => addProductToCart(shirt)}
              product={shirt}
              key={shirt.id}
            />
          ))}
        </article>
      </section>
    </>
  );
}
