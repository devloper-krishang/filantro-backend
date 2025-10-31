interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput {
  name: string;
  lastname: string;
  entityName: string;
  jobTitle: string;
  telephone: string;
  email: string;
  password: string;
  entityType:
    | 'academia'
    | 'business'
    | 'government'
    | 'grantmaker'
    | 'funder'
    | 'intermediary'
    | 'nonprofit';
}

interface ResetPasswordInput {
  email: string;
  code: string;
  password: string;
}

interface VerifyEmailInput {
  token: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface ResendVerificationInput {
  email: string;
}

export {
  LoginInput,
  SignupInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResendVerificationInput,
};
