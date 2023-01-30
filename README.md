# Redux Sagas

**redux-saga** é um middleware redux que pode ser começada, continuada e parada com as actions do redux e tem acesso a todo state do redux, assim como pode acessar os dispatchs, além de ser assíncrona, fazendo side effects na aplicação.

Para implantar o mesmo é muito simples, mas tem-se em mente que o redux-sagas atualiza o estado por inteiro de acordo com o retorno da API.

Dai um exemplo simples, de buscar dados de usuário numa API, temos. 

---

**Antes de definir o passo** a passo para implementação do Sagas no Redux é importante deixarmos **definidos nossos types** que serão usados ao longo da aplicação. Sendo eles os **types gerais** de requisição no arquivo index.ts da pasta `@types`.

```tsx
export const GET_USER_REQUEST = "GET_USER_REQUEST";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILURE = "GET_USER_FAILURE";
```

Após isso definir os **types do usuário**

```tsx
export interface UserType {
  id: string;
  login: string;
  password: string;
  avatarURL: string;
  name: string;
  telefone: string;
  email: string;
}

export interface UserState {
  user: UserType;
  loading: boolean;
  error: string;
}
```

E, por fim, os **types do store**. Estes aqui geralmente **são definidos somente quando o store é criado**, os demais são antes de desenvolver a aplicação.

```tsx
import rootReducer from "src/redux/reducers";

import store from "src/redux";

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
```

Todos serão melhor explicados ao longo do desenvolvimento do artigo. Mas após definidos os types podemos começar as definições dos actions, reducers e, por fim, do sagas, finalizando no store, que é o responsável por unir todas as definições.

---

- Primeiro passo seria **definir as actions,** que é usada para poder gerenciar o estado de forma mais assertiva, ou seja, passando os dados corretos para o middleware e para o reducer, gerando um estado novo que irá ser definido.

```tsx
import { UserType } from "src/redux/@types/user"; // Tipagem definida em @types para poder ser usada ao longo da aplicação.

import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
} from "src/redux/@types"; // Vem da pasta @types por padrão para poder ter os mesmos valores ao longo de toda aplicação.

// Requisição de request de usuário, neste caso passadno login como padrão.
export function getUserRequest(login: string): {
  type: string;
  payload: string;
} {
  return {
    type: GET_USER_REQUEST,
    payload: login,
  };
}
// Requisição de success de usuário, retornando o próprio usuário
export function getUserSuccess(user: UserType): {
  type: string;
  payload: UserType;
} {
  return {
    type: GET_USER_SUCCESS,
    payload: user,
  };
}
// Requisição de failure de usuário, retornando um erro
export function getUserFailure(error: string): {
  type: string;
  payload: string;
} {
  return {
    type: GET_USER_FAILURE,
    payload: error,
  };
}
```

- Após isso podemos **definir nossos reducers**, que contém o estado antes de chegar no store, onde faz o gerenciamento.

```tsx
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
} from "src/redux/@types/index";

import { UserState, UserType } from "src/redux/@types/user";

const initialState: UserState = {
  user: {
    avatarURL: "",
    email: "",
    id: "",
    login: "",
    name: "",
    password: "",
    telefone: "",
  },
  loading: false,
  error: "",
}; // Valores iniciais do state que irá armazenar os dados

export function userReducer(
  state = initialState,
  action: { type: string; payload: UserType }
) {
  switch (action.type) {
    case GET_USER_REQUEST: // Altera o estado deixando o loading true enquanto faz a requisição na API.
      return {
        ...state,
        loading: true,
        error: "",
        user: action.payload,
      };
    case GET_USER_SUCCESS: // Caso a requisição seja sucesso altera o estado deixando o loading false e altera o estado do user.
      return {
        ...state,
        loading: false,
        error: "",
        user: action.payload,
      };
    case GET_USER_FAILURE: // Caso a requisição seja falhada altera o estado deixando o loading false e altera o estado do error.
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default: // Se nada acontecer retorna somente o estado atual.
      return state;
  }
}
```

Lembrando que os reducers ficam separados em cada pasta em no **arquivo index unimos todos com o combine reducer**

```tsx
import { combineReducers } from "redux";

import { loadingBarReducer } from "react-redux-loading-bar"; // Biblioteca de barra de loading

import { userReducer } from "./user";

const rootReucer = combineReducers({
  user: userReducer,
  loadingBar: loadingBarReducer, // Barra de loading para quando fizer o request na API.
});

export default rootReucer;
```

Importante ressaltar que o reducer sempre tem esse formato, no geral.

```tsx
export function myReducer(
 state = initialState,
 action: { type: string; payload: MyType }
) {
  ...
}
```

- Por fim, podemos definir o sagas, que é o que estamos procurando e o que é diferente neste caso.

