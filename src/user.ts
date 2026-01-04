class Logger {

    //Mude para false caso use apenas a interface HTML
    private static isDebug = true;
    private static green = "\x1b[32m"
    private static red = "\x1b[31m"
    private static cyan = "\x1b[36m"
    private static reset = "\x1b[0m"

    static success(msg: string) {
        if(!this.isDebug) return
        console.log(`${this.green} [SUCCESS]: ${msg}${this.reset}`)
    }

    static error(msg: string) {
        if(!this.isDebug) return
        console.log(`${this.red} [ERROR]: ${msg}${this.reset}`)
    }

    static info(msg: string) {
        if(!this.isDebug) return
        console.log(`${this.cyan} [INFO]: ${msg}${this.reset}`)
    }

    static group(title: string) {
        if(!this.isDebug) return
        console.group(`\n=== ${title.toUpperCase()} ===`)
    }

    static groupEnd() {
        if(!this.isDebug) return
        console.groupEnd()
    }

}

type Roles = 'user' | 'admin'

interface UserDTO {
    name?: string
    email: string
    password: string
    location?: string
    role?: Roles
}

type PublicPerfil = Pick<UserDTO, 'name' | 'email' | 'location' | 'role'>

class Perfil {

    public name = ''
    protected email: string
    private passwordHash: string
    protected location = ''
    private role: Roles

    constructor(data: UserDTO, hashPronto?: string){
        this.name = data.name ?? ""
        this.email = data.email
        this.passwordHash = hashPronto ?? this.simpleHashPassword(data.password)
        this.location = data.location ?? ""
        this.role = data.role ?? 'user'
    }

    getName(): string {
        return this.name
    }

    setName(name: string): void {
        this.name = name
    }

    getEmail(): string {
        return this.email
    }

    setEmail(email: string): void {
        this.email = email
    }

    protected getPasswordHash(): string {
        return this.passwordHash
    }

    setPasswordHash(password: string): void {
        this.passwordHash = this.simpleHashPassword(password)
    }

    getLocation(): string {
        return this.location
    }

    setLocation(location: string): void {
        this.location = location
    }

    getRole(): Roles {
        return this.role
    }

    setRole(role: Roles): void {
        this.role = role
    }
 
    simpleHashPassword(pass: string): string {

        const hashedPass = `12345678910${pass}abcdefghij`

        return hashedPass

    }

    checkPassword(pass: string): boolean {
        const hashedPass = this.simpleHashPassword(pass)

        if(hashedPass === this.passwordHash) {
            return true
        }

        return false

    }

    public toJSON(): PublicPerfil {
        return {
            name: this.name,
            email: this.email,
            location: this.location,
            role: this.role
        }
    }

    public toSave() {

        return {

            name: this.name,
            email: this.email,
            passwordHash: this.passwordHash,
            location: this.location,
            role: this.role

        }

    }

}

class AuthService {
    protected static users: Perfil[] = []

    public static currentUser: Perfil | null = null

    static saveToStorage(): void {

        const data = this.users.map(user => user.toSave())

        localStorage.setItem('@Custos:users', JSON.stringify(data))

    }

