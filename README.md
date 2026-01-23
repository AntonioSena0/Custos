<details open>
<summary><b>Portuguese Version</b></summary>

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

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

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

### Live Demo:

- **[Veja o Projeto Online](https://antoniosena0.github.io/Custos/)**

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usar, estudar e modificar.

*Desenvolvido com ☕ por Antonio Sena.*

</details>

<details>
<summary><b>English Version</b></summary>

# Custos 🛡️ | Management and Authentication System

**Custos** (Latin for: Guardian, Watchman) is a robust authentication and user management system developed with a focus on **Software Engineering** and **OOP (Object-Oriented Programming) Practices**.

The project simulates a real-world Access Control (RBAC) environment, allowing everything from standard user registration to administrative account management, all with local data persistence.

---

## 🚀 Key Features

- **Secure Authentication (Simulated):** Login and registration system with credential validation and sensitive data protection.
- **Role-Based Access Control (RBAC):**
    - **User:** Manages their own profile and location.
    - **Administrator:** Exclusive access to a control panel to monitor and delete system accounts.
- **Smart Persistence:** Utilizes the LocalStorage API with class re-instantiation logic, ensuring that business methods (such as hash verification) are restored after loading JSON data.
- **Dynamic Interface:** Modern UI with Tailwind CSS, including state transitions, visual feedback animations (shake on error), and interactive modals.

## 🛠️ Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 🏗️ Architecture & Design Patterns

The project was structured to demonstrate proficiency in:

1. **Encapsulation and DTOs:** Use of `private` and `protected` modifiers along with type utilities like `Pick<UserDTO>` to ensure sensitive information (password hashes) doesn't leak to the view layer.
2. **Inheritance and Specialization:** `UserService` extends `AuthService`, decoupling basic authentication responsibilities from advanced account management operations.
3. **Singleton-like Services:** Implementation of static members for global application state management without the need for multiple instances.
4. **Custom Logging:** A `Logger` class for monitoring system events with console color support, facilitating debugging during development.

---

## 📦 How to Install and Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AntonioSena0/Custos.git
    ```

2. **Open the project:** Since the project uses CDNs for Tailwind and Bootstrap Icons, simply open the `index.html` file in any browser or use the VS Code **Live Server** extension for a better experience.

### Default Admin Credentials:

- **Email:** `admin@custos.com`
- **Password:** `admin123456`

---

### Live Demo:
- **[View Project Online](https://antoniosena0.github.io/Custos/)**

---

## 📄 License

This project is under the MIT license. Feel free to use, study, and modify it.

*Developed with ☕ by Antonio Sena.*

</details>
