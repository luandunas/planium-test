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
            let html_to_insert = `
        <div class="card blue-grey darken-1" data-codigo="${plan.codigo}">
            <div class="card-content white-text">
                <span class="card-title">${plan.nome}</span>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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

function checkout(e, planCodigo){
    choosedPlan = planCodigo;
    document.getElementById('cards').remove();
    var result = plans.filter(item => item.codigo === choosedPlan);
    let checkoutHtml = `
    <div class="vidas" id="vidas">
        <h3 class="planText">${result[0].nome}</h3>
        <ul class="collapsible">
        <li id=titular${document.querySelectorAll('.vidas > .collapsible > li').length} class="active">
            <div class="collapsible-header"><div class="leftSide"><i class="material-icons">person</i>Titular</div><i class="material-icons" id="dropwdownArrow">expand_more</i></div>
            <div class="collapsible-body">
                <form class="form">
                    <div class="input-field">
                        <input id="name${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}" onkeydown="writeTitleName(event)">
                        <label class="active" for="name${document.querySelectorAll('.vidas > .collapsible > li').length}">Nome</label>
                    </div>

                    <div class="input-field">
                        <input id="idade${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate">
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

    //inicializando elementos collapsible do materialize
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems)
}

function addPerson() {
    let personToInsert = `
    <li id=titular${document.querySelectorAll('.vidas > .collapsible > li').length}>
        <div class="collapsible-header"><div class="leftSide"><i class="material-icons">person</i>Titular</div><i class="material-icons" id="dropwdownArrow">expand_more</i></div>
        <div class="collapsible-body">
            <form class="form">
                <div class="input-field">
                    <input id="name${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate" data-belongTo="${document.querySelectorAll('.vidas > .collapsible > li').length}" onkeydown="writeTitleName(event)">
                    <label class="active" for="name${document.querySelectorAll('.vidas > .collapsible > li').length}">Nome</label>
                </div>

                <div class="input-field">
                    <input id="idade${document.querySelectorAll('.vidas > .collapsible > li').length}" type="text" class="validate">
                    <label class="active" for="idade${document.querySelectorAll('.vidas > .collapsible > li').length}">Idade</label>
                </div>
            </form>
        </div>
    </li>
    `
    document.querySelector('.vidas > .collapsible').insertAdjacentHTML('beforeend', personToInsert);
}

function writeTitleName(event) {
    let collapsibleTitle = document.querySelector(`#titular${event.target.getAttribute('data-belongTo')} > .collapsible-header > .leftSide`).childNodes[1];
    setTimeout(function () {
        let userName = document.getElementById(`name${event.target.getAttribute("data-belongTo")}`).value;
        if (userName == "") {
            collapsibleTitle.textContent = "Titular"
        } else {
            collapsibleTitle.textContent = document.getElementById(`name${event.target.getAttribute("data-belongTo")}`).value
        }
    }, 1)
    // document.querySelector(`#titular${e.currentTarget.getAttribute('data-belongTo')} > .collapsible-header > leftSide`).innerText = e.currentTarget.value
}

//consumindo APIS
getPlans();
getPrices();