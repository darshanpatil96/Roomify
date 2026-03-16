interface AuthState{
    isSignIn:boolean;
    username:string|null;
    userId:string|null;
  }
  type AuthContext = {
    isSignIn:boolean;
    username:string|null;
    userId:string|null;
    refreshAuth:()=>Promise<boolean>;
    signIn:()=>Promise<boolean>;
    signOut:()=>Promise<boolean>;
  }