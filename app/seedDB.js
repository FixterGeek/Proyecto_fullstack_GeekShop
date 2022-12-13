const PrismaClient = require('@prisma/client').PrismaClient

const prisma = new PrismaClient()

const getProduct = ()=> {
    const shirts = [
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
      ];
    return (shirts)
}

const saveInDB = async () => prisma.product.createMany({data:getProduct()})


saveInDB();