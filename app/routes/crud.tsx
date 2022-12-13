import { type Product } from "@prisma/client";
import { LoaderFunction, redirect } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/utils/db.server";

const productSchema = z.object({
    title:z.string().optional(),
    price:z.string().optional(),
    key:z.number({required_error:"El KEY debe ser unico"}),
})
interface LoaderData{
    productos:Product[];
}
export function ErrorBoundary({ error }) {
    return (
        <div className='bg-blue-200 text-blue-800 h-screen flex flex-col gap-8 items-center py-20'>
        <img className='w-[150px] rounded' src='/error404.jpeg' alt='error' />
        <h1 className='text-lg font-semibold'>Error</h1>
        <p className='p-4 rounded bg-blue-300'>{error.message}</p>
        <p className='text-lg font-semibold'>The stack trace is:</p>
        <pre className='p-4 rounded bg-blue-300'>{error.stack}</pre>
        </div>
    );
}
export const action = async ({request}) => {
    const formData = await request.formData();
    let form = Object.fromEntries(formData);
    form.key = Number(form.key);
    const result = productSchema.safeParse(form);
    console.log(`PATCH =>[${JSON.stringify(result)}|${JSON.stringify(form)}]`);
    switch(request.method){
        case 'DELETE':
           await db.product.delete({where: { id: form.id} });
        case 'PATCH':
            if(result.success){                
                await db.product.update({ where:{ id: form.id }, data: { ...form, id: undefined },});
                return redirect('/crud');
            }
        default:
            if(result.success){
                form.qty = 0;
                await db.product.create({ data: { ...form, id: undefined }});
                return redirect('/crud');
            }
    }
    
    return result;
};
export const loader:LoaderFunction = async() =>{
    const productos = await db.product.findMany({ orderBy:{ id : 'desc'}});
    return {productos};
}
export default function Crud(){
    const { productos } = useLoaderData<LoaderData>();
    const fetcher= useFetcher();
    
    const handleDelete = (id) =>{
        if(!confirm('Estas seguro de borrar, no se puede recuperar')) return;
        fetcher.submit({id},{method:'delete'});
    }

    return (
        <>
            <div className='h-screen flex flex-col items-center justify-center'>
                <Link to='new'>
                    <button className="py-2 px-4 bg-blue-500 text-white text-lg rounded">
                        Agregar
                    </button>
                </Link>
                <table>
                    <thead>
                        <tr>
                            <td className="border 1px solid black">Image</td>
                            <td className="border 1px solid black">ID</td>
                            <td className="border 1px solid black">Nombre</td>
                            <td className="border 1px solid black">Precio</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            productos.map((producto, index) => (
                                <tr key={index}>
                                    <figure className="rounded">
                                        <img width='70' height='70' src={producto.img}/>
                                    </figure>
                                    <td style={{ padding: '0 8px'}}>
                                        <Link className="text-blue-500" to={`${producto.id}/edit`}>
                                            {producto.id}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '0 8px'}}>{producto.title}</td>
                                    <td style={{ padding: '0 8px'}}>{producto.price}</td>
                                    <td>
                                        <button onClick={()=>handleDelete(producto.id)}>
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Outlet/>
            </div>
        </>
    )
}