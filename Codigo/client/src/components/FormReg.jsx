export default function FormReg() {
    return (
        <>
            <div className="max-w-md  mt-20  p-16  bg-white rounded-lg shadow-md ">
            <h2 className="text-2xl font-semibold m0b-4">Registro de Perfil</h2>
            <br />
            <form>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
                    <input 
                    type="text" 
                    id="username" 
                    name="username"  
                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Ingrese su usuario"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">Nombre Completo</label>
                    <input 
                    type="text" 
                    id="fullName"
                    name="fullName"  
                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ingrese su nombre"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Contraseña</label>
                    <input 
                    type="password" 
                    id="password" 
                    name="password"  
                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Ingrese su contraseña"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">Confirmar Contraseña</label>
                    <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    className="w-full border-2 border-gray-300 p-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ingrese su contraseña"
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">Registrar</button>
            </form>
        </div>
        </>
    );
}