import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./MoreInfos.styles.css";

import { useAppSelector } from "src/redux";
import { UserState } from "src/redux/@types/user";

function MoreInfos() {
  const navigate = useNavigate();
  const userState: UserState = useAppSelector((state) => state.user);
  const { user } = userState;

  useEffect(() => {
    if (user?.login === "") navigate("/");
  }, [user, navigate]);

  return (
    <div className="moreInfosArea">
      <button type="button" onClick={() => navigate("/")}>
        Voltar
      </button>
      <section className="userDetails">
        <h3>{user?.name}</h3>
        <img src={user?.avatarURL} alt={user?.name} />
        <ul>
          <li>login: {user?.login}</li>
          <li>email: {user?.email}</li>
          <li>telefone: {user?.telefone}</li>
        </ul>
      </section>
    </div>
  );
}

export default MoreInfos;
