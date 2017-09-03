//Colocando entre parênteses transforma a função em expressão
(function () {
  console.log("schedule ...");

  var ui = {
    fields: document.querySelectorAll("input"),
    button: document.querySelector("button"),
    table: document.querySelector("tbody")
  };

//=================================================================
  var validateFields = function (e) {
    console.log("validação ...", e);

    //Previne o recarregamento da página após a submissão
    //do formuláro. Sempre funciona da mesma forma, independente
    //do local onde está dentro da função
    e.preventDefault();

    var errors = 0;
    var data = {};
    ui.fields.forEach(function(field) {
      //console.log(field.value, field.value.trim().length);
      if (field.value.trim().length === 0) {
        field.classList.add("error");
        errors++;
      } else {
        field.classList.remove("error");
        //console.log(field.id, field.value);
        data[field.id] = field.value;
      }
    })
    //console.log(errors, data);

    if (errors > 0) {
      document.querySelector(".error").focus();
    } else {
      saveData(data);
    }
  };
//=================================================================


//=================================================================
  //exemplificado com aerofunction do ES6
  var cleanFields = () => {
    console.log("clean fields ...");
    ui.fields.forEach(field => field.value = "");
  };
//=================================================================


//=================================================================
  var saveData = function (contact) {
    //mostra o conteúdo de contact em formato objeto (JSON)
    console.log("save data ...", contact);
    //mostra o conteúdo de contact em formato texto
    console.log("save data ...", JSON.stringify(contact));

    //cria um objeto para envio de informações no Header
    var headers = new Headers();
    headers.append("Content-type", "application/json");
    var conf = {
      method: "POST",
      body: JSON.stringify(contact),
      headers: headers
    };

    fetch("http://localhost:3000/contacts", conf)
      .then(function (res) {
        if (res.ok) {
          cleanFields();
          listAll();
        }
      })
      .catch(function (err) {
        console.error("Erro Inesperado de ", err);
      });
  };
//=================================================================


//=================================================================
  var listAll = function () {
    console.log("list all ...");



    var headers = new Headers();
    headers.append("Content-type", "application/json");

    var conf = {
      method: "GET",
      headers: headers
    };

    fetch("http://localhost:3000/contacts", conf)
      .then(function (res) {
        return res.json();
      })
      .then(function (list) {
        //console.table(list);
        var html = [];
        list.forEach(function (item) {
          //console.log(item);
          var line = `<tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone}</td>
                        <td><a href="#" data-id="${item.id}">Excluir</a></td>
                     </tr>`;
          html.push(line);
        });
        //console.log(html.join(""));

        if (list.length === 0) {
          html.push(`<tr>
            <td colspan="5">Não existem dados registrados!</td>
          </tr>`);
        }
        ui.table.innerHTML = html.join("");
      })
      .catch(function (err) {
        console.error("Erro Inesperado de ", err);
      });
  };
//=================================================================


//=================================================================
  var removeItem = function (e) {
    //console.log(e.target.dataset.id);
    console.log("remove item ...");

    e.preventDefault();

    var id = e.target.dataset.id;
    if (id) {
      var headers = new Headers();
      headers.append("Content-type", "application/json");

      var conf = {
        method: "DELETE",
        headers: headers
      };

      fetch(`http://localhost:3000/contacts/${id}`, conf)
        .then(listAll)
        .catch(function (err) {
          console.error("Erro Inesperado de ", err);
        });
    }
  }
//=================================================================


//=================================================================
  var initialize = function () {
    //mapeamento de eventos

    //utilizando o onclick não é possível disparar mais de um evento,
    //pois um comando sobrepõe o outro
    //ui.button.onclick = validateFields;

    //essa maneira permite disparar mais de um evento
    ui.button.addEventListener("click", validateFields);
    ui.table.addEventListener("click", removeItem);
    listAll();
  }();
  //console.log(ui);
})
//=================================================================
();
