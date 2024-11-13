const NOTAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const EQUIVALENTES = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb'
};

const INTERVALOS = {
    '1': { semitons: 0, nome: 'Tônica' },
    '2': { semitons: 2, nome: '2ª Maior (Segunda Maior)' },
    'b2': { semitons: 1, nome: '2ª Menor (Segunda Menor)' },
    '3': { semitons: 4, nome: '3ª Maior (Terça Maior)' },
    'b3': { semitons: 3, nome: '3ª Menor (Terça Menor)' },
    '4': { semitons: 5, nome: '4ª Justa (Quarta Justa)' },
    '5': { semitons: 7, nome: '5ª Justa (Quinta Justa)' },
    'b5': { semitons: 6, nome: '5ª Diminuta (Quinta Diminuta)' },
    '#5': { semitons: 8, nome: '5ª Aumentada (Quinta Aumentada)' },
    '6': { semitons: 9, nome: '6ª Maior (Sexta Maior)' },
    'b7': { semitons: 10, nome: '7ª Menor (Sétima Menor)' },
    '7': { semitons: 11, nome: '7ª Maior (Sétima Maior)' },
    '9': { semitons: 14, nome: '9ª (Nona)' },
    'b9': { semitons: 13, nome: '9ª Menor (Nona Menor)' },
    '11': { semitons: 17, nome: '11ª (Décima Primeira)' },
    '11+': { semitons: 18, nome: '11ª Aumentada (Décima Primeira Aumentada)' },
    '13': { semitons: 21, nome: '13ª (Décima Terceira)' },
    '13+': { semitons: 22, nome: '13ª Aumentada (Décima Terceira Aumentada)' },
    'b13': { semitons: 20, nome: '13ª Menor (Décima Terceira Menor)' }
};

function obterIntervalo(tonica, intervalo) {
    tonica = substituirBemolESustenido(tonica); // Certificar que a tônica esteja correta após substituição
    let indiceTonica = NOTAS.indexOf(tonica);
    if (indiceTonica === -1) {
        return "Nota não encontrada";
    }
    const semitons = INTERVALOS[intervalo].semitons;
    let indiceResultante = (indiceTonica + semitons) % NOTAS.length;
    if (indiceResultante < 0) {
        indiceResultante += NOTAS.length;
    }
    return NOTAS[indiceResultante];
}

function analisarAcorde() {
    const acorde = document.getElementById('acorde').value.trim();
    const match = acorde.match(/([A-Ga-g]#?|b?)(.*?)(?:\/([A-Ga-g]#?|b?))?$/);
    if (!match) {
        document.getElementById('resultado').innerHTML = "<p style='color: red;'>Acorde inválido. Por favor, tente novamente.</p>";
        return;
    }

    let [_, tonica, qualif, baixo] = match;
    tonica = substituirBemolESustenido(tonica.toUpperCase());

    if (baixo) {
        baixo = substituirBemolESustenido(baixo.toUpperCase());
    }

    let intervalos = determinarIntervalos(qualif);

    // Obter as notas correspondentes
    const notas = intervalos.map(intervalo => obterIntervalo(tonica, intervalo));
    let resultado = ``;

    if (baixo) {
        resultado += `<p><strong>Baixo Invertido:</strong> ${baixo}</p>`;
    }

    resultado += `<table>
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

    if (baixo) {
        resultado += `<tr class="baixo">
                        <td>Baixo Invertido - Nota mais Grave</td>
                        <td>${baixo}</td>
                      </tr>`;
    }

    resultado += `</table>`;

    document.getElementById('resultado').innerHTML = resultado;

    moveFooterToBottom();
}

function substituirBemolESustenido(nota) {
    return EQUIVALENTES[nota] || nota;
}

function determinarIntervalos(qualif) {
    let intervalos;

    if (qualif.includes('dim') || qualif.includes('o')) {
        intervalos = ['1', 'b3', 'b5']; // Intervalos para acordes diminutos
        if (qualif.includes('7')) {
            intervalos.push('b7'); // Adiciona a sétima menor para acordes meio-diminutos
        }
    } else if (qualif.includes('m')) {
        intervalos = ['1', 'b3', '5']; // Intervalos básicos para um acorde menor
    } else {
        intervalos = ['1', '3', '5']; // Intervalos básicos para um acorde maior
    }

    // Definir intervalos adicionais com base nos qualificadores
    if (qualif.includes('b2')) {
        intervalos.push('b2');
    }
    if (qualif.includes('2')) {
        intervalos.push('2');
    }
    if (qualif.includes('4')) {
        intervalos.push('4');
    }
    
    // Aumentar ou diminuir a quinta
    if (qualif.includes('b5') || qualif.includes('5-')) {
        if (intervalos.includes('5')) {
            intervalos[intervalos.indexOf('5')] = 'b5';
        } else {
            intervalos.push('b5');
        }
    }
    
    if (qualif.includes('#5') || qualif.includes('5+')) {
        if (intervalos.includes('5')) {
            intervalos[intervalos.indexOf('5')] = '#5';
        } else {
            intervalos.push('#5');
        }
    }
    
    // Adicionar sexta, sétima e extensões
    if (qualif.includes('6')) {
        intervalos.push('6');
    }
    
    if (qualif.includes('7')) {
        intervalos.push(qualif.includes('M') ? '7' : 'b7');
    }
    
    // Nona
    if (qualif.includes('b9') || qualif.includes('9-')) {
        if (intervalos.includes('9')) {
            intervalos.splice(intervalos.indexOf('9'), 1); // Remover 9 se já existir
        }
        intervalos.push('b9');
    }
    
    if (qualif.includes('9') && !qualif.includes('b9') && !qualif.includes('9-')) {
        intervalos.push('9');
    }

   // Décima primeira e décima terceira
   if (qualif.includes('11+')) {
       intervalos.push('11+');
   } else if (qualif.includes('11')) {
       intervalos.push('11');
   }
   
   if (qualif.includes('13+')) {
       intervalos.push('13+');
   } else if (qualif.includes('13-') || qualif.includes('b13')) {
       if (intervalos.includes('13')) {
           intervalos.splice(intervalos.indexOf('13'), 1); // Remover 13 se já existir
       }
       intervalos.push('b13');
   } else if (qualif.includes('13')) {
       intervalos.push('13');
   }

   return intervalos;
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
        footer.innerHTML = 'Criado por Music Tech Estudios';
    }
}
