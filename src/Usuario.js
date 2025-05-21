class Usuario{
    constructor(placa, enFila = null, conTicket = null){
        this.placa = placa;
        this.enFila = enFila;
        this.conTicket = conTicket;
    }
    getPlaca(){
        return this.placa;
    }
    getEnFila(){
        return this.enFila;
    }
    
}

export default Usuario;