// Declaração da variável para armazenar o banco de dados
let db;

// Abrindo ou criando um banco de dados
let request = indexedDB.open("MinhaBaseDeDados", 1);

// Manipulando eventos de sucesso e erro
request.onsuccess = function (event) {
  console.log("Banco de dados aberto com sucesso!");
  db = event.target.result;
  lerDados();
};
request.onerror = function (event) {
  console.log("Erro ao abrir o banco de dados: " + event.target.errorCode);
};
// Manipulando evento de upgrade do banco de dados (cria tabela)
request.onupgradeneeded = function (event) {
  let db = event.target.result;
  let objectStore = db.createObjectStore("MinhaTabela", { keyPath: "id" });
  // Cria um índice para o campo nome
  objectStore.createIndex("nome", "nome", { unique: false });
  // Cria um índice para o campo CPF
  objectStore.createIndex("cpf", "cpf", { unique: true });
};
// Função para adicionar dados ao banco de dados
function adicionarDados() {
  if (!db) {
    console.error("O banco de dados não está disponível ainda.");
    return;
  } else {

    let valornome = document.getElementById("input_nome").value;
    let valorcpf = document.getElementById("input_cpf").value;
    //função verifica se o valor é vazio
    if(valornome != '' && valorcpf != '' ){
        var atualData = new Date();
        var segundos = atualData.getSeconds();
        var minutos = atualData.getMinutes();
        var hora = atualData.getHours();
        var dia = atualData.getDate();
        var mes = atualData.getMonth();
        var ano = atualData.getFullYear();
    
        //id dinâmico
        dataAtual = segundos + minutos + hora + dia + mes + ano;
      
        let transaction = db.transaction(["MinhaTabela"], "readwrite");
        let objectStore = transaction.objectStore("MinhaTabela");
    
        // Adiciona dados ao objeto de armazenamento
        let request = objectStore.add({
          id: dataAtual,
          nome: valornome,
          cpf: valorcpf,
        });
        request.onsuccess = function (event) {
          console.log("Dados adicionados com sucesso!");
        };
    
        request.onerror = function (event) {
          console.log("Erro ao adicionar dados: " + event.target.errorCode);
          alert("Erro ! Tente novamente por favor ! \n -Principais motivos- \n 1ª cpf repetido, sistema não aceita cpf repetido ! \n 2ª Outro processo em andamento.");
          
        };
    }else{
      alert("Erro ! Tente novamente por favor ! \n Campo em branco, sistema não aceita campo vazio !");
    }
  }
}
// Função para ler dados do banco de dados
function lerDados() {
  if (!db) {
    console.error("O banco de dados não está disponível ainda.");
    return;
  } else {
    let transaction = db.transaction(["MinhaTabela"], "readonly");
    let objectStore = transaction.objectStore("MinhaTabela");

    // Abre um cursor para percorrer os dados
    let cursorRequest = objectStore.openCursor();

    let dadosDoIndexedDB = [];

    // Manipulador para o evento de sucesso do cursor
    cursorRequest.onsuccess = function (event) {
      let cursor = event.target.result; // Referência para o cursor

      // Verifica se ainda há itens no cursor
      if (cursor) {
        // Adiciona os dados do item ao array
        dadosDoIndexedDB.push(cursor.value);

        // Continua para o próximo item
        cursor.continue();
      } else {
        // Todos os itens foram percorridos
        console.log(
          "Todos os dados do IndexedDB foram recuperados:",
          dadosDoIndexedDB
        );
        mostrarDadosNoHTML(dadosDoIndexedDB);
      }
    };
    // Função para mostrar os dados no HTML
    function mostrarDadosNoHTML(dados) {
      // Aqui você pode manipular o array 'dados' e mostrá-lo no HTML
      let lista = document.getElementById("lista-dados");

      dados.reverse();

      let quat = dados.length;

      //esconde div
      if(quat == 0) {
        //pegando a classe da div
         let div = document.getElementById("background_table");

         //adiciona uma nova classe
         div.classList.add("background_esconde");
      }
    
      dados.forEach(function (dado) {
        let novoItem;
        
        novoItem = `<tr>
                    <td><input id="${dado.id}nome" value="${dado.nome}" type="text" required></input></td>
                    <td><input id="${dado.id}cpf" value="${dado.cpf}" type="number" required></input></td>
                    <td><button id="${dado.id}" onclick="atualizarDados(${dado.id})">atualizar</button>
                    <button id="${dado.id}" onclick="deletarDados(${dado.id})">deletar</button></td>
                    </tr>`;
        //Adiciona novo item na lista
        lista.innerHTML += novoItem;
      });
    }

    request.onerror = function (event) {
      console.log("Erro ao ler dados: " + event.target.errorCode);
    };
  }
}
// Função para atualizar dados no banco de dados
function atualizarDados(id) {
  let inputnome = document.getElementById(id + "nome").value;;
  let inputcpf = document.getElementById(id + "cpf").value;

  if(inputnome != '' && inputcpf != '' ){
    let transaction = db.transaction(["MinhaTabela"], "readwrite");
  let objectStore = transaction.objectStore("MinhaTabela");

  let request = objectStore.put({ id: id, nome: inputnome, cpf: inputcpf});

  request.onsuccess = function (event) {
    console.log("Dados atualizados com sucesso!");
  };

  request.onerror = function (event) {
    console.log("Erro ao atualizar dados: " + event.target.errorCode);
  };
  }else{
    alert("Erro ! Tente novamente por favor ! \n Campo em branco, sistema não aceita campo vazio !");
  }
  

  
}

// Função para deletar dados do banco de dados
function deletarDados(id) {
  let transaction = db.transaction(["MinhaTabela"], "readwrite");
  let objectStore = transaction.objectStore("MinhaTabela");
  let request = objectStore.delete(id);

  request.onsuccess = function (event) {
    console.log("Dados deletados com sucesso!");
  };

  request.onerror = function (event) {
    console.log("Erro ao deletar dados: " + event.target.errorCode);
  };
  location.reload(); //atualiza a tela
}
