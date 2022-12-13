import { useLoaderData } from "@remix-run/react";
import Modal from "~/components/Modal";
import { db } from "~/utils/db.server";

export const loader =async ({params}) => {
    //console.log(`params => ${JSON.stringify(params)}`);
    const product = await db.product.findUnique({where:{id: params.id}});
    //console.log(`db => ${JSON.stringify(product)}`);
    return { product };
}
export default function New(){   
    const { product } = useLoaderData();
    //console.log(`Edit => ${JSON.stringify(product)}`);
    return <Modal initialValues={product}/>;
}