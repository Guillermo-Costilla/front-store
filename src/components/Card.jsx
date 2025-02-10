

const Card = ({ product }) => {
    return (
        <div key={product.id} className=' rounded-xl flex flex-col border-2 w-96 font-sans shadow-2xl m-[30px] hover:-translate-y-1 hover:scale-110 duration-300'>
            <div className='w-full'>
                <img src={product.image} className='w-full h-[300px] object-contain' alt={product.title} />
            </div>
            <div className='flex flex-col w-full h-1/2' >
                <h1 className='text-left text-xl font-bold w-full m-2 h-[75px]'>{product.title}</h1>
                <p className='text-left m-2 p-2 text-blue-500 text-2xl'> $ {product.price}</p>

            </div>

        </div>
    )
}

export default Card;