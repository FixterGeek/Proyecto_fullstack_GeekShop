import { type LoaderFunction, ActionFunction, redirect} from '@remix-run/node'
import { getSessionSimplified, commitSession, getSessionCart } from '~/sessions'

export const action: ActionFunction = async ({ request })=>{
    const formData = await request.formData();
    const form = Object.fromEntries(formData);
    let destino = '/cart';
    if(request.method == 'POST'){
        destino = '/cart';
    }
    if(request.method == 'PUT'){
        destino = '/shirts';
    }
    
    let cart = {total:0, items:[{}]};
    const item = {
      key: form.key,
      title: form.title,
      price: form.price,
      img: form.img,
      qty: Number(form.qty)
    };
    if(request.method == 'PUT'){
        item.qty = item.qty + 1;
    }
    const session = await getSessionSimplified(request);
    if(!session.has('cart')){
        if(item.qty > 0){
            cart= { total:1, items: [ item ]};
        }
    } else{
      cart = JSON.parse(session.get('cart'));    
      const result= cart.items.findIndex( product => product.key == form.key)
      if(result >= 0){
        if(item.qty == 0){
          cart.items.splice(result,1);
        } else {
          cart.items[result] = item;
          console.log(`Action=> qty => ${cart.items[result].qty}`);
        }
      } else {
        if(item.qty > 0){
          cart.items.push(item);
        }
      }    
      cart.total = cart.items.reduce((prev, product)=>{ return prev + Number(product.qty ) },0);
    }
    session.set('cart', JSON.stringify(cart));
    if(cart.total == 0 && request.method == 'POST'){
      destino = '/shirts';
    }
    return redirect( destino, {
      headers: { 
        'Set-Cookie': await commitSession(session),
      }
    });
}

export const loader: LoaderFunction =async ({ request }) => {
    const session= await getSessionSimplified(request);
    let cart = { total:1, items:[ {title:'playera'}]};
    if( session.has('cart')){
        cart = JSON.parse(session.get('cart')); // JSON.parse( JSON.stringify(session.get('cart')) );
        const inventario=cart.items.reduce((prev, product)=>{ return prev + Number(product.qty ) },0);
        cart.total = inventario
    }
    return {
        message : 'hola',
        cart,
        ddv: true,
    };
};