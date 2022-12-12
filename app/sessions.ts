// app/sessions.ts
import { createCookieSessionStorage, Session, redirect } from '@remix-run/node'; // or cloudflare/deno

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: '__session',

      // all of these are optional
      domain: 'localhost',
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
      secrets: ['s3cret1'],
      secure: true,
    },
  });
  export const getUserOrNull = (request) => {
    // get session
    // if(userId)
    // look for it DB
    // return usert
    // return null
  }

interface ItemType {
  key: String,
  title: String,
  price: String,
  img: String,
  qty: Number
}
interface CartType {
  total: Number,
  items: ItemType[];
}
export const getSessionSimplified = async (request :Request):Promise<Session> => {
  const session = await getSession(request.headers.get('Cookie'));
  return session;
};

export const getSessionCart = async (request:Request):Promise<CartType> => {
  const item = {
    key: '',
    title: '',
    price: '$0.00',
    img: '',
    qty: 0
  };
  let cart= {total:0, items:[item]};
  
  const session = await getSessionSimplified(request);
  if(session.has('cart')){
    cart = JSON.parse(session.get('cart'));    
  }
  return cart;
};

export const setSessionCart = async ({tipo,data,request}:{tipo:string,data:CartType,request :Request}) => {
  const session = await getSessionSimplified(request);
  console.log(`setSessionCart request[${JSON.stringify(request)}|]`);
  console.log(`setSessionCart CART[${JSON.stringify(data)}|]`);
  session.set(tipo, data);
};

export { getSession, commitSession, destroySession };
