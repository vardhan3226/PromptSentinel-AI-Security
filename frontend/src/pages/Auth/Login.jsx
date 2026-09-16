import AuthLayout from "../../auth/AuthLayout";
import AuthBanner from "../../auth/AuthBanner";
import LoginForm from "../../auth/LoginForm";

function Login() {
  return (
    <AuthLayout
      leftContent={<AuthBanner />}
      rightContent={<LoginForm />}
    />
  );
}

export default Login;