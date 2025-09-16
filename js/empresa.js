// Função para remover tudo que não for dígito
function onlyDigits(str) {
    return str.replace(/\D/g, '');
}

// Elementos do formulário
const cnpjInput = document.getElementById('cnpj');
const cepInput = document.getElementById('cep');

const feedbackCnpj = document.getElementById('feedback-cnpj');
const feedbackCep = document.getElementById('feedback-cep');

const btnSubmit = document.querySelector('button[type="submit"]');

// Mostrar feedback na UI
function showFeedback(element, message, isError = false) {
    element.textContent = message;
    element.className = isError ? 'error' : 'success';
}

// Mostrar/ocultar loading spinner ao lado do input
function setLoading(inputElement, isLoading) {
    if (isLoading) {
        // cria spinner se não existir
        if (!inputElement.nextSibling || !inputElement.nextSibling.classList || !inputElement.nextSibling.classList.contains('loading')) {
            const spinner = document.createElement('span');
            spinner.classList.add('loading');
            inputElement.parentNode.insertBefore(spinner, inputElement.nextSibling);
        }
        btnSubmit.disabled = true;
    } else {
        // remove spinner
        if (inputElement.nextSibling && inputElement.nextSibling.classList && inputElement.nextSibling.classList.contains('loading')) {
            inputElement.nextSibling.remove();
        }
        btnSubmit.disabled = false;
    }
}

// Preencher campos do formulário com dados do CNPJ
function fillCNPJData(data) {
    document.getElementById('razaoSocial').value = data.razao_social || '';
    document.getElementById('nomeFantasia').value = data.nome_fantasia || '';
    document.getElementById('cnpj').value = data.cnpj || '';
    document.getElementById('cep').value = data.cep || '';
    document.getElementById('logradouro').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('municipio').value = data.municipio || '';
    document.getElementById('uf').value = data.uf || '';
}

// Preencher campos do formulário com dados do CEP
function fillCEPData(data) {
    document.getElementById('logradouro').value = data.street || data.logradouro || '';
    document.getElementById('bairro').value = data.neighborhood || data.bairro || '';
    document.getElementById('municipio').value = data.city || data.localidade || '';
    document.getElementById('uf').value = data.state || data.uf || '';
}


// Função para buscar dados da BrasilAPI pelo CNPJ
async function fetchCNPJ() {
    const rawCnpj = cnpjInput.value;
    const cnpj = onlyDigits(rawCnpj);

    feedbackCnpj.textContent = '';
    if (cnpj.length !== 14) {
        showFeedback(feedbackCnpj, 'CNPJ deve ter 14 dígitos', true);
        return;
    }

    setLoading(cnpjInput, true);

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('CNPJ não encontrado');
            } else {
                throw new Error('Erro ao consultar CNPJ');
            }
        }
        const data = await response.json();
        fillCNPJData(data);
        showFeedback(feedbackCnpj, 'Dados do CNPJ carregados com sucesso');
    } catch (error) {
        showFeedback(feedbackCnpj, error.message, true);
    } finally {
        setLoading(cnpjInput, false);
    }
}

// Função para buscar dados da BrasilAPI pelo CEP
async function fetchCEP() {
    const rawCep = cepInput.value;
    const cep = onlyDigits(rawCep);

    feedbackCep.textContent = '';
    if (cep.length !== 8) {
        showFeedback(feedbackCep, 'CEP deve ter 8 dígitos', true);
        return;
    }

    setLoading(cepInput, true);

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('CEP não encontrado');
            } else {
                throw new Error('Erro ao consultar CEP');
            }
        }
        const data = await response.json();
        fillCEPData(data);
        showFeedback(feedbackCep, 'Dados do CEP carregados com sucesso');
    } catch (error) {
        showFeedback(feedbackCep, error.message, true);
    } finally {
        setLoading(cepInput, false);
    }
}

// Event listeners blur para os inputs
cnpjInput.addEventListener('blur', fetchCNPJ);
cepInput.addEventListener('blur', fetchCEP);

// Previne envio do form para teste local
document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Formulário enviado!');
});
