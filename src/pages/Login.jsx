import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    // TODO: replace this with real API call
    if (email && pwd) {
      login("demo-token", { id: "u1", email, role: "admin" });
      nav(loc.state?.from?.pathname || "/dashboard", { replace: true });
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <form onSubmit={onSubmit} style={{width:360,padding:24,border:"1px solid #ddd",borderRadius:12}}>
        <h2>Sign in</h2>
        <div style={{marginTop:12}}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" style={{width:"100%",padding:8}} />
        </div>
        <div style={{marginTop:12}}>
          <label>Password</label>
          <input value={pwd} onChange={e=>setPwd(e.target.value)} type="password" style={{width:"100%",padding:8}} />
        </div>
        {err && <p style={{color:"crimson",marginTop:8}}>{err}</p>}
        <button type="submit" style={{marginTop:16,width:"100%",padding:10}}>Sign in</button>
      </form>
    </div>
  );
}
