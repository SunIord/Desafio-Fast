# Setup — Workshop Tracker

Guia completo para instalar dependências, configurar o ambiente e rodar o projeto localmente (backend + frontend).

---

## 1. Pré-requisitos

- **.NET SDK 8.0** (LTS)
- **Node.js 20.x** + npm
- **MySQL 8.x** (servidor rodando localmente ou acessível)
- **Git**

### Instalação — Linux / macOS / WSL (Ubuntu)

```bash
# .NET SDK 8
wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
sudo apt update
sudo apt install dotnet-sdk-8.0

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Git
sudo apt install git

# MySQL (se ainda não tiver)
sudo apt install mysql-server
```

### Instalação — Windows (PowerShell)

```powershell
# .NET SDK 8 — baixar o instalador em:
# https://dotnet.microsoft.com/download/dotnet/8.0

# Node.js 20 — baixar o instalador em:
# https://nodejs.org (versão LTS 20.x)

# Git — baixar o instalador em:
# https://git-scm.com/download/win

# MySQL — baixar o MySQL Installer em:
# https://dev.mysql.com/downloads/installer/
```

### Verificar instalação (ambos os ambientes)

```bash
dotnet --version   # deve retornar 8.x
node --version     # deve retornar v20.x
npm --version
git --version
mysql --version
```

> **Nota sobre WSL:** se você instalou o .NET SDK dentro do WSL (Ubuntu), lembre-se de sempre abrir um terminal **WSL** para rodar o backend — comandos `dotnet` não funcionam a partir de um terminal Git Bash/PowerShell nativo do Windows, pois são ambientes de shell separados. Rode `wsl` antes de navegar até o projeto se estiver em outro shell.

---

## 2. Clonar o repositório

```bash
git clone https://github.com/SunIord/Desafio-Fast.git
cd Desafio-Fast
code . # VS Code
exit
```

---

## 3. Backend — configuração do banco de dados

O banco precisa ser criado **manualmente** antes de rodar a aplicação — não há criação automática.

### 3.1 Criar o banco

Acesse o MySQL e crie o database:

```sql
CREATE DATABASE WorkshopTracker;
```

### 3.2 Criar as tabelas — caminho recomendado (EF Core Migrations)

As migrations do EF Core funcionam neste projeto, desde que os pacotes estejam na versão correta.

**Passos para usar migrations:**

1. Instale a ferramenta `dotnet-ef` na versão 8.0.11:
```bash
dotnet tool install --global dotnet-ef --version 8.0.11
```

2. Certifique-se de que o projeto está com os pacotes na versão 8.0.11:
```bash
cd backend/WorkshopTracker.API
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.11
dotnet add package Microsoft.EntityFrameworkCore.Relational --version 8.0.11
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.11
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.2
dotnet restore
```

3. Execute a migration:
```bash
dotnet ef database update
```

Observações:

- A migration cria as tabelas com os nomes definidos no código (`Colaboradores`, `Workshops`, `Presencas`, `Usuarios`), mas no MySQL (Windows) elas podem aparecer em minúsculas (`colaboradores`, `workshops`, etc.) — isso não afeta o funcionamento.
- O seed do usuário `admin/admin123` já está incluso na migration.
- A migration **não** insere dados de demonstração (workshops, colaboradores). Para isso, execute o script de dados de demonstração logo abaixo.
- Se as migrations não funcionarem no seu ambiente, use o caminho alternativo do SQL manual (seção 3.3).

**Para popular com dados de demonstração (opcional, recomendado):**

Depois de rodar a migration, execute o script de dados de demonstração:

**No Git Bash (MSYS2):**
```bash
"C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p WorkshopTracker --default-character-set=utf8mb4 < scripts/seed-data.sql
```

**No PowerShell:**
```powershell
Get-Content scripts/seed-data.sql -Encoding UTF8 | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p WorkshopTracker --default-character-set=utf8mb4
```

**No WSL/Linux:**
```bash
mysql -u root -p WorkshopTracker --default-character-set=utf8mb4 < scripts/seed-data.sql
```

### 3.3 Criar as tabelas — alternativa (SQL manual)

Caso as migrations não funcionem no seu ambiente, execute o script `scripts/create-tables.sql` diretamente no banco recém-criado. O comando varia conforme o ambiente:

**No Git Bash (MSYS2):**
```bash
"C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p WorkshopTracker < scripts/create-tables.sql
```

**No PowerShell:**
```powershell
Get-Content scripts/create-tables.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p WorkshopTracker
```

**No WSL/Linux:**
```bash
mysql -u root -p WorkshopTracker < scripts/create-tables.sql
```

> O caminho do MySQL pode variar dependendo da instalação. Se o seu MySQL estiver em outro diretório, ajuste o caminho do executável (`mysql.exe`) conforme necessário.

O script completo está em `scripts/create-tables.sql`. Ele cria as tabelas `colaboradores`, `workshops`, `presencas`, `usuarios` e insere o usuário padrão `admin/admin123`.