    static loadFromStorage(): void {
        const storedData = localStorage.getItem('@Custos:users');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
    
                this.users = parsed.map((item: any) => {
                    return new Perfil({
                        name: item.name,
                        email: item.email,
                        password: "",
                        location: item.location,
                        role: item.role
                    }, item.passwordHash);
                });
            } catch (e) {
                Logger.error("Falha ao ler LocalStorage.");
            }
        }
    }

    static init() {

        this.loadFromStorage()

        const adminExists = this.users.find(u => u.getEmail() === "admin@custos.com")

        if(!adminExists) {

            this.register({

                name: "Administrador",
                email: "admin@custos.com",
                password: "admin123456",
                role: "admin",
                location: "Sede Central"

            })
            Logger.info("Admin padrão gerado automaticamente.");
        }

    }

    static register(data: UserDTO): Perfil | null {

        if(!data.email.includes('@')){
            Logger.info('Formato de email incorreto')
            return null
        }
        if(data.password.length < 8){
            Logger.info('Senha pequena demais')
            return null
        }
        const userExists = this.users.find(u => u.getEmail() === data.email)
        if(userExists){
            Logger.error('Email já cadastrado')
            return null
        }

        Logger.success('Usuário criado com sucesso')
        
        const user = new Perfil(data)
        this.users.push(user)

        this.saveToStorage()

        this.currentUser = user
        return user

    }

    static login(email: string, password: string): Perfil | null {
        
        const existingUser = this.users.find(u => u.getEmail() === email)
        if(!existingUser){
            Logger.error("Usuário não encontrado")
            return null
        }

        if(!existingUser.checkPassword(password)) {
            Logger.error("Senha inválida")
            return null
        }

        this.currentUser = existingUser

        Logger.success("Login realizado com sucesso")
        return existingUser

    }

}

class UserService extends AuthService{

    static listAll(): Perfil[]  {

        const data = this.users

        return data
        
    }

    static update(data: Partial<UserDTO>): Perfil | null {
        const user = this.currentUser
    
        if (!user) {
            Logger.error("Nenhum usuário logado para atualizar");
            return null;
        }

        if (user) {
            user.setName(data.name ?? user.getName());
            user.setLocation(data.location ?? user.getLocation());
            
            if (data.email != undefined) {
                if(!data.email.includes('@')){
                    Logger.info('Formato de email incorreto')
                    return null
                }
                const userExists = this.users.find(u => u.getEmail() === data.email)
                if(userExists && userExists.getEmail() != user.getEmail()){
                    Logger.error('Email já cadastrado')
                    return null
                }
                user.setEmail(data.email);
            }
    
            if (data.password != undefined) {
                if(data.password.length < 8) {
                    Logger.info('Senha pequena demais');
                    return null
                }
                user.setPasswordHash(data.password);
            }
    
            this.saveToStorage()

            Logger.success(`Dados atualizados`);
            return user;
        }
    
        return null;
    }

    static delete(): boolean{

        const user = this.currentUser

        if (!user) {
            Logger.error("Nenhum usuário logado para deletar");
            return false;
        }

        const index = this.users.findIndex(u => u.getEmail() === user.getEmail())

        if(index !== -1) {

            this.users.splice(index, 1)
            this.currentUser = null
            this.saveToStorage()
            Logger.success("Conta excluida com sucesso")
            return true

        }

    }

    static adminDelete(email: string): boolean {

        const existingUser = this.users.find(u => u.getEmail() === email)

        if(!existingUser) {

            Logger.error("Usuário não existe para deletar");
            return false;

        }

        const index = this.users.findIndex(u => u.getEmail() === existingUser.getEmail())

        if(index !== -1) {

            this.users.splice(index, 1)
            this.currentUser = null
            this.saveToStorage()
            Logger.success("Conta excluida com sucesso")
            return true

        }

    }

}

const formNodes = {

    form: document.querySelector("#form") as HTMLFormElement,
    form2: document.querySelector("#form2") as HTMLFormElement,
    form3: document.querySelector("#form3") as HTMLFormElement

}

const inputNodes = {

    name: document.querySelector("#input-name") as HTMLInputElement,
    email: document.querySelector("#input-email") as HTMLInputElement,
    pass: document.querySelector("#input-password") as HTMLInputElement,
    location: document.querySelector("#input-local") as HTMLInputElement,
    submit: document.querySelector("#btn-submit") as HTMLInputElement,
    email2: document.querySelector("#input-email2") as HTMLInputElement,
    pass2: document.querySelector("#input-password2") as HTMLInputElement,
    submit2: document.querySelector("#btn-submit2") as HTMLInputElement,
    name3: document.querySelector("#input-name3") as HTMLInputElement,
    email3: document.querySelector("#input-email3") as HTMLInputElement,
    location3: document.querySelector("#input-local3") as HTMLInputElement,
    submit3: document.querySelector("#btn-submit3") as HTMLInputElement

}

