export default function WelcomePage() {
    return (


        <div className="flex items-center  h-screen bg-white ">

            <div className="bg-slate-100 p-8 rounded shadow-md h-full w-1/2 flex flex-col justify-center">
                <div>
                    <img src="../../src/assets/logo.png" className="w-lg h-24 mx-auto mb-4" />
                </div>

                <h1 className="text-2xl font-bold mb-4 text-center text-black">Welcome Back</h1>
                <button className="w-full bg-white text-black py-2 px-4 rounded hover:bg-blue-700">
                    Sign in with Google
                </button>

                <input type="text" placeholder="Username" className="w-64 m-4" />

                <input type="password" placeholder="Password" className="w-64 m-4" />
            </div>
            <div className="w-1/2 h-full bg-slate-100 flex items-center justify-center">
                <div className="w-screen h-screen flex items-center justify-center">
                    <img src="../../src/assets/WelcomePage.jpg" />

                </div>
            </div>
        </div>

    );
}