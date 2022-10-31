var plans;
var price;
var choosedPlan;
var elems;
var instances;
var modalInstances;
var numberPattern = /\d+/g;


//inicializando elemento MODAL do materialize.
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    modalInstances = M.Modal.init(elems);
});


//listando planos na pagina inicial
function getPlans() {
    fetch("./api/plans").then(function (res) {
        if (res.ok) {
            return res.json();
        }
        alert('Something went wrong');
    }).then(function (data) {
        plans = data;
        plans.forEach(plan => {
            let faixa1 = prices.filter(item => item.codigo === plan.codigo)[0].faixa1
            let faixa2 = prices.filter(item => item.codigo === plan.codigo)[0].faixa2
            let faixa3 = prices.filter(item => item.codigo === plan.codigo)[0].faixa3
            let html_to_insert = `
        <div class="card blue-grey darken-1" data-codigo="${plan.codigo}">
            <div class="card-content white-text">
                <span class="card-title">${plan.nome}</span>
                <p class="planFaixa">Neste plano pessoas de 0 a 17 anos pagará R$ ${faixa1},00/mês.</p><p class="planFaixa">Pessoas de 18 a 40 anos pagará R$ ${faixa2},00/mês.</p><p class="planFaixa">Pessoas com mais de 40 anos pagará R$ ${faixa3},00/mês.</p>
            </div>
            <div class="card-action">
                <a href="#" onclick="checkout(event, ${plan.codigo})" >Adquirir Plano</a>
            </div>
        </div>
        `;
            document.getElementById('cards').insertAdjacentHTML('beforeend', html_to_insert);
        });
    }).catch((error) => {
        alert(error);
        document.location.reload();
    });
}

function getPrices() {
    fetch("./api/prices").then(function (res) {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Something went wrong');
    }).then(function (data) {
        prices = data;
        //a função getPlans é chamada dentro do fetch getPrices() para evitar erro caso o servidor demore a responder na requisição da getPrices();
        getPlans();
    }).catch((error) => {
        alert("Erro ao requisitar API, verifique o servidor e tente novamente!");
        document.location.reload();
    });
}

//criando tela de checkout ao escolher um plano
function checkout(e, planCodigo) {
    choosedPlan = planCodigo;
    document.getElementById('cards').remove();
    var result = plans.filter(item => item.codigo === choosedPlan);
    let checkoutHtml = `
    <div class="vidas" id="vidas">
        <h3 class="planText">${result[0].nome}</h3>
        <div class="columnsTable"><p class="columnName">Nome</p><p class="columnAge">Idade</p><p class="columnCurrency">R$</p></div>
        <ul class="collapsible">
        <li id="personDiv${document.querySelectorAll('.vidas > .collapsible > li').length}" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}" class="active">
        <div class="collapsible-header"><div class="leftSide"><i class="material-icons">person</i>Titular</div><div class="personAge"></div><div class="personCurrency"></div><i class="material-icons" class="dropwdownArrow">expand_more</i></div>
            <div class="collapsible-body">
                <form class="form">
                    <div class="input-field">
                        <input id="name${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}" onkeydown="writeTitleName(event)">
                        <label class="active" for="name${document.querySelectorAll('.vidas > .collapsible > li').length}">Nome</label>
                    </div>

                    <div class="input-field">
                        <input id="idade${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}" onkeydown="writeTitleAge(event)">
                        <label class="active" for="idade${document.querySelectorAll('.vidas > .collapsible > li').length}">Idade</label>
                    </div>
                </form>
            </div>
        </li>

        </ul>

        <div class="bottomActions"><a class="waves-effect waves-light btn" onclick="addPerson()"><i class="material-icons right">add</i>Adicionar</a> <p id="totalCurrency">TOTAL:</p> <a class="waves-effect waves-light btn" id="submitButton" onclick="submitAllForms()"><i class="material-icons right">navigate_next</i>Continuar</a></div>
    </div>
    `
    document.getElementsByTagName("main")[0].insertAdjacentHTML('beforeend', checkoutHtml);
    document.getElementsByTagName("main")[0].style.alignItems = "unset";

    updatePlanPrices(document.querySelectorAll('.vidas > .collapsible > li'));
    setTotalCurrency();

    //inicializando elementos collapsible do materialize
    elems = document.querySelectorAll('.collapsible');
    instances = M.Collapsible.init(elems)
}

