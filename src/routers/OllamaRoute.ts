import { Route } from "../abstract/Route"
import { OllamaController } from "../controller/OllamaController";

export class OllamaRoute extends Route{
    
    protected url: string;
    protected Contorller = new OllamaController();

    constructor(){
        super()
        this.url = '/api/v1/Ollama/'
        this.setRoutes()
    }

    protected setRoutes(): void {
        this.router.post(`${this.url}chat`,(req, res)=>{
            this.Contorller.chat(req, res);
        });

        this.router.post(`${this.url}askWithDoc`,(req, res)=>{
            this.Contorller.askWithDoc(req, res);
        });

        this.router.delete(`${this.url}deleteDoc`,(req, res)=>{
            this.Contorller.deleteDoc(req, res);
        });

        this.router.put(`${this.url}addDoc`,(req, res)=>{
            this.Contorller.addDoc(req, res);
        });
    }

}