const divNodes = {

    cardPerfil: document.querySelector("#perfil-modal") as HTMLDivElement,
    containerC: document.querySelector("#container-cadastro") as HTMLDivElement,
    containerL: document.querySelector("#container-login") as HTMLDivElement,
    containerU: document.querySelector("#container-update") as HTMLDivElement,
    altbtn: document.querySelector("#alt-btn") as HTMLDivElement,
    adminModal: document.querySelector("#admin-modal") as HTMLDivElement,
    containerIL: document.querySelector("#image-container") as HTMLDivElement,
    containerIC: document.querySelector("#image-container2") as HTMLDivElement

}

const buttonNodes = {

    close: document.querySelector("#btn-close") as HTMLButtonElement,
    closeAdmin: document.querySelector("#btn-close-admin") as HTMLButtonElement,
    showPass: document.querySelector("#showPass") as HTMLButtonElement,
    showPass2: document.querySelector("#showPass2") as HTMLButtonElement,
    logout: document.querySelector("#btn-logout") as HTMLButtonElement,
    edit: document.querySelector("#edit-btn") as HTMLButtonElement,
    adminView: document.querySelector("#btn-admin-view") as HTMLButtonElement,
    deleteAcc: document.querySelector("#btn-delete-account") as HTMLButtonElement,

}

const elementsNodes = {

    nameValue: document.querySelector("#name-value") as HTMLElement,
    emailValue: document.querySelector("#email-value") as HTMLElement,
    locationValue: document.querySelector("#location-value") as HTMLElement,
    roleValue: document.querySelector("#role-value") as HTMLElement,
    activeLogin: document.querySelector("#activeLogin") as HTMLElement,
    desativeLogin: document.querySelector("#desativeLogin") as HTMLElement,
    iconeOlho: document.querySelector("#icone-olho") as HTMLElement,
    iconeOlho2: document.querySelector("#icone-olho2") as HTMLElement,
    deleteBtn: document.querySelector("#deleteBtn") as HTMLElement,

}

const tableNodes = {

    body: document.querySelector("#admin-table-body") as HTMLElement

}

if(elementsNodes.activeLogin) {
    elementsNodes.activeLogin.addEventListener("click", () => {

        divNodes.containerC.classList.add('hidden');
        divNodes.containerIC.classList.add('hidden');
        divNodes.containerL.classList.remove('hidden');
        divNodes.containerIL.classList.remove('hidden');

        const mainContainer = divNodes.containerL.parentElement;
        mainContainer?.classList.remove('flex-row-reverse');
        mainContainer?.classList.add('flex-row');

        inputNodes.email.classList.remove('border-green-500');
        inputNodes.pass.classList.remove('border-green-500');
        inputNodes.email.classList.remove('border-red-500');
        inputNodes.pass.classList.remove('border-red-500');
        formNodes.form.reset();
        document.title = 'Custos | Login';

        applyTransition(divNodes.containerL, 'animate-entranceL');
        applyTransition(divNodes.containerIL, 'animate-entranceC')

    });
}

if(elementsNodes.desativeLogin) {
    elementsNodes.desativeLogin.addEventListener("click", () => {

        divNodes.containerL.classList.add('hidden');
        divNodes.containerIL.classList.add('hidden');
        divNodes.containerC.classList.remove('hidden');
        divNodes.containerIC.classList.remove('hidden');

        const mainContainer = divNodes.containerC.parentElement;
        mainContainer?.classList.add('flex-row-reverse');

        inputNodes.email2.classList.remove('border-green-500');
        inputNodes.pass2.classList.remove('border-green-500');
        inputNodes.email2.classList.remove('border-red-500');
        inputNodes.pass2.classList.remove('border-red-500');
        formNodes.form2.reset();
        document.title = 'Custos | Cadastro';

        applyTransition(divNodes.containerC, 'animate-entranceC');
        applyTransition(divNodes.containerIC, 'animate-entranceL')

    });
}