//função para atualizar os preços e vidas ao adicionar uma pessoa nova e/ou fazer parte das condições dos planos.
function updatePlanPrices(personsToUpdate) {
    console.log("UPDATE PLANS")
    personsToUpdate.forEach(function (person) {
        let collapsibleCurrency = person.querySelector(".personCurrency");
        let personAge = person.querySelector(`#idade${person.getAttribute("data-belongTo")}`).value != "" ? parseInt(person.querySelector(`#idade${person.getAttribute("data-belongTo")}`).value) : 0
        console.log(personAge)
        prices.filter(function (item) {
            for (let key in item) {
                if (key == "codigo" && item[key] == choosedPlan) {
                    if (personsToUpdate.length >= item["minimo_vidas"]) {
                        if (personAge >= 0 && personAge <= 17) {
                            collapsibleCurrency.setAttribute("data-personCurrency", item.faixa1)
                            collapsibleCurrency.textContent = `R$ ${item.faixa1},00`
                        }

                        if (personAge >= 18 && personAge <= 40) {
                            collapsibleCurrency.setAttribute("data-personCurrency", item.faixa2)
                            collapsibleCurrency.textContent = `R$ ${item.faixa2},00`
                        }

                        if (personAge > 40) {
                            collapsibleCurrency.setAttribute("data-personCurrency", item.faixa3)
                            collapsibleCurrency.textContent = `R$ ${item.faixa3},00`
                        }
                    }
                }
            }
        });
    })
}

//função para adicionar pessoas
function addPerson() {
    let personToInsert = `
    <li id="personDiv${document.querySelectorAll('.vidas > .collapsible > li').length}" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}">
    <div class="collapsible-header"><div class="leftSide"><i class="material-icons">person</i>Dependente</div><div class="personAge"></div><div class="personCurrency"></div><i class="material-icons" id="dropwdownArrow">expand_more</i></div>
        <div class="collapsible-body">
            <form class="form">
                <div class="input-field">
                    <input id="name${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}" onkeydown="writeTitleName(event)">
                    <label class="active" for="name${document.querySelectorAll('.vidas > .collapsible > li').length}">Nome</label>
                </div>

                <div class="input-field">
                    <input id="idade${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}" onkeydown="writeTitleAge(event)">
                    <label class="active" for="idade${document.querySelectorAll('.vidas > .collapsible > li').length}">Idade</label>
                </div>
            </form>
        </div>
    </li>
    `
    document.querySelector('.vidas > .collapsible').insertAdjacentHTML('beforeend', personToInsert);
    updatePlanPrices(document.querySelectorAll('.vidas > .collapsible > li'));
    setTotalCurrency();
}

//função para escrever o nome da pessoa no item collapsible.
function writeTitleName(event) {
    let collapsibleTitle = document.querySelector(`#personDiv${event.target.getAttribute('data-belongTo')} > .collapsible-header > .leftSide`).childNodes[1];
    setTimeout(function () {
        let userName = document.getElementById(`name${event.target.getAttribute("data-belongTo")}`).value;
        if (userName == "") {
            if (event.target.getAttribute("data-belongTo") != 0) {
                collapsibleTitle.textContent = "Dependente"
            } else {
                collapsibleTitle.textContent = "Titular"
            }
        } else {
            collapsibleTitle.textContent = document.getElementById(`name${event.target.getAttribute("data-belongTo")}`).value
        }
    }, 1)
}

//função para escrever a idade da pessoa no item collapsible.
function writeTitleAge(event) {
    let collapsibleAge = document.querySelector(`#personDiv${event.target.getAttribute('data-belongTo')} > .collapsible-header > .personAge`);
    setTimeout(function () {
        let personAge = "";
        if (document.getElementById(`idade${event.target.getAttribute("data-belongTo")}`).value != "") {
            personAge = document.getElementById(`idade${event.target.getAttribute("data-belongTo")}`).value.match(numberPattern)
        }
        document.getElementById(`idade${event.target.getAttribute("data-belongTo")}`).value = personAge
        console.log(personAge)
        if (personAge == "") {
            collapsibleAge.textContent = ""
        } else {
            collapsibleAge.textContent = personAge
        }
        setCurrency(event);
    }, 1)
}

//função para definir o preço por vida no plano.
function setCurrency(event) {
    let collapsibleCurrency = document.querySelector(`#personDiv${event.target.getAttribute('data-belongTo')} > .collapsible-header > .personCurrency`);
    setTimeout(function () {
        let personAge = document.getElementById(`idade${event.target.getAttribute("data-belongTo")}`).value;
        let vidas = parseInt(document.querySelectorAll('.vidas > .collapsible > li').length)
        console.log(vidas)
        let i = 0;
        prices.filter(function (item) {
            for (let key in item) {
                if (key == "codigo" && item[key] == choosedPlan) {
                    if (vidas >= item["minimo_vidas"]) {
                        if (personAge >= 0 && personAge <= 17) {
                            collapsibleCurrency.setAttribute("data-personCurrency", item.faixa1)
                            collapsibleCurrency.textContent = `R$ ${item.faixa1},00`
                        }

                        if (personAge >= 18 && personAge <= 40) {
                            collapsibleCurrency.setAttribute("data-personCurrency", item.faixa2)
                            collapsibleCurrency.textContent = `R$ ${item.faixa2},00`
                        }

                        if (personAge > 40) {
                            collapsibleCurrency.setAttribute("data-personCurrency", item.faixa3)
                            collapsibleCurrency.textContent = `R$ ${item.faixa3},00`
                        }
                    }
                }
            }
        });
        setTotalCurrency();
    }, 1)
}

