# Minha Produtividade

Este é um aplicativo de produtividade para empresas desenvolvido em **React Native** com **Firebase** para gerenciamento de atividades diárias dos funcionários. O administrador pode gerenciar funcionários, setores, atividades e visualizar relatórios de desempenho e atividades realizadas. 

## Funcionalidades

### Para Funcionários:
- **Login:** Os funcionários podem fazer login com e-mail e senha.
- **Registro de Atividades:** Funcionários podem registrar suas atividades diárias, selecionando entre opções de atividades predefinidas ou criadas pelo administrador.
- **Consulta de Atividades:** Funcionários podem visualizar suas atividades realizadas em uma data específica.
- **Registro de Tempo:** Inclui o tempo de início e término da atividade, calculando automaticamente a duração total.

### Para Administradores:
- **Área de Administração:** Acesso exclusivo para o administrador gerenciar o sistema.
- **Criação de Setores:** Adicionar setores para organizar os funcionários.
- **Criação de Atividades por Setor:** Definir atividades específicas para cada setor.
- **Gerenciamento de Funcionários:** Adicionar novos funcionários, associando-os aos setores.
- **Visualização de Atividades por Funcionário:** Ver todas as atividades registradas por cada funcionário em uma faixa de datas.
- **Relatório de Atividades:** Mostrar as atividades realizadas por todos os funcionários de um setor, com somatório por atividade.

## Tecnologias Utilizadas

- **React Native:** Para o desenvolvimento da interface do aplicativo.
- **Expo:** Ambiente de desenvolvimento para aplicativos React Native.
- **Firebase Authentication:** Para autenticação de funcionários e administradores.
- **Firebase Firestore:** Banco de dados NoSQL para armazenar atividades, setores, e informações dos funcionários.
- **React Navigation:** Para navegação entre as telas do aplicativo.
- **DateTimePicker:** Para seleção de datas e horários de atividades.

## Requisitos

- **Node.js**: Versão 14.x ou superior
- **Expo CLI**: Deve ser instalado globalmente
- **Firebase**: Contas configuradas com Firebase Authentication e Firestore
- **@react-native-picker/picker**: Para menus suspensos de seleção (Picker)
- **@react-native-community/datetimepicker**: Para seleção de datas e horários

## Instalação e Configuração

1. Clone o repositório:
    ```bash
    git clone https://github.com/usuario/minhaprodutividade.git
    cd minhaprodutividade
    ```

2. Instale as dependências do projeto:
    ```bash
    npm install
    ```

3. Configure o Firebase:
   - No arquivo `firebase.js`, configure as suas credenciais do Firebase.
   - Habilite **Authentication** e **Firestore** no console do Firebase.

4. Inicie o projeto com Expo:
    ```bash
    npx expo start
    ```

## Estrutura do Projeto

```plaintext
.
├── App.js                     # Arquivo principal que define a navegação
├── firebase.js                 # Configuração do Firebase
├── assets/
│   └── logo.png                # Imagem do logo
├── screens/
│   ├── LoginScreen.js          # Tela de login de funcionários
│   ├── RegisterScreen.js       # Tela de registro de funcionários (acessada apenas pelo admin)
│   ├── AdminLoginScreen.js     # Tela de login para administradores
│   ├── AdminOptionsScreen.js   # Tela de opções de administração
│   ├── AdminDashboard.js       # Tela com lista de funcionários por setor
│   ├── ActivitiesCreationScreen.js  # Tela para o admin criar atividades
│   ├── SectorCreationScreen.js      # Tela para o admin criar setores
│   ├── ViewActivitiesScreen.js      # Tela para os funcionários visualizarem atividades
│   ├── EmployeeActivitiesScreen.js  # Tela para o admin visualizar atividades dos funcionários
│   └── AdminGraphicScreen.js        # Tela para o admin visualizar atividades somadas por funcionário
└── README.md                 # Documentação do projeto
