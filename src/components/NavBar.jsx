import React from 'react'
import Logo from '../assets/logotienda.webp'
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const NavBar = () => {
  return (
    <div className='w-full h-12 bg-gray-200 flex justify-between items-center px-4'>
      <div className='flex justify-center items-center h-1/2  w-1/2'>
        <img src={Logo} className='w-16 h-16' alt="TiendaLogo" />
      </div>
      <div className='flex gap-2'>
        <Link to='/login'>
          Login
        </Link>
        <Link to='/register'>
          register
        </Link>
        <Link to='/cart'>
          <ShoppingCartIcon />
        </Link>
      </div>

    </div>
  )
}

export default NavBar