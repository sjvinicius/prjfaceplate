# 🚀 Projeto Next.js – Guia de Execução

Este projeto foi desenvolvido utilizando o **Next.js**, um framework React moderno para construção de aplicações web.

Este guia foi feito para ajudar você a executar o projeto localmente de forma simples.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

* **Node.js (versão 18 ou superior recomendada)**
* Um gerenciador de pacotes:

  * npm (já vem com o Node)
  * ou yarn / pnpm / bun

Para verificar se está tudo instalado corretamente:

```bash
node -v
npm -v
```

---

## ▶️ Como executar o projeto

### 1. Instalar as dependências

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

Ou, se preferir:

```bash
yarn install
# ou
pnpm install
# ou
bun install
```

---

### 2. Iniciar o servidor de desenvolvimento

Execute um dos comandos:

```bash
npm run dev
```

Ou:

```bash
yarn dev
# ou
pnpm dev
# ou
bun dev
```

---

## 🌐 Acessando a aplicação

Após iniciar o servidor, abra o navegador e acesse:

```id="url-local"
http://localhost:3000
```

---

## 🛠️ Tecnologias utilizadas

* Next.js
* React
* TypeScript
* next/font (otimização de fontes)

---

## 📦 Build para produção

Se quiser gerar a versão de produção:

```bash
npm run build
npm start
```

---

## ❗ Problemas comuns

### 🔸 "node não reconhecido"

Verifique se o Node.js está instalado e no PATH.

### 🔸 Erro ao instalar dependências

Tente limpar o cache e reinstalar:

```bash
npm cache clean --force
npm install
```

### 🔸 Porta já em uso

Se a porta 3000 estiver ocupada, o Next.js irá sugerir outra automaticamente.

---

## 💡 Observação

Este projeto roda em modo de desenvolvimento com `npm run dev`.
Para uso real (produção), utilize `npm run build` + `npm start`.

---

Se tiver dúvidas, siga os passos com calma ou peça ajuda ao responsável pelo projeto 🙂