```tsx
import { all, call, put, takeLatest } from "@redux-saga/core/effects";

import { hideLoading, showLoading } from "react-redux-loading-bar"; // Somente para barra de loading.

import api from "src/services/api"; Explicado abaixo

import { UserType } from "src/redux/@types/user";
import { getUserFailure, getUserSuccess } from "src/redux/actions";
import { GET_USER_REQUEST } from "src/redux/@types";

let userApi: UserType; // Definição do user que irá vim da API.

async function userRequest(login: string) { // Função que faz a requisição na API.
  const config = { // Configurações de token (se tiver)
    headers: { Authorization: "Bearer token" },
  };
  try { // Tenta fazer a requisição na API.
    const request: any = await api.get(`/user?login=${login}`, config);
    if (request.data.length > 0) userApi = request.data[0]; // A API retorna um array de usuários, dai verifica se tem dados nesse array, caso tenha os dados são passados para a variável userApi
    else userApi = {} as any; // Caso contrário passamos um objeto vazio.
    return true; // Se tudo der certo retorna true.
  } catch {
    return false; // Se de errado retorna false.
  }
}

export function* userData(action: { type: string; payload: string }) { // Função construtora, onde a mesma é construída passo a passo (como async await) com o yield sendo como se fosse um ponto de parada, não executa o resto enquanto não executar ele.
  yield put(showLoading()); // Primeiro faz a requisição para começar a loading bar executar
  try {
    yield call(userRequest, action.payload); // Faz a chamada na API com a função de chamada.
    yield put(getUserSuccess(userApi)); // Se for sucesso passa o valor para a action success que passará para o reducer.
  } catch (e) {
    yield put(getUserFailure(`Erro na requisição ${e}`)); // Se for falha passa o valor do erro para a action failure que passará para o reducer.
  } finally {
    yield put(hideLoading()); // Independente do sucesso ou falha ele para a loading bar
  }
}

export default all([takeLatest(GET_USER_REQUEST, userData)]); // Chama o reducer request com a funcão de request do sagas sendo definida.
```

As requisições são feitas na API que é configurada com axios.

```tsx
import axios from "axios";

const api = axios.create({ // Configura a URL base da API.
  baseURL: "http://api-url:api-port/",
});

export default api;
```

O sagas também tem um arquivo root que une todos sagas criados.

```tsx
import { all } from "redux-saga/effects";

import user from "./user";

export default function* rootSaga(): Generator<any> { // Exporta todos sagas e suas funções.
  return yield all([user]);
}
```

- Por fim, **criamos o store** que é **responsável por unir todo conjunto criado** anteriormente. Como o nome diz, é a “loja” do redux, onde temos tudo que precisamos sendo unido em um lugar só.

```tsx
import { Store, AnyAction } from "redux";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { configureStore } from "@reduxjs/toolkit"; // A partir do toolkit usa-se a configureStore e não mais a createStore do redux core.

import createSagaMiddleware from "@redux-saga/core"; // Para criar o middleware com a função sagas criada.

import rootReucer from "src/redux/reducers";
import rootSaga from "src/redux/sagas";
import { AppDispatch, RootState } from "src/redux/@types/store";

const sagaMiddleware = createSagaMiddleware(); 

const store: Store<unknown, AnyAction> = configureStore({ // Função que configura o store passando para ele o rootReducer que une todos nossos reducers e o sagaMiddleware que irá rodar o rootSagas criado
  reducer: rootReucer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga); // Roda o rootSaga com todas funções do sagas criada anteriormente.

export default store;

export * from "./actions";
export * from "./@types";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // useAppSelector para obter o state do user
export const useAppDispatch = () => useDispatch<AppDispatch>(); // useAppDispatch para executar os dispatch na aplicação.
```

---

O ultimo passo é entender como obter e alterar esses dados na aplicação.

Primeiro **na index.tsx** temos que **passar nosso store dentro do Provider**.

```tsx
import React from "react";

import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import LoadingBar from "react-redux-loading-bar";

import store from "src/redux";

import "./index.css";

import { App } from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}> // Essa linha passa todo nosso store para aplicação. 
    <BrowserRouter>
      <LoadingBar />
      <App />
    </BrowserRouter>
  </Provider>
);
```

Com isso para **usar na aplicação** basta **chamar o request com dispatch** e **obter os dados com selector**.

```tsx
import * as React from "react";

import "./User.styles.css";

import { getUserRequest, useAppDispatch, useAppSelector } from "src/redux";
import { UserState } from "src/redux/@types/user";
import { Link } from "react-router-dom";

function User() {
  const dispatch = useAppDispatch(); // Chama o dispatch
  const userState: UserState = useAppSelector((state) => state.user); // Obtem o state do user, começa vazio e vai se alterando, aqui também tem o loading que pode ser usado dependendo da situação. 
  const { user, loading } = userState; // Obtem o user e o loading

  function handleGetUser(e: React.FormEvent<HTMLFormElement>) { // Função para obter os dados
    e.preventDefault();
    dispatch(getUserRequest(e.currentTarget.login.value)); // Dispatch para chamar o request
  }
	
	return ( ... )
}
```

---

Alguns pontos importantes:

- Por que Redux Sagas não Context API? Com a context api você não consegue monitorar o que está acontecendo na requisição (carregando, falhou, sucesso).
- Função com asterisco são funções geradoras (generator) que executa cada processo da função:

```tsx
export default function* rootSaga
```

- API criada com json-server, onde o server.js é o seguinte:

```
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("./backend/server.json");
const middlewares = jsonServer.defaults();

function isAuthorized(value) {
  if (value === "Bearer teste-token") return true;

  return false;
}

server.use(middlewares);

server.use((req, res, next) => {
  if (isAuthorized(req.headers.authorization)) {
    setTimeout(async () => {
      next();
    }, 2000);
  } else {
    res.sendStatus(401);
  }
});

server.use(router);

server.listen(3333, () => {
  console.log("JSON Server is running");
});
```

E o server.json é definido da forma:

```json
{
  "user": [
    {
      "id": "123456",
      "login": "lejoaoconte",
      "password": "falajoao",
      "avatarURL": "https://github.com/lejoaoconte.png",
      "name": "João Pedro conte",
      "telefone": "(32) 99958-4808",
      "email": "lejoaoconte@gmail.com"
    }
  ]
}
```

Para chamar a API basta adicionar a linha nos scripts:

```json
"server": "node ./backend/server.js”
```

- Bibliotecas para instalar:

```bash
yarn add axios redux redux-saga @reduxjs/toolkit react-redux-loading-bar react-redux 
yarn add -D json-server
```