//função para definir o valor total das vidas do plano.
function setTotalCurrency() {
    let totalCurrency = 0;
    document.querySelectorAll(".personCurrency").forEach(function (personCurrency) {
        let currentPersonCurrency = parseInt(personCurrency.getAttribute("data-personCurrency"));
        totalCurrency += currentPersonCurrency
    });
    document.getElementById("totalCurrency").textContent = `TOTAL: R$ ${totalCurrency},00`
}

//função para gerar o json beneficiarios e enviar ao servidor.
function generateJsonBeneficiarios() {
    let totalVidas = document.querySelectorAll('.vidas > .collapsible > li').length;
    let beneficiariosJson = {
        totalBeneficiarios: totalVidas,
        beneficiarios: []
    };

    document.querySelectorAll('.vidas > .collapsible > li').forEach(function (person) {
        console.log(person)
        let personName = person.querySelector(`#name${person.getAttribute("data-belongTo")}`).value;
        let personAge = person.querySelector(`#idade${person.getAttribute("data-belongTo")}`).value ? parseInt(person.querySelector(`#idade${person.getAttribute("data-belongTo")}`).value) : 0;

        console.log(personName, personAge, /*currentPersonCurrency*/ totalVidas, totalCurrency)
        beneficiariosJson.beneficiarios.push({
            nome: personName,
            idade: personAge,
            plano: `reg${choosedPlan}`,
        });
    });

    fetch("./api/beneficiarios",
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(beneficiariosJson)
        }
    ).then(function (res) {
        if (res.status == 200) {
            return res.json();
        } else {
            alert("Ocorreu algo de errado com sua requisição!");
            return res.json();
        }
    }).then(function (data) {
        console.log(data.status)
    })

}

//função para gerar o json proposta e enviar ao servidor.
function generateJsonProposta() {
    let totalCurrency = 0;
    let totalVidas = document.querySelectorAll('.vidas > .collapsible > li').length;
    let propostaJson = {
        totalBeneficiarios: totalVidas,
        totalValor: 0,
        beneficiarios: []
    };

    document.querySelectorAll(".personCurrency").forEach(function (personCurrency) {
        let currentPersonCurrency = parseInt(personCurrency.getAttribute("data-personCurrency"));
        totalCurrency += currentPersonCurrency
    });

    document.querySelectorAll('.vidas > .collapsible > li').forEach(function (person) {
        console.log(person)
        let personCurrency = person.querySelector(".personCurrency");
        let currentPersonCurrency = parseInt(personCurrency.getAttribute("data-personCurrency"));
        let personName = person.querySelector(`#name${person.getAttribute("data-belongTo")}`).value;
        let personAge = person.querySelector(`#idade${person.getAttribute("data-belongTo")}`).value ? parseInt(person.querySelector(`#idade${person.getAttribute("data-belongTo")}`).value) : 0;

        console.log(personName, personAge, /*currentPersonCurrency*/ totalVidas, totalCurrency)
        propostaJson.beneficiarios.push({
            nome: personName,
            idade: personAge,
            plano: `reg${choosedPlan}`,
            valor: currentPersonCurrency,
        });
    });

    propostaJson.totalValor = totalCurrency;

    fetch("./api/proposta",
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(propostaJson)
        }
    ).then(function (res) {
        if (res.status == 200) {
            return res.json();
        } else {

        }
    }).then(function (data) {
        if (data.message == "Arquivo criado com sucesso") {
            alert("Proposta realizada com sucesso!");
            document.location.reload();
        }
    })

}

//função para validar e enviar os formularios.
function submitAllForms() {
    for (item of document.getElementsByTagName("input")) {
        if (item.value == "") {
            for (let i = 0; i < document.querySelectorAll(".collapsible > li").length; i++) {
                if (document.querySelectorAll(".collapsible > li")[i].getAttribute("data-belongTo") == item.getAttribute("data-belongTo")) {
                    instances[0].open(i);
                    item.focus();
                    return;
                }
            }
        }
    }
    generateJsonBeneficiarios();
    modalInstances[0].open();
}

//consumindo APIS
getPrices();