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

### 3.2 Criar as tabelas — caminho recomendado (SQL manual)

Este é o caminho utilizado no desenvolvimento deste projeto (mais confiável — veja a nota sobre migrations abaixo). Execute o script em `scripts/create-tables.sql` contra o banco recém-criado:

```bash
mysql -u root -p WorkshopTracker < scripts/create-tables.sql
```

Conteúdo de referência do script (confirme que bate com `scripts/create-tables.sql` do repositório — ajuste aqui se o arquivo real tiver diferenças):

```sql
CREATE TABLE Colaboradores (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL
);

CREATE TABLE Workshops (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    DataRealizacao DATETIME NOT NULL,
    Descricao TEXT NOT NULL
);

CREATE TABLE Presencas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    WorkshopId INT NOT NULL,
    ColaboradorId INT NOT NULL,
    DataRegistro DATETIME NOT NULL,
    CONSTRAINT FK_Presencas_Workshops FOREIGN KEY (WorkshopId) REFERENCES Workshops(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_Presencas_Colaboradores FOREIGN KEY (ColaboradorId) REFERENCES Colaboradores(Id) ON DELETE RESTRICT,
    CONSTRAINT UQ_Presencas_Workshop_Colaborador UNIQUE (WorkshopId, ColaboradorId)
);

CREATE TABLE Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Usuário padrão para login (username: admin / senha: admin123)
-- O hash abaixo deve ser gerado via BCrypt.Net.BCrypt.HashPassword("admin123")
-- e substituído aqui antes de rodar o script.
INSERT INTO Usuarios (Username, PasswordHash) VALUES ('admin', '<hash_gerado_via_bcrypt>');
```

### 3.3 Caminho alternativo — EF Core Migrations

Não utilizado neste projeto por conflito de versões entre pacotes durante o desenvolvimento, mas é o caminho padrão do EF Core caso funcione no seu ambiente:

```bash
dotnet tool install --global dotnet-ef
cd backend/WorkshopTracker.API
dotnet ef database update
```

Se esse comando falhar com erro de conflito de versão (`TypeLoadException` ou similar), use o caminho do SQL manual (seção 3.2) em vez de tentar corrigir a migration.

---

## 4. Backend — configuração da aplicação

### 4.1 Connection string e chave JWT

Dentro de `backend/WorkshopTracker.API/`, crie (ou edite) o arquivo `appsettings.Development.json` — **este arquivo não é versionado** (está no `.gitignore`):

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
  }
}
```

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

Use as credenciais criadas no seed (seção 3.2) para autenticar:
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

Um script de validação ponta a ponta da API está disponível em `tests/api-smoke-test.sh`. Com o backend rodando:

```bash
chmod +x tests/api-smoke-test.sh
./tests/api-smoke-test.sh
```

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
| `TypeLoadException` ao rodar `dotnet run` | Conflito de versão entre `Microsoft.AspNetCore.OpenApi` e `Microsoft.OpenApi` (bug conhecido do template padrão) | Certifique-se de que o projeto foi criado com `--use-controllers` (Swashbuckle), não Minimal API |
| Erro de certificado HTTPS ao acessar a API pelo navegador | Certificado de desenvolvimento não confiável | Rode `dotnet dev-certs https --trust` |