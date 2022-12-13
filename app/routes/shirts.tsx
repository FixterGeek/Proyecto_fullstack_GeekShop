import { type ActionFunction, LoaderFunction  } from '@remix-run/node';
import { useFetcher, useLoaderData} from '@remix-run/react';
import { useEffect } from 'react';
import NavBar from '~/components/NavBar';
import ProductCard from '~/components/ProductCard';
import { getSessionSimplified} from '~/sessions';
import { db } from "~/utils/db.server";

export interface ShirtType {
  title: string;
  price: string;
  img: string;
  key: number;
  qty: number;
}
interface LoaderData {
  shirts: ShirtType[];
  cart: CartType[];
}
interface ItemType {
  key: String,
  title: String,
  price: Number,
  img: String,
  qty: Number
}
interface CartType {
  total: Number,
  items: ItemType[];
}
export const action: ActionFunction = async ({ request }) => {
  /*
  // 1. donde esta el estad? (cookie)
  // 2. actualizar el estado
  // 3. guardar el estado (cookie)
  // 4. devolver el estado => (loader) => redirect <= /shirts
  */
}

export const loader: LoaderFunction = async ({ request }) => {
  /*const shirts = [
    {
      key: 3,
      title: 'Invertocat Pride Tee',
      price: '$30.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/Webshop_TShirt_Pride2022_VintageBlack_Pride_600x600_crop_center.png?v=1653680303',
      qty: 0
    },
    {
      key: 0,
      title: 'Youth Invertocat 4.0 Shirt',
      price: '$20.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/WebShop_Youth_TShirt_Invertocat_4.0_Turquoise_1_600x600_crop_center.jpg?v=1629732165',
      qty: 0
    },
    {
      key: 1,
      title: 'Ivertocat 4.0 Shirt',
      price: '$30.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/TShirt_Invertocat_4.0_Unisex_Black_600x600_crop_center.jpg?v=1629997801',
      qty: 0
    },
    {
      key: 2,
      title: 'Username 2.0 Shirt',
      price: '$30.00',
      img: 'https://cdn.shopify.com/s/files/1/0051/4802/products/TShirt_GitHub_Username_Unisex_CoolBlue_1_600x600_crop_center.jpg?v=1629732698',
      qty: 0
    },
  ];*/
  const shirts = await db.product.findMany({ take:100, orderBy: { id: 'desc'} });

  let cart = {};
  const session = await getSessionSimplified(request);
  if(session.has('cart')){
    cart = JSON.parse(session.get('cart'));
    shirts.map((product,index) => {
      const result= cart.items.findIndex( item => item.key == product.key);
      if(result >= 0){
        shirts[index].qty = cart.items[result].qty;
      }
    })
  }
  return { shirts, cart };
};

export default function Shirts() {
  const { shirts, cart } = useLoaderData<LoaderData>();
  const fetcher= useFetcher();

  useEffect(() =>{
    fetcher.load('/api/cart');
    console.log(fetcher);
  },[]);

  useEffect(() =>{
    console.log(fetcher);
  },[fetcher]);
  return (
    <>
      <NavBar badgeNumber={cart?.total}/>
      <section className='py-40 max-w-5xl mx-auto px-6 '>
        <h1 className='text-6xl font-bold mb-12 '>Shirts</h1>
        <article className='flex gap-4 flex-wrap'>
          {shirts.map((shirt) => (
            <ProductCard product={shirt} key={shirt.key} onClick={() =>{
              fetcher.submit( shirt, { method:"put", action: '/api/cart'});
            }} />
          ))}
        </article>
      </section>
    </>
  );
}
