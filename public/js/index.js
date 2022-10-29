var plans;
var price;
var choosedPlan;

//listando planos na pagina inicial
function getPlans() {
    fetch("http://localhost:3000/api/plans").then(function (res) {
        return res.json();
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
    })
}

function getPrices() {
    fetch("http://localhost:3000/api/prices").then(function (res) {
        return res.json();
    }).then(function (data) {
        prices = data;
    })
}

function checkout(e, planCodigo) {
    choosedPlan = planCodigo;
    document.getElementById('cards').remove();
    var result = plans.filter(item => item.codigo === choosedPlan);
    let checkoutHtml = `
    <div class="vidas" id="vidas">
        <h3 class="planText">${result[0].nome}</h3>
        <div class="columnsTable"><p class="columnName">Nome</p><p class="columnAge">Idade</p><p class="columnCurrency">R$</p></div>
        <ul class="collapsible">
        <li id="personDiv${document.querySelectorAll('.vidas > .collapsible > li').length}" class="active">
        <div class="collapsible-header"><div class="leftSide"><i class="material-icons">person</i>Titular</div><div class="personAge"></div><div class="personCurrency"></div><i class="material-icons" id="dropwdownArrow">expand_more</i></div>
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

        <div class="bottomActions"><a class="waves-effect waves-light btn" onclick="addPerson()"><i class="material-icons right">add</i>Adicionar</a> <p>TOTAL:</p> <a class="waves-effect waves-light btn"><i class="material-icons right">navigate_next</i>Continuar</a></div>
    </div>
    `
    document.getElementsByTagName("main")[0].insertAdjacentHTML('beforeend', checkoutHtml);
    document.getElementsByTagName("main")[0].style.alignItems = "unset";

    //inicializando elementos collapsible do materialize
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems)
}

function addPerson() {
    let personToInsert = `
    <li id="personDiv${document.querySelectorAll('.vidas > .collapsible > li').length}">
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
}

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
    // document.querySelector(`#titular${e.currentTarget.getAttribute('data-belongTo')} > .collapsible-header > leftSide`).innerText = e.currentTarget.value
}

function writeTitleAge(event) {
    let collapsibleAge = document.querySelector(`#personDiv${event.target.getAttribute('data-belongTo')} > .collapsible-header > .personAge`);
    setTimeout(function () {
        let personAge = document.getElementById(`idade${event.target.getAttribute("data-belongTo")}`).value;
        if (personAge == "") {
            collapsibleAge.textContent = ""
        } else {
            collapsibleAge.textContent = personAge
        }

        // console.log(choosedPlan, personAge)
        setCurrency(event)
    }, 1)
}

function setCurrency(event) {
    let collapsibleCurrency = document.querySelector(`#personDiv${event.target.getAttribute('data-belongTo')} > .collapsible-header > .personCurrency`);
    setTimeout(function () {
        let personAge = document.getElementById(`idade${event.target.getAttribute("data-belongTo")}`).value;
        let vidas = parseInt(document.querySelectorAll('.vidas > .collapsible > li').length)
        console.log(vidas)
        let i = 0;
        let result = prices.filter(function(item){
            // item => item.codigo === choosedPlan
            for (let key in item){
                if(key == "codigo" && item[key] == choosedPlan){
                    if(vidas >= item["minimo_vidas"]){
                        if(personAge >= 0 && personAge <= 17){
                            collapsibleCurrency.textContent = item.faixa1
                        }

                        if(personAge >= 18 && personAge <= 40){
                            collapsibleCurrency.textContent = item.faixa2
                        }

                        if(personAge > 40){
                            collapsibleCurrency.textContent = item.faixa3
                        }
                    }
                }
            }
        });
        // console.log(result)

    }, 1)
}

//consumindo APIS
getPrices();
getPlans();