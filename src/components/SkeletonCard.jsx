import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = () => {
    return (
        <div className='rounded-xl flex flex-col border-2 w-96 font-sans shadow-md m-[30px] hover:-translate-y-1 hover:scale-110 duration-300'>
            <div className='w-full'>
                <Skeleton height={300} width="100%" /> {/* Imagen simulada */}
            </div>
            <div className='flex flex-col w-full h-1/2'>
                <Skeleton height={75} width="100%" className="m-2" /> {/* Título simulado */}
                <Skeleton height={30} width="50%" className="m-2 p-2" /> {/* Precio simulado */}
            </div>
        </div>
    );
};

export default SkeletonCard;
