# Workshop Tracker — FAST Soluções

Sistema de rastreamento de participação em workshops trimestrais, desenvolvido como desafio técnico full-stack. Permite listar workshops e colaboradores, consultar detalhes de presença por evento e visualizar métricas de participação ao longo do tempo.

## Sobre o desafio

Na FAST Soluções, workshops trimestrais reúnem colaboradores para aprendizado e troca sobre desenvolvimento de software. Este projeto entrega uma interface para o comitê organizador acompanhar, de forma detalhada, a participação dos colaboradores em cada evento.

## Stack

**Backend**
- C# / .NET 8 (Web API, Controllers)
- Entity Framework Core + Pomelo (MySQL)
- Autenticação JWT + BCrypt
- Swagger / Swashbuckle

**Frontend**
- React + Vite
- React Router
- Recharts (gráficos de participação)
- CSS modular

## Funcionalidades

- CRUD completo de Workshops (`/api/workshops`)
- CRUD completo de Colaboradores (`/api/colaboradores`)
- Autenticação JWT: leitura pública, escrita autenticada
- Tela de listagem de colaboradores
- Tela de listagem de workshops
- Detalhe de workshop, com lista de colaboradores presentes
- Gráficos de participação (participação por colaborador, proporção de presenças por workshop, evolução no tempo)

## Como rodar o projeto

Instruções completas de instalação, configuração de ambiente e execução (backend + frontend) estão em [`docs/setup.md`](docs/setup.md).

## Documentação

- [`docs/setup.md`](docs/setup.md) — passo a passo de instalação e execução local
- [`docs/api.md`](docs/api.md) — contrato completo dos endpoints da API
- [`docs/decisions/`](docs/decisions/) — ADRs com as decisões técnicas tomadas ao longo do projeto

## Repositório

https://github.com/SunIord/Desafio-Fast