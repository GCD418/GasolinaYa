import { doc, getDoc, updateDoc } from 'firebase/firestore';

import DbHandler from './DbHandler.js';
import Usuario from './Usuario.js';

class ModUsuarios {
    static instance = null;
    #db = null;
    #readyPromise = null;
    dbHandler = null;

    constructor() {
        if (ModUsuarios.instance) {
            return ModUsuarios.instance;
        }
        ModUsuarios.instance = this;
        this.usuarios = new Map();

        this.dbHandler = new DbHandler();
        this.#db = this.dbHandler.getDb();

        this.#readyPromise = this.loadFromFirestore();
    }
    async ready() {
        return this.#readyPromise;
    }
    async addUsuario(usuario) {
        this.usuarios.set(usuario.getPlaca(), usuario);

        const document = {
            placa: usuario.getPlaca(),
            enFila: usuario.getEnFila(),
            conTicket: usuario.getConTicket()
        };

        this.dbHandler.setDocument("usuarios", usuario.getPlaca(), document);

        return this.usuarios.size;
    }
    

    async loadFromFirestore() {
        const querySnapshot = await this.dbHandler.getQuerySnapshot("usuarios");
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const usuario = new Usuario(data.placa, data.enFila, data.conTicket);
            this.usuarios.set(data.name, usuario);
        });
        return Promise.resolve(true);
    }

    getUsuario(placa) {
        return this.usuarios.get(placa);
    }

}

export default ModUsuarios;