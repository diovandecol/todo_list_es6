import api from './api';

class App {

    constructor() {
        this.repositories = []
        this.formEl = document.getElementById('repo-form')
        this.inputEl = document.querySelector('input[name=repository]')
        this.listEl = document.getElementById('repo-list')
        this.registerHandlers()
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event)
    }

    // Loading
    setLoading(loading = true) {
        if(loading === true) {
            let loadingEl = document.createElement('span')
            loadingEl.appendChild(document.createTextNode('Carregando...'))
            loadingEl.setAttribute('id', 'loading')
            this.formEl.appendChild(loadingEl)
        } else {
            document.getElementById('loading').remove()
        }
    }

    // Adiciona repositórios
    async addRepository(event) {

        event.preventDefault()

        const repoInput = this.inputEl.value

        if(repoInput.length === 0) {
            return
        }

        this.setLoading()

        try {
            const response = await api.get(`/repos/${repoInput}`)
            const { name, description, html_url, owner: { avatar_url } } = response.data

            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            })

            this.inputEl.value = ''
            
            this.render()
        } catch (err) {
            alert('Repositório não encontrado...')
        }

        this.setLoading(false)

    }

    // Renderiza a lista
    render() {

        this.listEl.innerHTML = ''

        this.repositories.forEach(repo => {

            // Cria o img 
            let imgEl = document.createElement('img')
            imgEl.setAttribute('src', repo.avatar_url)

            // Cria o título
            let titleEl = document.createElement('strong')
            titleEl.appendChild(document.createTextNode(repo.name))

            // Cria a descrição
            let descriptionEl = document.createElement('p')
            descriptionEl.appendChild(document.createTextNode(repo.description))

            // Cria o link
            let linkEl = document.createElement('a')
            linkEl.setAttribute('href', repo.html_url)
            linkEl.setAttribute('target', '_blank')
            linkEl.appendChild(document.createTextNode('Acessar'))

            // Cria o LI
            let listItemEl = document.createElement('li')

            // Adiciona as informações no LI
            listItemEl.appendChild(imgEl)
            listItemEl.appendChild(titleEl)
            listItemEl.appendChild(descriptionEl)
            listItemEl.appendChild(linkEl)

            this.listEl.appendChild(listItemEl)

        })

    }

}

new App()