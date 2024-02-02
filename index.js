const {ethers,BrowserProvider}= require('ethers')
//console.log(ethers,"hi")
//import ethereum from "@metamask/detect-provider"
const ABI =require('./contractabi.json')
const contract_address="0x491389368e870048F7509a4357371331e8F42EB4"
const PRIVATE_KEY="beb72193d3e7225899a26e161e169e8180fddadf98dd5c6ea1d0b69e3b82d8d5";
const express=require('express')
const app=express();
app.use(express.json());

const provider=new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/e67ad6d79a77467d88b238c3b10a2465`);
const signer= new ethers.Wallet(PRIVATE_KEY,provider)
const productcontrcat=new ethers.Contract(contract_address,ABI,signer);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
  });

//get product by id

app.get('/product/:id',async(req,res)=>{
try{
const id=req.params.id;
const product=await productcontrcat.getProduct(id);
const prod={
name:product[0],
price:parseInt(product[1]),
quantity:parseInt(product[2])
}
console.log(product)
// const prod=product.map(data=>({
//     name:data[0],
//     price:parseInt(data[1]),
//     quantity:parseInt(data[2])
// }))

res.send(prod);
}
catch(error){
    res.status(500).send(error.message);
}
})

//get ALL products

app.get('/product/',async(req,res)=>{
try{
const id=req.params.id;
const Allproduct=await productcontrcat.getAllproduct();
const products=Allproduct.map(product=>({
    id:parseInt(product.id),
    name:product.name,
    price:parseInt(product.price),
    quantity:parseInt(product.quantity)

}))
console.log(products)
res.send(products);
}
catch(error){
    res.status(500).send(error.message);
}
})
 
app.post('/products',async(req,res)=>{
    try{
        const {id,name,price,quantity}=req.body;
        console.log( typeof price)
        const tx=await productcontrcat.setProduct(id,name,price,quantity)
        await tx.wait();
        console.log(tx.hash);
        console.log("61")
        // const createReceipt = await ethers.Wallet.sendTransaction(tx);
        //  await createReceipt.wait();
        
        res.json({success:true})

    }
    catch(error){
         res.status(500).send(error.message);
    }
})
app.put('/products/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        console.log(typeof id);
        const {uprice,uname,uquantity}=req.body;
        console.log(req.body)
        console.log(id,uname,typeof uname,uprice,uquantity,typeof uprice,typeof uquantity);
        const tx=await productcontrcat.updateProduct(id,uname,uprice,uquantity)
        await tx.wait();
      //  console.log(tx.hash);
       // console.log("77")
        // const createReceipt = await ethers.Wallet.sendTransaction(tx);
        //  await createReceipt.wait();
        const txn=tx.hash
        console.log(tx.hash);

        console.log("success")
        res.json({txn:txn})
        
      //  res.json({success:true})

    }
    catch(error){
         res.status(500).send(error.message);
    }
})
app.delete('/products/:id',async(req,res)=>{
    try{
        const id=req.params.id
        const tx=await productcontrcat.deleteProduct(id)
        await tx.wait();
        const txn=tx.hash
        console.log(tx.hash);

        console.log("94s")
        res.json({txn:txn})
    }
    
    catch(error){
        res.status(500).send(error.message);
    }
    
})
const port =3500;
app.listen(port,()=>{
    console.log("port server is listning on:",port)
})