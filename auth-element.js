import * as auth from './auth-utils.js';

const template = `
    <style> 
      .btn {
        font-weight: var(--font-weight, 200);
        background-color: var(--background-color, indianred);
        border: 0;
        border-radius: 5px;
        color: var(--color, #fff);
        padding: var(--padding, 10px);
        text-transform: uppercase;
      }
      .info {
          font-family: var(--font-family, sans-serif);
      }
      .info > img {
          border-radius: 50%;
      }
		</style>
        <button id="login" class="btn">Login</button>
        <button id="logout" class="btn">Logout</button>
        <span id="info" class="info"></span>        `;

class LoginElement extends HTMLElement {

    config = {
        domain: '',
        clientId: '',
    }

    constructor() {
        super();
        const template = document.createElement("template");


        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = template;

        const login = this.shadowRoot.getElementById('login');
        const logout = this.shadowRoot.getElementById('logout');

        login.addEventListener('click', () => {
            auth.login();
        });

        logout.addEventListener('click', () => {
            auth.logout();
        });
    }

    static get observedAttributes() {return ['domain', 'clientid']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'domain') {
            this.config.domain = newValue;
        }
        else if (name === 'clientid') {
            this.config.clientId = newValue;
        }

        if (this.config.domain && this.config.clientId) {
            auth.init(this.config).then(user => {
                console.debug('user', user);
                if (!user) return;
                const info = this.shadowRoot.getElementById('info');
                info.innerHTML = `
                    <span>Logged in as ${user.name} </span>
                    <img width="100" src="${user.picture}">
                `;

            })
        }
    }


}



customElements.define('auth-element', LoginElement);