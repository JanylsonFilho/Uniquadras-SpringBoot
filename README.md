# UniQuadras-SpringBoot

## 🚀 UniQuadras: Sistema de Reservas de Quadras Esportivas

O UniQuadras é uma aplicação full-stack desenvolvida para simplificar a gestão e reserva de quadras esportivas. Combina um backend robusto em Spring Boot, um frontend interativo em HTML, CSS e JavaScript puro (com Bootstrap), e um microsserviço de notificação independente para enviar confirmações por e-mail.

### ✨ Principais Funcionalidades

* **Gestão de Usuários:** Cadastro, login seguro com senhas criptografadas, e controle de acesso por perfil (usuário comum/administrador).
* **Gerenciamento de Quadras:** Funções CRUD completas para administradores, incluindo adição, edição e remoção de quadras e suas informações (nome, tipo, status, localização). A exclusão de quadras remove automaticamente os horários e reservas relacionadas.
* **Reservas de Horários:** Usuários podem visualizar a disponibilidade, selecionar quadras, datas e horários. O status do horário é atualizado em tempo real para evitar conflitos. Usuários podem consultar e cancelar suas próprias reservas.
* **Notificações:** Um microsserviço dedicado envia confirmações de reserva por e-mail, garantindo comunicação instantânea com o usuário.

### 🛠️ Tecnologias

* **Backend:** Java 17, Spring Boot (JPA, Security, Events), PostgreSQL (Supabase), Maven.
* **Frontend:** HTML5, CSS3 (SASS), JavaScript (ES6+), Bootstrap 5.3.5, Bootstrap Icons, Vite.
* **Microsserviço de Notificação:** Spring Boot Mail.

### ⚙️ Como Rodar

#### **Pré-requisitos:**

* JDK 17+
* Maven
* Node.js e npm (ou Yarn)
* Banco de dados PostgreSQL
* Credenciais de e-mail SMTP (para o serviço de notificação)

#### **Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/Uniquadras-SpringBoot.git](https://github.com/seu-usuario/Uniquadras-SpringBoot.git)
    cd Uniquadras-SpringBoot
    ```
2.  **Configurações:**
    * `UNIQUADRAS-SpringBoot/uniquadras/backend/src/main/resources/application.properties`: Ajuste as credenciais do PostgreSQL.
    * `notification-service/src/main/resources/application.properties`: Configure seu servidor SMTP (email).
3.  **Inicie o Backend Principal:**
    ```bash
    cd UNIQUADRAS-SpringBoot/uniquadras/backend
    mvn clean install
    mvn spring-boot:run
    ```
    (Disponível em `http://localhost:8080`)
4.  **Inicie o Microsserviço de Notificação:**
    ```bash
    cd ../../../notification-service # Volta para a raiz e entra no notification-service
    mvn clean install
    mvn spring-boot:run
    ```
    (Disponível em `http://localhost:8082`)
5.  **Inicie o Frontend:**
    ```bash
    cd ../UNIQUADRAS-SpringBoot/uniquadras # Volta para a pasta do frontend
    npm install
    npm run dev
    ```
    (Disponível em `http://localhost:5173`)


### 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

## 🇺🇸 English Version

# UniQuadras-SpringBoot

## 🚀 UniQuadras: Comprehensive Sports Court Booking System

UniQuadras is a full-stack application designed to streamline the management and booking of sports courts. It combines a robust Spring Boot backend, an interactive HTML, CSS, and pure JavaScript frontend (with Bootstrap), and a separate notification microservice for sending email confirmations.

### ✨ Key Features

* **User Management:** Secure user registration with encrypted passwords, login functionality, and role-based access control (regular user/administrator).
* **Court Management:** Full CRUD operations for administrators, including adding, editing, and removing courts and their details (name, type, status, location). Deleting a court automatically removes associated schedules and bookings.
* **Scheduling and Bookings:** Users can view availability and book courts by type, sport, date, and time slot. Real-time status updates prevent double bookings. Users can view and cancel their own bookings.
* **Notifications:** A dedicated microservice sends automated booking confirmation emails, ensuring instant communication with users.

### 🛠️ Technologies Used

* **Backend:** Java 17, Spring Boot (JPA, Security, Events), PostgreSQL (Supabase), Maven.
* **Frontend:** HTML5, CSS3 (SASS), JavaScript (ES6+), Bootstrap 5.3.5, Bootstrap Icons, Vite.
* **Notification Microservice:** Spring Boot Mail.

### ⚙️ How to Run the Project

#### **Prerequisites:**

* Java Development Kit (JDK) 17 or higher
* Maven
* Node.js and npm (or Yarn) for the frontend
* Access to a PostgreSQL database
* SMTP email credentials (for the notification service)

#### **Steps:**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/Uniquadras-SpringBoot.git](https://github.com/your-username/Uniquadras-SpringBoot.git)
    cd Uniquadras-SpringBoot
    ```
2.  **Configuration:**
    * `UNIQUADRAS-SpringBoot/uniquadras/backend/src/main/resources/application.properties`: Update your PostgreSQL database credentials.
    * `notification-service/src/main/resources/application.properties`: Configure your SMTP server (email).
3.  **Start the Main Backend Service:**
    ```bash
    cd UNIQUADRAS-SpringBoot/uniquadras/backend
    mvn clean install
    mvn spring-boot:run
    ```
    (Available at `http://localhost:8080`)
4.  **Start the Notification Microservice:**
    ```bash
    cd ../../../notification-service # Navigate back to root and into notification-service
    mvn clean install
    mvn spring-boot:run
    ```
    (Available at `http://localhost:8082`)
5.  **Start the Frontend:**
    ```bash
    cd ../UNIQUADRAS-SpringBoot/uniquadras # Navigate back to the frontend folder
    npm install
    npm run dev
    ```
    (Available at `http://localhost:5173`)


### 📄 License

This project is licensed under the MIT License.