**Para popular com dados de demonstração:**

Após criar as tabelas, execute o script de dados de demonstração:

**No Git Bash (MSYS2):**
```bash
"C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p WorkshopTracker --default-character-set=utf8mb4 < scripts/seed-data.sql
```

**No PowerShell:**
```powershell
Get-Content scripts/seed-data.sql -Encoding UTF8 | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p WorkshopTracker --default-character-set=utf8mb4
```

**No WSL/Linux:**
```bash
mysql -u root -p WorkshopTracker --default-character-set=utf8mb4 < scripts/seed-data.sql
```

---

## 4. Backend — configuração da aplicação

### 4.1 Connection string e chave JWT

Dentro de `backend/WorkshopTracker.API/`, crie o arquivo `appsettings.Development.json` — **este arquivo não é versionado**:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=WorkshopTracker;User=root;Password=<sua_senha>;"
  },
  "Jwt": {
    "Key": "<sua_chave_secreta_com_no_minimo_32_caracteres>",
    "Issuer": "WorkshopTracker.API",
    "Audience": "WorkshopTracker.Clients",
    "ExpireMinutes": 60
  },
  "FrontendOrigin": "http://localhost:5173"
}
```

> Ajuste `FrontendOrigin` se o Vite estiver rodando em outra porta — esse valor é usado na configuração de CORS do backend.

Exemplo local usado em desenvolvimento (senha `root123`):
```json
"DefaultConnection": "Server=localhost;Database=WorkshopTracker;User=root;Password=root123;"
```

### 4.2 Rodar o backend

```bash
cd backend/WorkshopTracker.API
dotnet restore
dotnet run
```

A API deve subir em `http://localhost:5187` (a porta exata aparece no terminal — pode variar por ambiente). Acesse `http://localhost:5187/swagger` para confirmar que está no ar e testar os endpoints diretamente.

### 4.3 Login padrão

Use as credenciais do usuário admin, criadas automaticamente pela migration ou pelo script `create-tables.sql` (seção 3.2 ou 3.3, conforme o caminho escolhido) para autenticar:
```
Username: admin
Password: admin123
```

---

## 5. Frontend — configuração e execução

### 5.1 Variável de ambiente

Dentro de `frontend/`, copie o exemplo e ajuste se necessário:

```bash
cd frontend
cp .env.example .env
```

Conteúdo esperado do `.env`:
```
VITE_API_URL=http://localhost:5187/api
```

> Se o backend estiver rodando em outra porta, ajuste esse valor de acordo.

### 5.2 Instalar dependências e rodar

```bash
npm install
npm run dev
```

O frontend deve subir em `http://localhost:5173`.

---

## 6. Rodando tudo junto

São dois processos separados, cada um em seu próprio terminal:

**Terminal 1 — backend:**
```bash
cd backend/WorkshopTracker.API
dotnet run
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```

Com os dois rodando, acesse `http://localhost:5173` no navegador. As telas de listagem (Colaboradores, Workshops, Participação) funcionam sem login. Para criar, editar ou excluir registros, faça login em `/login` com `admin` / `admin123`.

---

## 7. Testes de API (smoke test)

Um script de validação ponta a ponta da API está disponível em `tests/api-smoke-test.sh`. Com o backend rodando, execute na raiz do projeto:

**No Git Bash / WSL / Linux:**
```bash
chmod +x tests/api-smoke-test.sh
./tests/api-smoke-test.sh
```

**No PowerShell:**
```powershell
bash tests/api-smoke-test.sh
```
> Requer o Git Bash instalado e `bash.exe` disponível no PATH do Windows (instalado junto com o Git para Windows). Se o comando não for reconhecido, abra um terminal Git Bash e rode o script por lá em vez do PowerShell.

Requer `curl` e `jq` instalados. Se o backend estiver em outra porta, passe como argumento:
```bash
./tests/api-smoke-test.sh http://localhost:5187/api
```

---

## 8. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `dotnet: command not found` | Terminal errado (Git Bash/PowerShell em vez de WSL, se o SDK foi instalado lá) | Abra um terminal WSL antes de rodar comandos `dotnet` |
| Erro de CORS no navegador | Origem do frontend não corresponde à configurada no backend | Confira `FrontendOrigin` em `appsettings.Development.json` — deve bater com a porta real do Vite |
| `401 Unauthorized` em endpoints de leitura | Não deveria ocorrer — `GET` é público | Confirme que está usando a versão atual dos controllers (sem `[Authorize]` nos métodos `GET`) |
| `TypeLoadException` (`Method 'Identifier'`) ao rodar `dotnet ef database update` | `dotnet-ef` e os pacotes `Microsoft.EntityFrameworkCore.*` estão em versões diferentes | Alinhe todos na versão 8.0.11 conforme seção 3.2, ou use o SQL manual (seção 3.3) |
| Erro de certificado HTTPS ao acessar a API pelo navegador | Certificado de desenvolvimento não confiável | Rode `dotnet dev-certs https --trust` |