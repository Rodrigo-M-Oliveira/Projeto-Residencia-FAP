import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Saudacao from './components/Saudacao';

const api = axios.create({ baseURL: 'http://localhost:3000' });

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const carregarUsuarios = async () => {
    const res = await api.get('/usuarios');
    setUsuarios(res.data);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await api.put(`/usuarios/${editandoId}`, { nome, email });
      setEditandoId(null);
    } else {
      await api.post('/usuarios', { nome, email });
    }
    setNome('');
    setEmail('');
    carregarUsuarios();
  };

  const handleEditar = (usuario) => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setEditandoId(usuario.id);
  };

  const handleExcluir = async (id) => {
    await api.delete(`/usuarios/${id}`);
    carregarUsuarios();
  };

  return (
    <div style={{ padding: 20 }}>
      <Saudacao />
      <form onSubmit={handleSubmit}>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <button type="submit">{editandoId ? "Atualizar" : "Cadastrar"}</button>
      </form>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nome} - {u.email}
            <button onClick={() => handleEditar(u)}>Editar</button>
            <button onClick={() => handleExcluir(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;