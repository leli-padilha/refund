// Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseTotal = document.querySelector("aside header h2")
const expenseQuantity = document.querySelector("aside header p span")

// Caotura o evento de input para formatar o valor.
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")

    // Transforma o valor em centavos
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    // Formata o valor no padrão BRL (Real Brasileiro)
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}

// Captura do evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
    // Previne o comportamento padrão de recarregar a pagina
    event.preventDefault()

    // Cria um objeto com os detalhes na nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }

    expenseAdd(newExpense)
}


// adiciona um novo item na lista
function expenseAdd(newExpense) {
    try {
        // Cria o elemento li para adicionar o item na lista ul
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //Cria o ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Adiciona nome e categoria na div
        expenseInfo.append(expenseName, expenseCategory)

        // Cria a tag span que vai o valor
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `
                                    <small>R$</small>
                                    ${newExpense.amount
                                    .toUpperCase()
                                    .replace("R$", "")}
                                `

        // Cria o ícone de remover                       
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remove icon")

        // Adiciona as informações no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Adiciona o item na lista
        expenseList.append(expenseItem)

        // limpa o formulario para adicionar um novo item
        formClear()

        // atualiza os totais, chama a função updateTotals
        updateTotals()

    } catch (error){
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}

// atualizar os totais 
function updateTotals() {
    try{
        // pegando todos os itens (li) da lista (ul)
        const items = expenseList.children

        // Atualizar a quantidade de itens da lista
        expenseQuantity.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`

        // Variavel que vai incrementar o total
        let total = 0

        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remove caracteres não numéricos e substitui a virgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            
            // Converte o valor para float
            value = parseFloat(value)

            //Verifica se é um número válido
            if(isNaN(value)){
                return alert(
                    "Não foi possível calcular o total. O valor não parece ser um número."
                )
            }

            // Incrementar o valor total
            total += Number(value)
        }

        // Cria a span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // formata o valor e remove o R$ que será exibido pela small com estilo costumizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // limpa o conteúdo do elemento
        expenseTotal.innerHTML = ""

        // adicionar o simbolo formatado e o valor total
        expenseTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais")
    }
}

// evento que captura o clique nos items da lista 
expenseList.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove-icon")){
       
        // obetém a li pai do elemento clicado
        const item = event.target.closest(".expense")

        // remove o item da lista
        item.remove()
    }

    // atualiza os totais
    updateTotals()
})

function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}