# Custos 🛡️ | Sistema de Gestão e Autenticação

**Custos** (do Latim: Guardião, Vigilante) é um sistema robusto de autenticação e gerenciamento de usuários desenvolvido com foco em Engenharia de Software e Práticas de POO (Programação Orientada a Objetos).

O projeto simula um ambiente real de controle de acessos (RBAC), permitindo desde o cadastro de usuários comuns até a gestão administrativa de contas, tudo com persistência de dados local.

---

## 🚀 Funcionalidades Principais

- **Autenticação Segura (Simulada):** Sistema de login e registro com validação de credenciais e proteção de dados sensíveis.
- **Controle de Acesso Baseado em Cargos (RBAC):**
    - **Usuário:** Gerencia seu próprio perfil e localização.
    - **Administrador:** Acesso exclusivo a um painel de controle para monitorar e deletar contas do sistema.
- **Persistência Inteligente:** Utilização da LocalStorage API com lógica de re-instanciação de classes, garantindo que os métodos de negócio (como a verificação de hash) sejam restaurados após o carregamento dos dados JSON.
- **Interface Dinâmica:** UI moderna com Tailwind CSS, incluindo transições de estado, animações de feedback visual (shake em erros) e modais interativas.

## 🛠️ Stack Tecnológica

- **HTML5 & CSS3:** Base estrutural e estilização customizada.
- **TypeScript:** Linguagem principal para garantir tipagem estática e segurança lógica.
- **Tailwind CSS:** Framework utilitário para design responsivo e ágil via CDNs.
- **Bootstrap Icons:** Biblioteca de ícones para melhoria da experiência do usuário (UX).
- **LocalStorage API:** Persistência de dados client-side para simulação de banco de dados.

## 🏗️ Arquitetura e Padrões de Projeto

O projeto foi estruturado para demonstrar domínio em:

1. **Encapsulamento e DTOs:** Uso de modificadores `private`, `protected` e utilitários de tipo como `Pick<UserDTO>` para garantir que informações sensíveis (hashes de senha) não cheguem à camada de visualização.
2. **Herança e Especialização:** O `UserService` estende o `AuthService`, separando responsabilidades de autenticação básica de operações avançadas de gestão de conta.
3. **Singleton-like Services:** Implementação de membros estáticos para gerenciamento global do estado da aplicação sem necessidade de múltiplas instâncias.
4. **Logging customizado:** Classe `Logger` para monitoramento de eventos do sistema com suporte a cores no console, facilitando o debug em tempo de desenvolvimento.

---

## 📦 Como Instalar e Rodar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/AntonioSena0/Custos.git
    ```

2. **Abra o projeto: Como o projeto utiliza CDNs para Tailwind e Bootstrap Icons, basta abrir o arquivo index.html em qualquer navegador ou utilizar a extensão Live Server do VS Code para uma melhor experiência.**

### Credenciais de Administrador Padrão:

- **E-mail:** `admin@custos.com`
- **Senha:** `admin123456`

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usar, estudar e modificar.

*Desenvolvido com ☕ por Antonio Sena.*