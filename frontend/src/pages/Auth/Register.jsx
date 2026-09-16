import AuthLayout from "../../auth/AuthLayout";
import AuthBanner from "../../auth/AuthBanner";
import RegisterForm from "../../auth/RegisterForm";

function Register() {
  return (
    <AuthLayout
      leftContent={<AuthBanner />}
      rightContent={<RegisterForm />}
    />
  );
}

export default Register;