if(formNodes.form){

    formNodes.form.addEventListener("submit", (e: SubmitEvent) => {

        e.preventDefault()

        const user: UserDTO = {
            name: inputNodes.name.value,
            email: inputNodes.email.value,
            password: inputNodes.pass.value,
            location: inputNodes.location.value,
            role: 'user'
        }

        const result = AuthService.register(user)

        if(result) {

            const publicData = result.toJSON()

            elementsNodes.nameValue.innerHTML = publicData.name ?? "Não informado"
            elementsNodes.emailValue.innerHTML = publicData.email
            elementsNodes.locationValue.innerHTML = publicData.location ?? "N/A"
            elementsNodes.roleValue.innerHTML = publicData.role;
            elementsNodes.roleValue.className = publicData.role === 'admin' ? 'text-red-600 text-2xl font-semibold' : 'text-green-600 text-2xl font-semibold'

            buttonSetting(result)

            Logger.success('Usuário Registrado:' + result.toJSON())

            divNodes.containerC.classList.add('hidden')
            divNodes.containerIC.classList.add('hidden')
            document.title = 'Custos | Perfil'
            divNodes.cardPerfil.classList.remove('hidden')

            formNodes.form.reset()

        }

        if(!result) {

            const currentContainer = divNodes.containerC.classList.contains('hidden')
            ? divNodes.containerL
            : divNodes.containerC;

            applyTransition(currentContainer, 'animate-shake');
        }

    })

}

if(formNodes.form2) {

    formNodes.form2.addEventListener("submit", (e: SubmitEvent) => {

        e.preventDefault()

        const email = inputNodes.email2.value
        const password = inputNodes.pass2.value

        const result = AuthService.login(email, password)

        if(result) {

            const data = result.toJSON()

            elementsNodes.nameValue.innerHTML = data.name
            elementsNodes.emailValue.innerHTML = data.email
            elementsNodes.locationValue.innerHTML = data.location
            elementsNodes.roleValue.innerHTML = data.role

            elementsNodes.roleValue.className = data.role === 'admin' ? 'text-red-600 text-2xl font-semibold' : 'text-green-600 text-2xl font-semibold'

            buttonSetting(result)

            divNodes.containerL.classList.add('hidden')
            divNodes.containerIL.classList.add('hidden')
            document.title = 'Custos | Perfil'
            divNodes.cardPerfil.classList.remove('hidden')

            formNodes.form2.reset()
            
        }

        if(!result) {

            const currentContainer = divNodes.containerC.classList.contains('hidden')
            ? divNodes.containerL
            : divNodes.containerC;

            applyTransition(currentContainer, 'animate-shake');

        }

    })

}

if(buttonNodes.close) {

    buttonNodes.close.addEventListener("click", () => {

        divNodes.containerU.classList.add('hidden')
        inputNodes.email3.classList.remove('border-green-500');
        document.title = 'Custos | Perfil'
        divNodes.cardPerfil.classList.remove('hidden')

    })

}

if(buttonNodes.showPass) {

    buttonNodes.showPass.addEventListener("click", () => {

        const isPass = inputNodes.pass.type === 'password'

        inputNodes.pass.type = isPass ? 'text' : 'password'

        elementsNodes.iconeOlho.classList.toggle("bi-eye")
        elementsNodes.iconeOlho.classList.toggle("bi-eye-slash")

        Logger.info(`Senha ${isPass ? 'visivel' : 'oculta'}`)

    })

}

if(buttonNodes.showPass2) {

    buttonNodes.showPass2.addEventListener("click", () => {

        const isPass = inputNodes.pass2.type === 'password'

        inputNodes.pass2.type = isPass ? 'text' : 'password'

        elementsNodes.iconeOlho2.classList.toggle("bi-eye")
        elementsNodes.iconeOlho2.classList.toggle("bi-eye-slash")

        Logger.info(`Senha ${isPass ? 'visivel' : 'oculta'}`)

    })

}


