

export default function LoginPage(){
    return(
        <div className="h-screen flex items-center justify-center bg-blue-800">
            <form method="post" action="/api/login" className="bg-white rounded shadow-lg p-4 flex flex-col self-center justify-center align-middle">
                <h1 className="mb-4"> Sign In </h1>
                <input className="form-field" placeholder="username" type="text" name="username" />
                <input className="form-field" placeholder="password" type="password" name="password" />
                <button className="btn mt-4" type="submit">Submit</button>
            </form>
        </div>
    )
}