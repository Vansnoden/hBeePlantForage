
import LoginForm from '../ui/login-form';
 
export default function LoginPage() {
  return (
    <div className="home-bg">
      <div className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="flex h-20 w-full items-end rounded-lg bg-yellow-500 p-3 md:h-36">
            <div className="w-32 text-white md:w-36">
              Log In
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}