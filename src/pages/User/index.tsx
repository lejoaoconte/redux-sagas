import * as React from "react";

import "./User.styles.css";

import { getUserRequest, useAppDispatch, useAppSelector } from "src/redux";
import { UserState } from "src/redux/@types/user";

function User() {
  const dispatch = useAppDispatch();
  const userState: UserState = useAppSelector((state) => state.user);
  const { user, loading } = userState;

  function handleGetUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(getUserRequest(e.currentTarget.login.value));
  }

  return (
    <main className="main">
      <h1>digite o nome do user</h1>
      <form className="form" onSubmit={handleGetUser}>
        <input
          placeholder="Digite o login do user"
          type="text"
          name="login"
          required
        />
        <button type="submit">Pesquisar</button>
      </form>
      {user !== undefined &&
        !loading &&
        Object.values(user)?.length > 0 &&
        user?.login !== "" && (
          <section className="userInfos">
            <h3>{user?.name}</h3>
            <img src={user?.avatarURL} alt={user?.name} />
            <ul>
              <li>login: {user?.login}</li>
              <li>email: {user?.email}</li>
              <li>telefone: {user?.telefone}</li>
            </ul>
          </section>
        )}

      {Object.values(user)?.length === 0 && (
        <section className="userInfos">
          <h3>User não encontrado</h3>
        </section>
      )}

      {loading && (
        <section className="userInfos">
          <h3>Carregando</h3>
        </section>
      )}
    </main>
  );
}

export default User;
