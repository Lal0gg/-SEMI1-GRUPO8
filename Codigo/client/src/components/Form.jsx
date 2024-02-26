
export default function Form() {
    return (
        <>
            <div className="bg-white px-12 py-20 rounded-3xl border-gray-100">
                <h1 className="text-5xl font-semibold">FaunaDex Login</h1>
                <p className="font-midium text-lg text-gray-500 mt-4">Ingrese sus datos</p>
                <div className="mt-8">
                    <div>
                        <label className="text-lg font-medium">Usuario</label>
                        <input
                            className='w-full border-2 border-gray-300 p-4 rounded-xl mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-500 ease-in-out'
                            placeholder="Ingrese su usuario"
                        />
                    </div>
                    <div>
                        <label className="text-lg font-medium">Contraseña</label>
                        <input
                            className='w-full border-2 border-gray-300 p-4 rounded-xl mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-500 ease-in-out'
                            placeholder="Ingrese su password"
                            type="password"
                        />
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                        <button className="font-medium text-base text-blue-400">Olvido su Password</button>
                    </div>
                    <div className="mt-8 flex flex-col gap-t-4">
                        <button className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-blue-400 text-white text-lg font-bold">Ingrese</button>
                    </div>
                    <div className="mt-8 flex justify-center items-center">
                        <p className="font-medium text-base">No tenes cuenta?</p>
                        <button className="font-medium text-base text-blue-400 ml-2">Registrate</button>

                    </div>
                </div>
            </div>
        </>
    );
}