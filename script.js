const NOTAS = ['C', 'Db' , C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const INTERVALOS = {
    '1': { semitons: 0, nome: 'Tônica' },
    'b2': { semitons: 1, nome: '2ª Menor' },
    '2': { semitons: 2, nome: '2ª Maior' },
    'b3': { semitons: 3, nome: '3ª Menor' },
    '3': { semitons: 4, nome: '3ª Maior' },
    '4': { semitons: 5, nome: '4ª Justa' },
    '#4': { semitons: 6, nome: '4ª Aumentada' },
    'b5': { semitons: 6, nome: '5ª Diminuta' },
    '5': { semitons: 7, nome: '5ª Justa' },
    '#5': { semitons: 8, nome: '5ª Aumentada' },
    'b6': { semitons: 8, nome: '6ª Menor' },
    '6': { semitons: 9, nome: '6ª Maior' },
    'b7': { semitons: 10, nome: '7ª Menor' },
    '7': { semitons: 11, nome: '7ª Maior' },
    '9': { semitons: 14, nome: '9ª' },
    '11': { semitons: 17, nome: '11ª' },
    '13': { semitons: 21, nome: '13ª' }
};

function obterIntervalo(tonica, intervalo) {
    const indiceTonica = NOTAS.indexOf(tonica);
    const semitons = INTERVALOS[intervalo].semitons;
    const indiceResultante = (indiceTonica + semitons) % NOTAS.length;
    return NOTAS[indiceResultante];
}

function analisarAcorde() {
    const acorde = document.getElementById('acorde').value.trim();
    const match = acorde.match(/([A-Ga-g]#?)(.*)/);
    if (!match) {
        document.getElementById('resultado').innerHTML = "<p style='color: red;'>Acorde inválido. Por favor, tente novamente.</p>";
        return;
    }

    let [_, tonica, qualif] = match;
    tonica = tonica.toUpperCase();

    let intervalos = [];
    if (qualif.includes('m7b5')) {
        intervalos = ['1', 'b3', 'b5', 'b7'];
    } else if (qualif.includes('m')) {
        intervalos = ['1', 'b3', '5'];
    } else if (qualif.includes('dim') || qualif.includes('o')) {
        intervalos = ['1', 'b3', 'b5'];
    } else if (qualif.includes('sus2')) {
        intervalos = ['1', '2', '5'];
    } else if (qualif.includes('sus4')) {
        intervalos = ['1', '4', '5'];
    } else if (qualif.includes('5+')) {
        intervalos = ['1', '3', '#5'];
    } else {
        intervalos = ['1', '3', '5'];
    }

    if (qualif.includes('b5')) {
        intervalos[2] = 'b5';
    }
    if (qualif.includes('#5') && !qualif.includes('5+')) {
        intervalos[2] = '#5';
    }
    if (qualif.includes('4') && !qualif.includes('sus4')) {
        intervalos.push('4');
    }
    if (qualif.includes('6')) {
        intervalos.push('6');
    }
    if (qualif.includes('7')) {
        intervalos.push(qualif.includes('M') ? '7' : 'b7');
    }
    if (qualif.includes('9')) {
        intervalos.push('9');
    }
    if (qualif.includes('11')) {
        intervalos.push('11');
    }
    if (qualif.includes('13')) {
        intervalos.push('13');
    }

    const notas = intervalos.map(intervalo => obterIntervalo(tonica, intervalo));
    let resultado = `<p><strong>Raiz do Acorde:</strong> ${tonica}</p>
                     <table>
                        <tr>
                            <th>Intervalo</th>
                            <th>Nota</th>
                        </tr>`;
    intervalos.forEach((intervalo, i) => {
        resultado += `<tr class="${intervalo === '1' ? 'raiz' : ''}">
                        <td>${INTERVALOS[intervalo].nome}</td>
                        <td>${notas[i]}</td>
                      </tr>`;
    });
    resultado += `</table>`;

    document.getElementById('resultado').innerHTML = resultado;

    moveFooterToBottom();
}

function moveFooterToBottom() {
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.width = '100%';
        footer.style.textAlign = 'center';
        footer.style.backgroundColor = '#f0f8ff';
        footer.style.padding = '10px 0';
        //footer.innerHTML = 'Criado por Music Tech Estudios';
    }
}
