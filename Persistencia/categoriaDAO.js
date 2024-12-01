import Categoria from "../Modelo/categoria.js";
import conectar from "./Conexao.js";

export default class CategoriaDAO{

    constructor(){
        this.init();
    }

    async init(){
        try{
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS categoriaC(
                    codigo INT NOT NULL AUTO_INCREMENT,
                    descricao VARCHAR(50) NOT NULL,
                    CONSTRAINT pk_categoria PRIMARY KEY(codigo)
                );
            `;
            await conexao.execute(sql);
            await conexao.release();

        }
        catch(erro){
            console.log("Erro ao iniciar a tabela categoria!");
        }
    }

    async gravar(categoria){
        if (categoria instanceof Categoria){
            const conexao = await conectar();
            const sql = "INSERT INTO categoriaC(descricao) VALUES (?)";
            const parametros = [categoria.descricao];
            const resultado = await conexao.execute(sql,parametros);
            categoria.codigo = resultado[0].insertId;
            await conexao.release();
        }
    }
    
    async editar(categoria){
        if (categoria instanceof Categoria){
            const conexao = await conectar();
            const sql = "UPDATE categoriaC SET descricao = ? WHERE codigo = ?";
            const parametros = [categoria.descricao, categoria.codigo];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async excluir(categoria){
        if (categoria instanceof Categoria){
            const conexao = await conectar();
            const sql = "DELETE FROM categoriaC WHERE codigo = ?";
            const parametros = [categoria.codigo];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }

    async consultar(termo){
        let sql = "";
        let parametros = [];
        if (isNaN(parseInt(termo))) {
            sql = "SELECT * FROM categoriaC WHERE descricao LIKE ? ORDER BY descricao";
            parametros.push("%"+termo+"%");
        }
        else{
            sql = "SELECT * FROM categoriaC WHERE codigo = ? ORDER BY descricao";
            parametros.push(termo);
        }
        const conexao = await conectar();
        
        const [registros, campos] = await conexao.query(sql, parametros);
        await conexao.release();
        let listaCategoria=[];
        for (const registro of registros){
            const categoria = new Categoria(registro['codigo'],
                                            registro['descricao']    
            );
            listaCategoria.push(categoria);
        }
        
        return listaCategoria;

    }

}