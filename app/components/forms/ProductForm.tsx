import { Form } from "@remix-run/react";

export default function ProductForm({ initialValues={}, onSubmit}){
    return(
        <Form method="post" onSubmit={onSubmit} className="flex flex-col">
            <label htmlFor="">Escriba ID</label>
            <input
                defaultValue={initialValues.key}
                className="border"
                name="key"
                placeholder="key"
                />
            <input 
                defaultValue={initialValues.title} 
                className="border" 
                name="title" 
                placeholder="title"/>
            <input 
                defaultValue={initialValues.img} 
                className="border" 
                name="img" 
                placeholder="Image"/>
            <input 
                defaultValue={initialValues.price} 
                className="border" 
                name="price" 
                placeholder="price"/>
            <input 
                type='submit' 
                className='py-6 px-5 bg-blue-500 rounded text-white'
                value={initialValues.id ? 'Actualizar' : 'Guardar'}/>
        </Form>
    );
}