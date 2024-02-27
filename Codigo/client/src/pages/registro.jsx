import FormRegistro from '../components/FormReg'
import Login from '../components/login'
import SelectFoto from '../components/SelectFoto'

export default function Registro() {
    return (
        <div className='flex justify-center items-center h-auto'>
            <div className='flex-1'>
            <SelectFoto />
            </div>
            <div className='flex-1'>
            <FormRegistro />
            </div>
        </div>
    )
}


