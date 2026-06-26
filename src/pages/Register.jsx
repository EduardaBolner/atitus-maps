import { useState } from "react";
import { Logo } from "../components/Logo";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";

const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#515569"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#515569"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#515569"/>
  </svg>
);

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await signUp(name, email, senha);
      navigate("/login");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#192853] flex flex-col items-center px-[40px] pb-8">
      <div className="w-full pt-6 flex items-center">
        <Link to="/login" className="flex items-center gap-1 text-white/70 hover:text-white text-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
          Voltar
        </Link>
      </div>

      <div className="pt-2">
        <Logo size="small" />
      </div>

      <p className="text-white font-semibold text-[15px] text-center mt-2 mb-6">
        Crie sua conta
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[16px]">
        <Input
          label="Nome"
          placeholder="Seu nome"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<PersonIcon />}
        />
        <Input
          label="Email"
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<MailIcon />}
        />
        <Input
          label="Senha"
          placeholder="Senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          icon={<LockIcon />}
        />
        <Input
          label="Confirmar senha"
          placeholder="Confirmar senha"
          type="password"
          required
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          icon={<LockIcon />}
        />

        {erro && (
          <p className="text-red-400 text-sm text-center">{erro}</p>
        )}

        <div className="mt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>

      <div className="w-full mt-4">
        <div className="w-full h-px bg-white/20 mb-4" />
        <p className="text-white text-[15px] text-center">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-[#ffe14e] font-medium hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
