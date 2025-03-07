import React from 'react'

const CardtoCart = (item) => {
    return (
        <div className='w-10/11 border-2 rounded-lg flex flex-1'>
            <div>
                <img src={item.image} alt={item.title} />
            </div>
            <div>
                <p>{item.title}</p>
                <p>{item.quantity}</p>
                <p>{item.price}*{item.quantity}</p>
            </div>
            <div>
                <button>X</button>
                <button>Continue</button>
            </div>
        </div>
    )
}

export default CardtoCart