import Button from "./ui/button";
import { useOutletContext } from "react-router";
import { Box } from "lucide-react";

const Navbar = () => {
  const context = useOutletContext<AuthContext>() || {};
  const {isSignIn,username,signIn,signOut} = context;
  const handleAuthClick = async () => {
    if(isSignIn){
      try{
        await signOut();
      }catch(e){
        console.error(`puter sing out failed:${e}`);
      }
      return;
    }
      try{
        await signIn();
      }catch(e){
        console.error(`puter sing in failed:${e}`);
      }
   };
  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">
              Roomify</span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>

          </ul>
        </div>
        <div className="actions">
          {isSignIn ? (
            <>
              <span className="greeting">
                {username ? `Hi, ${username}` : "Signed In"}
              </span>

              <button className="btn" onClick={handleAuthClick}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn ghost"
                onClick={handleAuthClick}
              >
                Login
              </button>

              <a href="#" className="cta">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;