if(formNodes.form3) {

    formNodes.form3.addEventListener("submit", (e: SubmitEvent) => {

        e.preventDefault()

        const user = AuthService.currentUser

        if(user) {

            const updateUser = UserService.update({
                name: inputNodes.name3.value,
                email: inputNodes.email3.value,
                location: inputNodes.location3.value
            })

            if(updateUser) {

                const newPublicData = updateUser.toJSON()

                elementsNodes.nameValue.innerHTML = newPublicData.name
                elementsNodes.emailValue.innerHTML = newPublicData.email
                elementsNodes.locationValue.innerHTML = newPublicData.location
                elementsNodes.roleValue.innerHTML = newPublicData.role

                Logger.success("Usuário atualizado " + updateUser.toJSON())

                inputNodes.email3.classList.remove('border-green-500');
                formNodes.form3.reset()

                divNodes.containerU.classList.add('hidden')
                document.title = 'Custos | Perfil'
                divNodes.cardPerfil.classList.remove('hidden')

            }

            if(!updateUser) {

                const currentContainer = divNodes.containerU

                applyTransition(currentContainer, 'animate-shake');

            }

        }

    })

}


if(buttonNodes.deleteAcc) {

    buttonNodes.deleteAcc.addEventListener("click", () => {

        if(confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível")){
            if(UserService.delete()) {
                divNodes.cardPerfil.classList.add('hidden')
                inputNodes.email.classList.remove('border-green-500');
                inputNodes.pass.classList.remove('border-green-500');
                inputNodes.email2.classList.remove('border-green-500');
                inputNodes.pass2.classList.remove('border-green-500');
                inputNodes.email3.classList.remove('border-green-500');
                document.title = 'Custos | Login'
                divNodes.containerL.classList.remove('hidden')
                divNodes.containerIL.classList.remove('hidden')
            }
        }

    })

}

if(buttonNodes.closeAdmin) {

    buttonNodes.closeAdmin.addEventListener("click", () => {

        divNodes.adminModal.classList.add('hidden')
        document.title = 'Custos | Perfil'
        divNodes.cardPerfil.classList.remove('hidden')

    })

}



if(buttonNodes.logout) {

    buttonNodes.logout.addEventListener("click", () => {

        divNodes.cardPerfil.classList.add('hidden')

        document.title = 'Custos | Login'
        divNodes.containerL.classList.remove('hidden')
        divNodes.containerIL.classList.remove('hidden')
        inputNodes.email.classList.remove('border-green-500');
        inputNodes.pass.classList.remove('border-green-500');
        inputNodes.email2.classList.remove('border-green-500');
        inputNodes.pass2.classList.remove('border-green-500');
        
        inputNodes.email2.value = ""
        inputNodes.pass2.value = ""

        Logger.info("Usuário deslogado")
    })

}

function buttonSetting(user: Perfil) {

    const container = divNodes.altbtn
    container.innerHTML = ''

    const btn = document.createElement("button")

    if(user.getRole() === 'admin'){
        
        btn.innerHTML = `<i class="bi bi-people"></i> Gerenciar Usuários (Admin)`
        btn.className = "bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 w-full"
        
        buttonNodes.deleteAcc.classList.add('hidden')

        btn.addEventListener("click", () => {
            
            renderAdminTable()
            divNodes.cardPerfil.classList.add('hidden')
            document.title = 'Custos | Gerenciamento de Usuários'
            divNodes.adminModal.classList.remove('hidden')

        });

    } else {
        btn.innerHTML = `<i class="bi bi-pencil"></i> Editar Perfil`
        btn.className = "bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 w-full shadow-lg"
        
        buttonNodes.deleteAcc.classList.remove('hidden')

        btn.addEventListener("click", () => {
            divNodes.cardPerfil.classList.add('hidden')
            document.title = 'Custos | Atualizar Informações'
            divNodes.containerU.classList.remove('hidden')
            
            inputNodes.name3.value = user.getName()
            inputNodes.email3.value = user.getEmail()
            inputNodes.location3.value = user.getLocation()
        });
    }

    container.appendChild(btn)

}

function renderAdminTable() {

    const allUsers = UserService.listAll()
    tableNodes.body.innerHTML = ""

    allUsers.forEach(user => {

        const row = document.createElement("tr")
        row.className = "border-b hover:bg-gray-50 transition-colors"

        row.innerHTML = `
            <td class="p-4 text-gray-700 font-medium">${user.getName() || '---'}</td>
            <td id="emailVle" class="p-4 text-gray-600">${user.getEmail()}</td>
            <td class="p-4 text-gray-600">${user.getLocation() || '---'}</td>
            <td class="p-4">
                <span class="${user.getRole() === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-md text-xs font-bold uppercase">
                    ${user.getRole()}
                </span>
            </td>
            ${user.getRole() === 'admin' ? '' : '<td class="p-4 text-red-500 font-semibold"><span id="deleteBtn" class="cursor-pointer"><i class="bi bi-trash"></i>Deletar</span></td>'}
        `

        const deleteF = row.querySelector('#deleteBtn')
        
        if(deleteF) {

            deleteF.addEventListener("click", () => {

                if (confirm("Tem certeza que deseja excluir essa conta? Esta ação é irreversível")) {

                    if (UserService.adminDelete(user.getEmail())) {
                        renderAdminTable()
                    }

                }

            })
            
        }

        tableNodes.body.appendChild(row)

    })

}

function validateForms(emailInput: HTMLInputElement, submitBtn: HTMLInputElement, passInput?: HTMLInputElement) {

    const validate = () => {

        const isEmailValid = emailInput.value.includes('@') && emailInput.value.length > 5;

        const isPassValid = passInput ? passInput.value.length >= 8 : true;
        
        applyInputStyle(emailInput, isEmailValid);
        if (passInput) {
            applyInputStyle(passInput, isPassValid);
        }
        applyStyleDisable(submitBtn, isEmailValid && isPassValid);
    };

    emailInput.addEventListener("input", validate);

    if (passInput) {
        passInput.addEventListener("input", validate);
    }

    applyStyleDisable(submitBtn, false);
}

function applyStyleDisable(submit: HTMLInputElement, isValid: boolean) {

    const disabledClasses = 'bg-gray-400 text-gray-200 opacity-50 cursor-not-allowed pointer-events-none'.split(' ')

    const activeClasses = 'cursor-pointer bg-red-500 text-white font-bold hover:bg-red-600 hover:-translate-y-0.5 active:bg-red-500 active:translate-y-0.5'.split(' ')

    const baseClasses = 'text-2xl rounded-2xl px-3 py-2 transition-all duration-300 outline-none border-2'.split(' ')

    submit.classList.add(...baseClasses);
    if (!isValid) {
        submit.classList.add(...disabledClasses)
        submit.classList.remove(...activeClasses)
        submit.disabled = true
    } else {
        submit.classList.remove(...disabledClasses)
        submit.classList.add(...activeClasses)
        submit.disabled = false
    }

}

function applyInputStyle(input: HTMLInputElement, isValid: boolean) {

    if (isValid) {
        input.classList.replace('border-red-500', 'border-green-500') || input.classList.add('border-green-500');
    } else {
        input.classList.replace('border-green-500', 'border-red-500') || input.classList.add('border-red-500');
    }

}

function applyTransition(element: HTMLElement, animationClass: string) {
    
    element.classList.remove('animate-entranceC', 'animate-entranceL', 'animate-shake');
    void element.offsetWidth;
    
    element.classList.add(animationClass);

    setTimeout(() => {
        element.classList.remove(animationClass);
    }, 600);
}

validateForms(inputNodes.email, inputNodes.submit, inputNodes.pass)
validateForms(inputNodes.email2, inputNodes.submit2, inputNodes.pass2)
validateForms(inputNodes.email3, inputNodes.submit3)

document.title = 'Custos | Login'
AuthService.init()